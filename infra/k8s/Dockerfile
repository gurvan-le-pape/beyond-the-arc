# The image the Kubernetes tools run in, locally (k.sh) and in CI (scripts/ci/lint-infra.sh):
# k3d, kubectl, Helm, the Argo CD CLI, kubeseal and kubeconform. Each binary is checked against the
# sha256 its release publishes; the versions move only by editing this file.
FROM debian:trixie-slim@sha256:8aa5a7bf5a1955bddbe7d74fcdd0b91ab30e74362a8b73af672b0481b35b44a0 AS download

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /download

# kubectl stays within one minor version of the cluster (lab/cluster.yaml).
ARG KUBECTL_VERSION=1.37.2
ARG KUBECTL_SHA256=c04487523e7aa7d1493f7808174c899db93d7a9cf57531420cd76b9bd415f8f4
RUN curl -fsSLo kubectl "https://dl.k8s.io/release/v${KUBECTL_VERSION}/bin/linux/amd64/kubectl" \
  && echo "${KUBECTL_SHA256}  kubectl" | sha256sum -c -

ARG K3D_VERSION=5.9.0
ARG K3D_SHA256=06d8f25bc3a971c4eb29e0ff08429b180402db0f4dec838c9eac427e296800a0
RUN curl -fsSLo k3d "https://github.com/k3d-io/k3d/releases/download/v${K3D_VERSION}/k3d-linux-amd64" \
  && echo "${K3D_SHA256}  k3d" | sha256sum -c -

ARG HELM_VERSION=4.3.2
ARG HELM_SHA256=d1c0278d46beab79582d7e50f5b3dc206944ba8e577cde618513fd07daa53983
RUN curl -fsSLo helm.tar.gz "https://get.helm.sh/helm-v${HELM_VERSION}-linux-amd64.tar.gz" \
  && echo "${HELM_SHA256}  helm.tar.gz" | sha256sum -c - \
  && tar -xzf helm.tar.gz --strip-components=1 linux-amd64/helm

ARG ARGOCD_VERSION=3.6.3
ARG ARGOCD_SHA256=3750cd7ed2a2ef05c640344b86f29aa99c9783e847c8f326c81e3900ad39412b
RUN curl -fsSLo argocd "https://github.com/argoproj/argo-cd/releases/download/v${ARGOCD_VERSION}/argocd-linux-amd64" \
  && echo "${ARGOCD_SHA256}  argocd" | sha256sum -c -

ARG KUBECONFORM_VERSION=0.8.0
ARG KUBECONFORM_SHA256=9bc2bffbf71f261128533edaf912153948b7ff238f9a531ae6d34466ec287883
RUN curl -fsSLo kubeconform.tar.gz \
    "https://github.com/yannh/kubeconform/releases/download/v${KUBECONFORM_VERSION}/kubeconform-linux-amd64.tar.gz" \
  && echo "${KUBECONFORM_SHA256}  kubeconform.tar.gz" | sha256sum -c - \
  && tar -xzf kubeconform.tar.gz kubeconform

# kubeseal matches the Sealed Secrets controller (apps/values.yaml, sealedSecrets).
ARG KUBESEAL_VERSION=0.41.2
ARG KUBESEAL_SHA256=666b5db6788ad1dedb56e2d97064e1cc3779aa77bbd6f4b56b62beeb1941ed79
RUN curl -fsSLo kubeseal.tar.gz \
    "https://github.com/bitnami-labs/sealed-secrets/releases/download/v${KUBESEAL_VERSION}/kubeseal-${KUBESEAL_VERSION}-linux-amd64.tar.gz" \
  && echo "${KUBESEAL_SHA256}  kubeseal.tar.gz" | sha256sum -c - \
  && tar -xzf kubeseal.tar.gz kubeseal

RUN chmod 755 kubectl k3d helm argocd kubeseal kubeconform

FROM debian:trixie-slim@sha256:8aa5a7bf5a1955bddbe7d74fcdd0b91ab30e74362a8b73af672b0481b35b44a0

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY --from=download /download/kubectl /download/k3d /download/helm /download/argocd \
  /download/kubeseal /download/kubeconform /usr/local/bin/
