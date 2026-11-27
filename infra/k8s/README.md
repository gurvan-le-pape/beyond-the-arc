# Kubernetes

The k3s lab: the platform rehearsed on Kubernetes on the maintainer's machine, before it
moves to `bta-prod-k3s` (the CX33, see `../ansible/README.md`). Production still runs on
Docker Compose (`docs/infrastructure.md`).

The lab is k3s in Docker, through k3d, shaped like the production host: one server node
and no agent, capped at the CX33's 8 GB, with the k3s release the host will run
(`lab/cluster.yaml`). Running the same distribution as production, rather than kind's
upstream Kubernetes, means the lab exercises what production will: k3s's bundled
Traefik, ServiceLB, local-path storage and metrics-server, and its SQLite datastore.

| Path | What it is |
|---|---|
| `Dockerfile` | the tools image: k3d, kubectl, Helm, the Argo CD CLI, kubeconform, each pinned and checked by sha256 |
| `k.sh` | runs one of those tools in that image |
| `validate.sh` | validates the manifests with kubeconform |
| `lab/cluster.yaml` | the lab cluster, as k3d's configuration |
| `bootstrap.sh` | installs Argo CD and hands it the root Application |
| `root.yaml` | the root Application, which renders `apps/` |
| `apps/` | the app of apps: a chart with one Application per component |
| `argocd/values.yaml` | the argo-cd chart's values, for the install and for every sync after it |
| `database/` | the application's PostgreSQL, a CloudNativePG `Cluster` |
| `restore.sh` | restores the latest production backup into it |

## Running it

The tools run only through `k.sh`, in the image built from `Dockerfile`; nothing is
installed on the machine. The container runs as the calling user, on the host network,
from this directory:

```bash
infra/k8s/k.sh k3d cluster create --config lab/cluster.yaml
infra/k8s/k.sh kubectl get pods -A
infra/k8s/k.sh k3d cluster stop bta-lab      # keeps the cluster, frees its memory
infra/k8s/k.sh k3d cluster start bta-lab
infra/k8s/k.sh k3d cluster delete bta-lab    # the cluster and everything in it
```

| Endpoint | Host address |
|---|---|
| API server | `https://127.0.0.1:6550` |
| Traefik, HTTP and HTTPS | `127.0.0.1:8080`, `127.0.0.1:8443` |

All three listen on loopback only. Ports 80 and 443 are left to whatever else runs on the
machine; production's node takes them directly, with no load balancer in front, so k3d's
load balancer container is disabled and the ports map straight to the server node.

State is kept outside the repository, at the same paths inside the container as on the
machine:

- `~/.config/bta-k8s/kubeconfig`: the lab's kubeconfig, which `k3d cluster create`
  writes and every tool reads (`KUBECONFIG`). It holds the cluster's admin credentials.
- `~/.config/bta-k8s/.k3d-*`: the files k3d mounts into the node (a `/proc/meminfo`
  reporting 8 GB, so that the kubelet sees the cap). The Docker daemon resolves those
  bind mounts on the machine, which is why the directory is mounted at its own path.
- `~/.config/bta-k8s/argocd/config`: the Argo CD CLI's login, once `argocd login` has
  run; it holds a session token.
- `~/.cache/bta-k8s`: Helm's cache.

Only `k3d` gets the Docker socket, which it needs to create the node containers; kubectl,
Helm and the others reach the cluster through the API server alone. k3d's helper image
(`k3d-tools`) is pinned by digest in `k.sh`, since k3d otherwise pulls it by tag.

## Argo CD

Argo CD deploys everything in the cluster from this repository, itself included. After
`bootstrap.sh`, nothing is applied by hand except `root.yaml`:

```
root (root.yaml, applied by bootstrap.sh)
└── renders apps/, a chart of Applications
    ├── argocd: the argo-cd chart, with argocd/values.yaml
    ├── cnpg: the CloudNativePG operator chart (namespace cnpg-system)
    └── database: database/, the PostgreSQL Cluster (namespace bta)
```

`bootstrap.sh` installs the argo-cd chart once, at the version in `apps/values.yaml`,
rendered by `helm template` and applied server-side, then applies `root.yaml`. From then
on the `argocd` Application keeps Argo CD from the same chart version and values file, so
a change to Argo CD is a commit. It is not a Helm release: `helm list` shows nothing, and
nothing should be installed with `helm install`, since Argo CD would then share those
objects with a release record that goes stale.

Every Application syncs automatically, prunes what Git no longer declares, and reverts
what was changed in the cluster by hand (`selfHeal`). The Applications carry no
finalizer: deleting one stops Argo CD managing its objects and leaves them running.

```bash
infra/k8s/k.sh ./bootstrap.sh                 # install, root follows main
infra/k8s/k.sh ./bootstrap.sh <branch>        # root and every Application follow a pushed branch
infra/k8s/k.sh kubectl -n argocd get applications
```

A branch is tried whole: `bootstrap.sh <branch>` points root at it and passes it to the
apps chart as `targetRevision`, which every Application reads. Argo CD reads the
repository from GitHub, so the branch must be pushed; running `bootstrap.sh` again with no
argument goes back to `main`.

The web interface and the CLI go through a port-forward; the `admin` account is the only
login (no Dex):

```bash
infra/k8s/k.sh kubectl -n argocd port-forward svc/argocd-server 8081:443   # https://127.0.0.1:8081
infra/k8s/k.sh argocd admin initial-password -n argocd
```

The lab leaves out what the app of apps does not use: Dex, notifications and the
ApplicationSet controller (scaled to zero; its CRD stays, as the chart installs it).

## Database

