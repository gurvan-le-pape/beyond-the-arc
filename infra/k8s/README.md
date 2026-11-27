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
| `Dockerfile` | the tools image: k3d, kubectl, Helm, the Argo CD CLI, kubeseal, kubeconform, each pinned and checked by sha256 |
| `k.sh` | runs one of those tools in that image |
| `validate.sh` | validates the manifests with kubeconform |
| `lab/cluster.yaml` | the lab cluster, as k3d's configuration |
| `bootstrap.sh` | installs Argo CD and hands it the root Application |
| `root.yaml` | the root Application, which renders `apps/` |
| `apps/` | the app of apps: a chart with one Application per component |
| `argocd/values.yaml` | the argo-cd chart's values, for the install and for every sync after it |
| `database/` | the application's PostgreSQL, a CloudNativePG `Cluster` |
| `restore.sh` | restores the latest production backup into it |
| `app/` | the application: a Kustomize base and the lab overlay |
| `issuers/` | the certificate issuer and the Cloudflare token it uses, sealed |
| `observability/` | Grafana, Loki, the blackbox exporter, Alloy and the scrape targets |
| `apps/values/` | the values of a chart Application, read by it and by `validate.sh` |

## Running it

The tools run only through `k.sh`, in the image built from `Dockerfile`; nothing is
installed on the machine. The container runs as the calling user, on the host network,
from this directory, with the whole repository mounted (`observability/` reads
production's files under `docker/config/`):

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
    ├── database: database/, the PostgreSQL Cluster (namespace bta)
    ├── app: app/lab/, backend, frontend, scheduler, the migration and the Ingress (namespace bta)
    ├── cert-manager: the cert-manager chart, with its CRDs (namespace cert-manager)
    ├── sealed-secrets: the Sealed Secrets controller chart (namespace kube-system)
    ├── issuers: issuers/, the ClusterIssuer and the sealed Cloudflare token
    ├── kube-prometheus-stack: the operator, Prometheus, node-exporter, kube-state-metrics (namespace monitoring)
    └── observability: observability/, Grafana, Loki, blackbox, Alloy, scrape targets (namespace monitoring)
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

## Application

`app/base/` is the application as any environment runs it, `app/lab/` what the lab sets:

| Object | What it is |
|---|---|
| `Job/migrate` | `prisma migrate deploy`, an Argo CD `PreSync` hook |
| `Deployment/backend`, `Service/backend` | the API, port 4000 |
| `Deployment/frontend`, `Service/frontend` | the Next.js server, port 3000 |
| `Deployment/scheduler` | the match generator, one replica, `Recreate` |
| `ConfigMap/app-<hash>` | `FRONTEND_URL`, from the overlay |

Compose's ordering, kept: the migration runs to completion before Argo CD applies
anything else in a sync, so the backend and the scheduler never run on an older schema,
and a failed migration stops the sync with the running pods untouched. It runs on every
sync and has nothing to do when the schema is current. The frontend's init container
waits for the backend's `/api/health`, which is compose's wait on a healthy backend.

The images are the ones CI built, started and pushed for a commit of `main`, by digest
(`app/lab/kustomization.yaml`); moving the lab to another commit is a commit changing the
four digests. They are public on GHCR, so the cluster pulls them with no credential.

The application needs no Secret from outside the cluster. `DATABASE_URL` is the `uri`
key of the `database-app` Secret that CloudNativePG writes for the `bta` role, so the
password is never in Git or on the machine. The lab sets no `SENTRY_DSN`: the SDK then
sends nothing, and the lab stays out of production's issues.

Every pod runs as its image's non-root user, with a read-only root filesystem (an
`emptyDir` for `/tmp`, and for the frontend's image cache), no capability, the default
seccomp profile and no service account token. The backend and the frontend update one pod
at a time, the new one ready before the old one stops, and a stopping pod keeps serving
for five seconds while it leaves the Service: two rolling restarts of both, under a
request every 0.2 s, failed none of about 1,700 requests (2 of 475 without that delay).
A deploy no longer has the seconds of 502 that recreating the compose containers gives.

The Ingress (`app/lab/ingress.yaml`) serves `lab.beyondthearc.app` through k3s's
Traefik, routed as production's Nginx routes it: `/api`, the API and its Swagger UI, to
the backend; everything else to the frontend. The frontend's bundle calls the relative
`/api`, so the browser's requests go to the lab as well. No public DNS record points at
the lab; a client resolves the name to it:

```bash
curl --resolve lab.beyondthearc.app:8443:127.0.0.1 -k https://lab.beyondthearc.app:8443/en
infra/k8s/k.sh kubectl -n bta logs deploy/scheduler -f
```

For a browser, `127.0.0.1 lab.beyondthearc.app` in the hosts file (on WSL, Windows'
`C:\Windows\System32\drivers\etc\hosts`), then `https://lab.beyondthearc.app:8443/en`,
past the warning for the staging certificate. Not yet as in production: plain HTTP is
served rather than redirected, and the security headers Nginx adds (CSP, HSTS and the
rest) are not set.

## Certificates

cert-manager issues `lab.beyondthearc.app`'s certificate from Let's Encrypt's staging
CA (`issuers/letsencrypt-staging.yaml`): the real ACME flow, with rate limits far above
production's, and a certificate no browser trusts. It proves the name by DNS-01: it
writes an `_acme-challenge` TXT record through Cloudflare's API and removes it once the
CA has checked it, so the lab needs no public address and no inbound port. Those records
are not in Terraform's state, and a Cloudflare plan stays empty. Issued 2026-11-27 in
under two minutes; cert-manager renews it before it expires.

```bash
infra/k8s/k.sh kubectl -n bta get certificate,order
```

The Cloudflare token can edit DNS records on the `beyondthearc.app` zone and nothing
else, and expires on 2027-02-25. It is in Git only sealed (`issuers/cloudflare-api-token.sealed.yaml`):
encrypted to the Sealed Secrets controller's public key, so only that controller, in
this cluster, can decrypt it, and only into the `cloudflare-api-token` Secret in
`cert-manager` (the name and namespace are part of the encryption). The plain token
stays on the maintainer's machine, in `~/.config/bta-k8s/cloudflare-dns.env`
(`CLOUDFLARE_API_TOKEN=…`, mode 600).

The controller generates its key in the cluster. A new cluster has a new key and cannot
open what the old one sealed, so after `k3d cluster create`, or with a new token, seal it
again and commit the file:

```bash
cd infra/k8s && ./k.sh sh -c ". $HOME/.config/bta-k8s/cloudflare-dns.env &&
  kubectl create secret generic cloudflare-api-token --namespace cert-manager \
    --from-literal=api-token=\"\$CLOUDFLARE_API_TOKEN\" --dry-run=client -o json |
  kubeseal --format yaml" > issuers/cloudflare-api-token.sealed.yaml
```

The plain Secret exists only in that pipe; kubeseal fetches the public key from the
controller through the API server. The header comment of the sealed file is written by
hand.

## Observability

Production's monitoring, on Kubernetes:

| Production (Compose) | Lab |
|---|---|
| Prometheus, static scrape configuration | Prometheus under its operator (kube-prometheus-stack): a `ServiceMonitor` for the backend, two `Probe`s for the blackbox jobs |
| node-exporter, cAdvisor | the chart's node-exporter; the kubelet's cAdvisor |
| Grafana, provisioning under `docker/config/grafana/` | Grafana with the same files |
| Loki, `docker/config/loki.yml` | Loki with the same file |
| blackbox exporter, `docker/config/blackbox.yml` | the same, with the same file |
| Promtail, through the Docker socket | Alloy, through the API server |

The files are shared, not copied: `observability/kustomization.yaml` builds its
ConfigMaps from `docker/config/`, so an alert rule or the dashboard changes once for both,
and the eight rules evaluate here exactly as in production. That needs Kustomize to read
outside its directory, which Argo CD allows (`argocd/values.yaml`,
`kustomize.buildOptions`) and `validate.sh` passes. The names production's files use are
kept: the backend's scrape job is `backend` (a `ServiceMonitor` takes the Service's name),
the probe jobs are `blackbox-http` and `blackbox-tcp`, a `prometheus` Service fronts the
operator's Prometheus, and Alloy labels logs with `service`, the pod's
`app.kubernetes.io/name`, so `{service="backend"}` finds the backend's logs. Grafana's
datasources get production's UIDs, which the rules name. `containers.json` stays out: it
reads cAdvisor's Docker Compose labels.

