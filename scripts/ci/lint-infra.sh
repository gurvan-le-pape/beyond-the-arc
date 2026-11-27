#!/usr/bin/env bash
# Lints the workflows (actionlint, zizmor), the shell scripts (shellcheck), the
# Terraform stacks (fmt, validate) and the Ansible code (ansible-lint, syntax check).
# Every linter runs even if an earlier one failed. Run from the repo root.
#
# The files are copied into each container instead of mounted: a CI runner is itself
# a container, so its paths mean nothing to the Docker daemon, and its volumes hold
# the Docker socket and the runner's credentials. No linter gets a network.
set -euo pipefail

actionlint=rhysd/actionlint:1.7.12@sha256:b1934ee5f1c509618f2508e6eb47ee0d3520686341fec936f3b79331f9315667
shellcheck=koalaman/shellcheck:v0.11.0@sha256:61862eba1fcf09a484ebcc6feea46f1782532571a34ed51fedf90dd25f925a8d
zizmor=ghcr.io/zizmorcore/zizmor:1.33.1@sha256:ecd3ffe6158de1322e05a044ed43749bee12b1dccb7e1a7859bc6ac4b2a1c516

mapfile -t workflows < <(git ls-files '.github/workflows/*.yml')
mapfile -t scripts < <(git ls-files '*.sh')
failed=0
container=""
trap '[ -z "$container" ] || docker rm -fv "$container" > /dev/null' EXIT

lint() {
  local name="$1" image="$2"
  shift 2
  echo "== $name"
  container=$(docker create --network none -w /repo "$image" "$@")
  git ls-files -z -- .github "${scripts[@]}" |
    tar --null -T - --transform 's,^,repo/,' -cf - |
    docker cp -q - "$container:/"
  docker start -a "$container" || failed=1
  docker rm -fv "$container" > /dev/null
  container=""
}

lint actionlint "$actionlint" -color=false -config-file .github/actionlint.yaml "${workflows[@]}"
lint shellcheck "$shellcheck" "${scripts[@]}"
# Offline: no token, and no failure when GitHub is down. Low findings are style hints,
# left out.
lint zizmor "$zizmor" --offline --no-progress --min-severity medium .github

# Terraform runs in the image tf.sh uses locally. Unlike the linters above it gets a
# network: init downloads the providers, checked against the committed lock files.
# -backend=false: no state, no credentials.
echo "== terraform"
container=$(docker create --entrypoint sh -w /repo "$(< infra/terraform/.terraform-image)" -c '
  terraform fmt -check -recursive -diff -no-color infra/terraform || exit 1
  for stack in infra/terraform/*/; do
    echo "-- $stack"
    terraform -chdir="$stack" init -backend=false -lockfile=readonly -input=false -no-color > /dev/null &&
      terraform -chdir="$stack" validate -no-color || exit 1
  done')
git ls-files -z -- infra/terraform | tar --null -T - --transform 's,^,repo/,' -cf - |
  docker cp -q - "$container:/"
docker start -a "$container" || failed=1
docker rm -fv "$container" > /dev/null
container=""

# Ansible runs in the image ansible.sh builds locally. Building it needs a network (pip,
# checked against the hashes in requirements.txt); the lint itself has none.
echo "== ansible"
ansible_image="bta-ansible-lint:$(cat infra/ansible/Dockerfile infra/ansible/requirements.txt infra/ansible/requirements.yml |
  sha256sum | cut -c1-12)"
if docker build -q --build-arg UID=0 -t "$ansible_image" infra/ansible > /dev/null; then
  container=$(docker create --network none -e ANSIBLE_CONFIG=/repo/infra/ansible/ansible.cfg \
    -w /repo/infra/ansible "$ansible_image" sh -c '
    ansible-lint --nocolor || exit 1
    for playbook in playbooks/*.yml; do
      ansible-playbook --syntax-check "$playbook" || exit 1
    done')
  git ls-files -z -- infra/ansible | tar --null -T - --transform 's,^,repo/,' -cf - |
    docker cp -q - "$container:/"
  docker start -a "$container" || failed=1
  docker rm -fv "$container" > /dev/null
  container=""
else
  failed=1
fi

exit "$failed"
