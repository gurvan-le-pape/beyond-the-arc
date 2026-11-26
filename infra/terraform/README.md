# Terraform

One root per provider, one state each, so a plan in one cannot touch another and each
needs only its own token:

| Stack | Manages | State key |
|---|---|---|
| `github/` | repository, `main` ruleset, repository variables, `Production` and `build` environments and their variables | `github/terraform.tfstate` |

Terraform only imports what exists. Nothing here creates a server, a volume or a
repository, and every imported resource that holds data carries `prevent_destroy`.
Secrets stay out of Terraform: a managed secret's value would land in the state.

## Running it

Terraform runs only on the maintainer's machine, through `tf.sh`, in the same pinned
image CI uses (`.terraform-image`). CI runs `fmt` and `validate` with no backend and no
credentials (`scripts/ci/lint-infra.sh`): the runners are persistent and hold the Docker
socket, so they hold no infrastructure token.

```bash
infra/terraform/tf.sh github init
infra/terraform/tf.sh github plan
```

Credentials live in `~/.config/bta-terraform/` (mode 600, outside the repository):

- `r2.env`: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `R2_ACCOUNT_ID` (or
  `AWS_ENDPOINT_URL_S3`), from an R2 token with Object Read & Write on the
  `bta-terraform-state` bucket only.
- `<stack>.env`: the provider token, read-only (`github.env`: `GITHUB_TOKEN`, a
  fine-grained token on this repository with read access to Administration,
  Environments, Variables and Metadata). Importing and planning only read; a write token
  is created for an apply that changes something, and only then. When a plan fails for
  lack of permission, add the read permission it names, nothing else.

A plan prints server addresses. Mask them before pasting a plan anywhere.

## State and locking

The state is on Cloudflare R2 through the S3 backend, locked by `use_lockfile`: Terraform
creates `<key>.tflock` next to the state with a conditional write, so a second operation
fails instead of waiting. R2 keeps no object versions: run
`tf.sh <stack> state pull > ~/backups/<stack>-$(date +%F).tfstate` before any apply.

### A lock left behind

A Terraform process killed mid-operation (`kill -9`, a closed terminal, a crash) leaves
its `.tflock`, and every later operation fails with `Error acquiring the state lock`,
printing the lock's `ID`, who took it and when. Make sure that process is really gone,
then:

```bash
infra/terraform/tf.sh <stack> force-unlock <ID>
```

Never force-unlock a lock whose holder may still be running: that is the case the lock
exists for.

### Proving the lock

To check the lock still works on R2 (after a Terraform upgrade, say), in a throwaway
stack with its own state key:

```bash
mkdir infra/terraform/lock-proof
cat > infra/terraform/lock-proof/main.tf <<'TF'
terraform {
  backend "s3" {
    bucket                      = "bta-terraform-state"
    key                         = "lock-proof/terraform.tfstate"
    region                      = "auto"
    use_lockfile                = true
    use_path_style              = true
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
  }
}
resource "terraform_data" "proof" {}
TF
infra/terraform/tf.sh lock-proof init -input=false
# 1. An apply holds the lock while it waits for approval (never answer it).
sleep 300 | TF_CONTAINER_NAME=tf-lock-holder infra/terraform/tf.sh lock-proof apply &
# 2. A second operation is refused: "Error acquiring the state lock".
infra/terraform/tf.sh lock-proof plan -lock-timeout=0
# 3. Kill the holder hard: the .tflock stays, the next operation is still refused.
docker kill tf-lock-holder
infra/terraform/tf.sh lock-proof plan -lock-timeout=0
# 4. Remove it with the ID printed above; the plan then runs.
infra/terraform/tf.sh lock-proof force-unlock -force <ID>
infra/terraform/tf.sh lock-proof plan -lock-timeout=0
rm -r infra/terraform/lock-proof
```

`terraform_data` is Terraform's built-in resource and creates nothing outside the state;
since the apply is never approved, no state is written either.
