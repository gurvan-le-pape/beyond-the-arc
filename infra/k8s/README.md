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
- `~/.cache/bta-k8s`: Helm's cache.

Only `k3d` gets the Docker socket, which it needs to create the node containers; kubectl,
Helm and the others reach the cluster through the API server alone. k3d's helper image
(`k3d-tools`) is pinned by digest in `k.sh`, since k3d otherwise pulls it by tag.

## Validation

`validate.sh` checks every manifest under this directory, except k3d's configuration,
with kubeconform in strict mode: an unknown or misspelt field is an error, not a field the
API server would silently drop. The schemas are those of the cluster's Kubernetes version,
read from the k3s image tag in `lab/cluster.yaml`, downloaded from
`yannh/kubernetes-json-schema` at a pinned commit. A custom resource (an Argo CD
`Application`, a CloudNativePG `Cluster`) needs its own schema location, added with the
first one.

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

Every later stage of the lab is measured against these figures, on the working set. The
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
| Argo CD CLI | 3.6.3 | `Dockerfile` |
| kubeconform | 0.8.0 | `Dockerfile`; schemas at the commit in `validate.sh` |

A version changes by editing the file, with the sha256 its release publishes; a new k3s
release also moves kubectl, and the schema commit if it predates that release.
