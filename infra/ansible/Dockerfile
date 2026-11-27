# The image Ansible and ansible-lint run in, locally (ansible.sh) and in CI
# (scripts/ci/lint-infra.sh). Python packages are pinned by hash in requirements.txt,
# regenerated from requirements.in (see README.md).
FROM python:3.14-slim@sha256:22eafb370920ad8b429e0aec3fff433e0669968519f5d60469d83729c138b28b

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssh-client \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir --no-deps --require-hashes -r /tmp/requirements.txt \
  && rm /tmp/requirements.txt

# ssh refuses to run for a uid with no passwd entry, so the caller's uid gets one.
ARG UID=1000
ARG GID=1000
RUN if [ "$UID" != 0 ]; then \
    groupadd -g "$GID" ansible && useradd -m -u "$UID" -g "$GID" -d /home/ansible ansible; \
  fi