PostgreSQL runs under the CloudNativePG operator, which turns the `Cluster` in
`database/cluster.yaml` into a pod, its volume, its services (`database-rw` for
read-write) and its Secrets. It is the release production runs, PostgreSQL 18.7, as one
instance, like production's single container. CloudNativePG creates the `btadb`
database, owned by the `bta` role, and writes that role's credentials and connection
strings to the `database-app` Secret; the `postgres` superuser has no password and is
reached only from inside the pod.

The data is production's, from the latest backup in R2:

```bash
infra/k8s/restore.sh            # the latest daily backup
infra/k8s/restore.sh weekly
```

The restore runs on the maintainer's machine, not as a Job in the cluster. The backup is
encrypted to the maintainer's age key; a Job would need that key, and the R2 token, as
Secrets in the cluster, and the key decrypts every backup ever made. Instead the dump is
streamed from R2 through `age` in the `ansible.sh` image (the read token and key that
`../ansible/restore-test.sh` uses) into `pg_restore` inside the database pod, through
the API server. The decrypted dump never touches a disk.

`restore.sh` restores as `bta`, so that the application's role owns every object, then
runs `ANALYZE` and prints the figures of `../ansible/backup-counts.sql`. `restore-test.sh`
prints the same figures for a throwaway restore of the same dump, and compares those with
production. It refuses a database that already has tables; to restore again, delete the
`Cluster`, and Argo CD recreates it empty:

```bash
infra/k8s/k.sh kubectl -n bta delete cluster database
```

## Validation

`validate.sh` checks what reaches the cluster with kubeconform in strict mode: an unknown
or misspelt field is an error, not a field the API server would silently drop. That is
the plain manifests (`root.yaml`, `database/`), the `apps/` chart as `helm template`
renders it, and each upstream chart an Application installs (argo-cd with
`argocd/values.yaml`, cloudnative-pg), at the version `apps/values.yaml` pins. Kubernetes' own kinds are checked
against the schemas of the cluster's version, read from the k3s image tag in
`lab/cluster.yaml`, from `yannh/kubernetes-json-schema`; custom resources (`Application`, `Cluster`)
against `datreeio/CRDs-catalog`; both at pinned commits. `CustomResourceDefinition` itself
is skipped: its schema is recursive, so no standalone file exists for it, and the CRDs
come unchanged from upstream charts.

```bash
infra/k8s/k.sh ./validate.sh
```

CI builds the same image and runs it (`scripts/ci/lint-infra.sh`), with a network for the
build and for the schemas, and with no access to any cluster.

## Memory baseline

The empty cluster, measured on 2026-11-27, ten minutes after `k3d cluster create`, with
nothing installed beyond what k3s bundles (CoreDNS, Traefik, ServiceLB, local-path,
metrics-server):

| Measure | Value |
|---|---|
| node working set (`kubectl top node`, `docker stats`) | 761 MiB of 8 GiB (9 %), steady between 759 and 778 MiB over a minute |
| of which the pods (`kubectl top pods -A`) | 64 MiB; the rest is the k3s process (API server, kubelet, containerd, SQLite) |
| node cgroup, page cache included | 1.54 GiB (673 MiB anonymous, 814 MiB file) |
| CPU at rest | about 50 millicores |

With Argo CD (`bootstrap.sh`, ten minutes after it):

| Measure | Value |
|---|---|
| node working set | 1.73 GiB of 8 GiB (21 %), +0.97 GiB, steady over a minute |
| of which Argo CD's pods | 246 MiB: application controller 138, repo server 74, server 27, Redis 6 |
| the rest of the increase | the k3s process (1.05 GiB resident), whose API server now serves Argo CD's CRDs and its watches, and the file cache of the pulled images |
| node cgroup, page cache included | 2.95 GiB (1.22 GiB anonymous) |
| CPU at rest | about 85 millicores |

With the database restored (`restore.sh`, the 2026-11-27 dump: 8.8 GB on disk), at rest
after autovacuum had finished with `match_events`:

| Measure | Value |
|---|---|
| node working set | 6.89 GiB of 8 GiB (86 %); `database-1` alone 5.1 GiB |
| anonymous memory (what cannot be reclaimed) | 1.45 GiB |
| page cache | 6.25 GiB, 5.2 GiB of it active: the database's files |
| during the restore | the node reached its 8 GiB limit and the kernel reclaimed page cache (109,000 times at the limit, no OOM kill) |

The working set counts the active page cache, so with a database larger than the memory
it settles near the limit whatever the load: it measures the cache, not what the platform
needs. Anonymous memory is the figure that cannot be given back.

Every later stage of the lab is measured against these figures. The
phase's no-go threshold is an idle working set above 75 % of the 8 GiB, 6 GiB. The figures
are k3s inside a Docker container on WSL 2; k3s directly on the CX33 shares neither, so
they place the platform's cost, not production's to the megabyte.

## Versions

| Component | Version | Where |
|---|---|---|
| k3s | v1.37.2+k3s1 | `lab/cluster.yaml` (by digest) |
| k3d | 5.9.0 | `Dockerfile`, `k.sh` (its `k3d-tools` image) |
| kubectl | 1.37.2 | `Dockerfile`, within one minor version of k3s |
| Helm | 4.3.2 | `Dockerfile` |
| Argo CD | 3.6.3, chart 10.20.0 | `apps/values.yaml` (chart); `Dockerfile` (CLI, same release) |
| CloudNativePG | 1.30.2, chart 0.29.2 | `apps/values.yaml` |
| PostgreSQL | 18.7 (`minimal` image) | `database/cluster.yaml` (by digest) |
| kubeconform | 0.8.0 | `Dockerfile`; schemas at the commit in `validate.sh` |

A version changes by editing the file, with the sha256 its release publishes; a new k3s
release also moves kubectl, and the schema commit if it predates that release.