Left out of the chart: Grafana (the one above), Alertmanager and the default rules (the
alerting is Grafana's, as in production), and the scrape targets k3s does not have
(etcd, scheduler, controller-manager, kube-proxy). Out as well, the API server's and the
kubelet's own `/metrics`: k3s runs both in one process, and those two carried 129,000 of
140,000 series and took Prometheus from 101 to 559 MiB, for histograms nothing here
reads.

At rest, 2026-11-27: 16 targets up, 10,400 series; six rules Normal. Two fire, and both
are true of the lab rather than faults: Disk Full finds no `/` filesystem (the k3d node is
a container whose root node-exporter does not report; on the CX33 it is the host's), and
Database Backup Missing has no backup to see (the lab has no backup timer; production's
cluster gets CloudNativePG's). No notification leaves the lab: SMTP is off, so a firing
rule shows in Grafana and its notification fails in Grafana's log.

```bash
infra/k8s/k.sh kubectl -n monitoring port-forward svc/grafana 3001:3000   # http://127.0.0.1:3001, admin
infra/k8s/k.sh kubectl -n monitoring port-forward svc/prometheus 9090:9090
```

The admin password is generated on the maintainer's machine
(`~/.config/bta-k8s/grafana-admin.env`, `GRAFANA_ADMIN_PASSWORD=…`, mode 600) and sealed
in `observability/grafana-admin.sealed.yaml`, resealed like the Cloudflare token.

## Validation

`validate.sh` checks what reaches the cluster with kubeconform in strict mode: an unknown
or misspelt field is an error, not a field the API server would silently drop. That is
the plain manifests (`root.yaml`, `database/`, `issuers/`), the `apps/` chart as `helm
template` renders it, `app/lab` and `observability` as `kubectl kustomize` builds them,
and each upstream chart an Application installs (argo-cd with `argocd/values.yaml`,
cloudnative-pg, cert-manager, sealed-secrets, kube-prometheus-stack with
`apps/values/kube-prometheus-stack.yaml`), at the version `apps/values.yaml` pins.
Kubernetes' own kinds are checked against the schemas of the cluster's version, read from
the k3s image tag in `lab/cluster.yaml`, from `yannh/kubernetes-json-schema`; custom
resources (`Application`, `Cluster`, `ClusterIssuer`, `SealedSecret`, `ServiceMonitor`,
`Probe`) against `datreeio/CRDs-catalog`; both at pinned commits. `CustomResourceDefinition` itself
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

With the application (`app/lab`), over three minutes at rest, the scheduler with no
match due:

| Measure | Value |
|---|---|
| backend, frontend, scheduler | 88 to 99 MiB, 127 to 130 MiB, 42 MiB |
| node working set | 5.22 GiB of 8 GiB (65 %), the kernel having given back database cache since |
| anonymous memory | 1.81 GiB, +0.36 GiB for the application |

The requests are those figures rounded up; the limits leave room for load, which a later
stage measures.

With cert-manager, Sealed Secrets and the Ingress, a minute after the certificate was
issued:

| Measure | Value |
|---|---|
| cert-manager (controller, cainjector, webhook) | 32, 33, 12 MiB |
| Sealed Secrets controller | 11 MiB |
| Traefik, now serving the Ingress | 113 MiB |
| node working set | 3.66 GiB of 8 GiB |
| anonymous memory | 2.03 GiB (25 %) |

With the observability stack, at rest:

| Measure | Value |
|---|---|
| Prometheus, Grafana, Loki, Alloy | 101, 126, 101, 53 MiB |
| operator, kube-state-metrics, blackbox, node-exporter | 32, 24, 23, 13 MiB |
| all of `monitoring` | 473 MiB |
| the k3s process (resident) | 1.66 GiB, from 1.05 with Argo CD alone: the API server holds the operator's CRDs and serves more watches |
| Argo CD's application controller (resident) | 395 MiB, watching the added resources |
| node working set | 5.14 GiB of 8 GiB |
| anonymous memory | 2.97 GiB (37 %) |

Every later stage of the lab is measured against these figures. The phase's no-go
threshold is idle anonymous memory above 75 % of the 8 GiB, 6 GiB, on the node's cgroup
(`anon` in `memory.stat`). Not the working set: with a database larger than the memory,
the page cache fills it to near the limit at any load, so a working-set threshold would
fail on the cache, which the kernel gives back, and say nothing about what the platform
holds. The working set stays in the tables as the figure tools report. The figures
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
| cert-manager | v1.21.3 (chart of the same version) | `apps/values.yaml` |
| Sealed Secrets | 0.41.2, chart 2.22.0 | `apps/values.yaml` (chart); `Dockerfile` (kubeseal, same release) |
| Traefik | k3s's bundled chart (41.6.1) | the k3s release |
| kube-prometheus-stack | chart 94.2.0 (operator v0.95.2) | `apps/values.yaml` |
| Grafana, Loki, blackbox exporter | 13.0.13, 3.7.1, 0.29.1, production's | `observability/` (by digest) |
| Alloy | v1.22.0 | `observability/alloy.yaml` (by digest) |
| kubeconform | 0.8.0 | `Dockerfile`; schemas at the commit in `validate.sh` |

A version changes by editing the file, with the sha256 its release publishes; a new k3s
release also moves kubectl, and the schema commit if it predates that release.
