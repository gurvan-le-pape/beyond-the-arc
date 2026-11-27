# The image Ansible and ansible-lint run in, locally (ansible.sh) and in CI
# (scripts/ci/lint-infra.sh). Python packages are pinned by hash in requirements.txt,
# regenerated from requirements.in (see README.md).
FROM python:3.14-slim@sha256:22eafb370920ad8b429e0aec3fff433e0669968519f5d60469d83729c138b28b

# age and rclone also serve the restore test (restore-test.sh), which downloads and
# decrypts a backup on the maintainer's machine; nano is the editor `sops edit` opens.
RUN apt-get update \
  && apt-get install -y --no-install-recommends age ca-certificates curl nano openssh-client rclone \
  && rm -rf /var/lib/apt/lists/*

# sops decrypts the *.sops.yml files under inventory/ (community.sops vars plugin), with
# the age key ansible.sh mounts. Checked against the release's published sha256.
ARG SOPS_VERSION=3.13.3
ARG SOPS_SHA256=e5bec3346a873ae91d871550f3e698c1aad962aff462a080e40f25fde17fef6b
RUN curl -fsSLo /usr/local/bin/sops \
    "https://github.com/getsops/sops/releases/download/v${SOPS_VERSION}/sops-v${SOPS_VERSION}.linux.amd64" \
  && echo "${SOPS_SHA256}  /usr/local/bin/sops" | sha256sum -c - \
  && chmod 755 /usr/local/bin/sops

COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir --no-deps --require-hashes -r /tmp/requirements.txt \
  && rm /tmp/requirements.txt

COPY requirements.yml /tmp/requirements.yml
RUN ansible-galaxy collection install --no-cache -r /tmp/requirements.yml \
    -p /usr/share/ansible/collections \
  && rm /tmp/requirements.yml

# ssh refuses to run for a uid with no passwd entry, so the caller's uid gets one.
ARG UID=1000
ARG GID=1000
RUN if [ "$UID" != 0 ]; then \
    groupadd -g "$GID" ansible && useradd -m -u "$UID" -g "$GID" -d /home/ansible ansible; \
  fi

# The editor `sops edit` opens.
ENV EDITOR=nano
