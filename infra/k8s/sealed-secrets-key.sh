#!/usr/bin/env bash
# Backs up the Sealed Secrets controller's keys: infra/k8s/sealed-secrets-key.sh
#   BTA_CLUSTER=production infra/k8s/sealed-secrets-key.sh
#
# Every SealedSecret in Git is encrypted to these keys, and they exist only in the cluster:
# a cluster rebuilt without them means sealing every secret again. This exports the key
# Secrets of the cluster BTA_CLUSTER selects (k.sh) as plain manifests, encrypts them with
# age to the same public key as the database backups (the maintainer's, whose private
# half never leaves this machine), and keeps the result twice:
#   ~/.config/bta-k8s/sealed-secrets-key-<cluster>-<UTC time>.yaml.age
#   r2:bta-db-backups/sealed-secrets/<cluster>/ under the same name
# then decrypts the R2 copy and checks it against the export. No clear copy touches a disk.
#
# The upload uses the R2 token the database backups write with (Object Read & Write on
# bta-db-backups only), decrypted from ../ansible/inventory/group_vars/compose/backup.sops.yml
# for this run. No lifecycle rule covers sealed-secrets/, so the copies are kept.
#
# Run it after the controller first starts, and after every rotation (the controller
# renews nothing on its own: keyrenewperiod "0", apps/templates/sealed-secrets.yaml).
# Restoring, on a new cluster before the controller has made a key of its own or after
# deleting it, then restarting the controller so that it loads them:
#   ../ansible/ansible.sh sh -c 'age -d -i "$SOPS_AGE_KEY_FILE"' < <file> |
#     BTA_CLUSTER=production infra/k8s/k.sh kubectl apply -f -
#   BTA_CLUSTER=production infra/k8s/k.sh kubectl -n kube-system rollout restart deployment sealed-secrets-controller
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
cluster="${BTA_CLUSTER:-lab}"
state="${XDG_CONFIG_HOME:-$HOME/.config}/bta-k8s"
bucket=bta-db-backups
name="sealed-secrets-key-$cluster-$(date -u +%Y-%m-%dT%H%M%SZ).yaml.age"
remote="r2:$bucket/sealed-secrets/$cluster/$name"
sops_file=inventory/group_vars/compose/backup.sops.yml

kube() { "$here/k.sh" "$@"; }
ansible_image() { "$here/../ansible/ansible.sh" "$@"; }

recipient=$(sed -n 's/^postgres_backup_age_recipient: *//p' \
  "$here/../ansible/roles/postgres_backup/defaults/main.yml")
[[ $recipient == age1* ]] || { echo "sealed-secrets-key.sh: no age recipient found" >&2; exit 1; }

# The key Secrets with only what recreating them needs: no uid, resourceVersion or
# managedFields, which an apply on a new cluster would refuse.
template='{{range .items}}---
apiVersion: v1
kind: Secret
type: {{.type}}
metadata:
  name: {{.metadata.name}}
  namespace: {{.metadata.namespace}}
  labels:
    sealedsecrets.bitnami.com/sealed-secrets-key: {{index .metadata.labels "sealedsecrets.bitnami.com/sealed-secrets-key"}}
data:
  tls.crt: {{index .data "tls.crt"}}
  tls.key: {{index .data "tls.key"}}
{{end}}'
export_keys() {
  kube kubectl -n kube-system get secrets -l sealedsecrets.bitnami.com/sealed-secrets-key \
    -o go-template="$template" < /dev/null
}

count=$(export_keys | grep -c '^kind: Secret$' || true)
[ "$count" -gt 0 ] || { echo "sealed-secrets-key.sh: no key Secret in $cluster" >&2; exit 1; }
expected=$(export_keys | sha256sum | cut -c1-64)

umask 077
export_keys | ansible_image age -r "$recipient" > "$state/$name.new"
mv "$state/$name.new" "$state/$name"
echo "== $count key(s) of $cluster in $state/$name"

r2() { ansible_image sops -d --extract "[\"$1\"]" "$sops_file" < /dev/null; }
RCLONE_CONFIG_R2_ACCESS_KEY_ID=$(r2 postgres_backup_r2_access_key_id)
RCLONE_CONFIG_R2_SECRET_ACCESS_KEY=$(r2 postgres_backup_r2_secret_access_key)
RCLONE_CONFIG_R2_ENDPOINT=$(r2 postgres_backup_r2_endpoint)
# As the backup job sets them (../ansible/roles/postgres_backup/templates/backup.env.j2):
# rclone 1.60 re-reads an upload with HEAD ?versionId=, which R2 answers 501 although the
# upload succeeded; the decryption check below is what proves the copy.
export RCLONE_CONFIG_R2_TYPE=s3 RCLONE_CONFIG_R2_PROVIDER=Cloudflare RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true \
  RCLONE_CONFIG_R2_NO_HEAD=true \
  RCLONE_CONFIG_R2_ACCESS_KEY_ID RCLONE_CONFIG_R2_SECRET_ACCESS_KEY RCLONE_CONFIG_R2_ENDPOINT

ansible_image rclone rcat "$remote" < "$state/$name"
echo "== uploaded to $remote"

actual=$(ansible_image sh -c "rclone cat '$remote' | age -d -i \"\$SOPS_AGE_KEY_FILE\"" < /dev/null |
  sha256sum | cut -c1-64)
[ "$actual" = "$expected" ] || { echo "sealed-secrets-key.sh: the R2 copy does not decrypt to the export" >&2; exit 1; }
echo "== checked: the R2 copy decrypts to the $count exported key(s)"
