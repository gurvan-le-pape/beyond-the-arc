# Database backups, written nightly by infra/ansible/roles/postgres_backup: one object
# per night under daily/, Monday's also under weekly/. The k3s cluster's CloudNativePG
# writes its own under cnpg/<cluster>/ (infra/k8s/database/), base backups and WAL,
# and deletes them itself after its retention. The server's token has Object
# Read & Write on this bucket and nothing else, so it cannot change the two rule sets
# below: a compromised server cannot delete a backup before its lock runs out.
#
# Lock and lifecycle have no import: Terraform creates them, and each replaces the
# bucket's whole rule set of its kind.
locals {
  day_seconds = 86400
  # Retention per prefix: 7 dailies, 4 weeklies.
  db_backup_retention_days = {
    daily  = 7
    weekly = 28
  }
  # CloudNativePG's base backups: a week of them cannot be deleted from the cluster. Its
  # WAL (wals/) is not locked: the Barman Cloud Plugin checks only its local spool for a
  # file it already archived, so after an upload whose reply was lost it writes the same
  # key again, and a lock would refuse that write and stall archiving until the disk
  # under PostgreSQL fills. Retention is the plugin's (14 days), so no lifecycle rule.
  cnpg_base_backup_lock = {
    prefix = "cnpg/production/database/base/"
    days   = 7
  }
}

resource "cloudflare_r2_bucket" "db_backups" {
  account_id    = local.account_id
  name          = "bta-db-backups"
  jurisdiction  = "eu"
  storage_class = "Standard"

  lifecycle {
    prevent_destroy = true
  }
}

# No delete and no overwrite before the end of the retention period, by anyone holding
# an object token. Lifecycle deletion waits for the lock too.
resource "cloudflare_r2_bucket_lock" "db_backups" {
  account_id   = local.account_id
  bucket_name  = cloudflare_r2_bucket.db_backups.name
  jurisdiction = cloudflare_r2_bucket.db_backups.jurisdiction
  # Sorted by id, the order the API returns them in, or every plan shows a reordering.
  rules = concat(
    [{
      id      = "lock-cnpg-production-base-${local.cnpg_base_backup_lock.days}d"
      enabled = true
      prefix  = local.cnpg_base_backup_lock.prefix
      condition = {
        type            = "Age"
        max_age_seconds = local.cnpg_base_backup_lock.days * local.day_seconds
      }
    }],
    [for prefix, days in local.db_backup_retention_days : {
      id      = "lock-${prefix}-${days}d"
      enabled = true
      prefix  = "${prefix}/"
      condition = {
        type            = "Age"
        max_age_seconds = days * local.day_seconds
      }
    }],
  )
}

# Deleted one day after the lock lets go, so a backup is never kept less than its
# retention period. Unfinished multipart uploads (an interrupted rclone) go after a day.
resource "cloudflare_r2_bucket_lifecycle" "db_backups" {
  account_id   = local.account_id
  bucket_name  = cloudflare_r2_bucket.db_backups.name
  jurisdiction = cloudflare_r2_bucket.db_backups.jurisdiction
  # In the order the API returns them, or every plan shows a reordering.
  rules = concat(
    [{
      id         = "abort-multipart-1d"
      enabled    = true
      conditions = { prefix = "" }
      abort_multipart_uploads_transition = {
        condition = { type = "Age", max_age = local.day_seconds }
      }
    }],
    [for prefix, days in local.db_backup_retention_days : {
      id         = "expire-${prefix}-${days + 1}d"
      enabled    = true
      conditions = { prefix = "${prefix}/" }
      delete_objects_transition = {
        condition = { type = "Age", max_age = (days + 1) * local.day_seconds }
      }
    }],
  )
}
