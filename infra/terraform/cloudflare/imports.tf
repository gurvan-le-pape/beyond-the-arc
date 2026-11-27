# Everything in this stack exists already: Terraform adopts it, never creates it.
import {
  to = cloudflare_zone.this
  id = "a5f69dbbf3927ab4b24cde3ad4a8e005"
}

import {
  for_each = local.proxied_hosts
  to       = cloudflare_dns_record.proxied[each.key]
  id       = "a5f69dbbf3927ab4b24cde3ad4a8e005/${each.value.id}"
}

import {
  to = cloudflare_dns_record.google_site_verification
  id = "a5f69dbbf3927ab4b24cde3ad4a8e005/b366389388585de0ea4c4409aebf1977"
}

import {
  to = cloudflare_zero_trust_access_policy.grafana_users
  id = "e093b1328feb8fef8d914c5e5351bc41/4e310fd1-629a-483d-9f1e-f3a04eb0135d"
}

import {
  to = cloudflare_zero_trust_access_policy.acme
  id = "e093b1328feb8fef8d914c5e5351bc41/2e02c62c-d887-4d81-a1f8-0f0084fe0f46"
}

import {
  to = cloudflare_zero_trust_access_application.grafana
  id = "accounts/e093b1328feb8fef8d914c5e5351bc41/b9c2884a-83e6-44ba-9a4e-11dfd482e6a8"
}

import {
  to = cloudflare_zero_trust_access_application.grafana_acme
  id = "accounts/e093b1328feb8fef8d914c5e5351bc41/60d86cb6-a6ba-4cb4-ad78-b93ab5c994ed"
}

# Created in the dashboard (EU jurisdiction) for the database backups.
import {
  to = cloudflare_r2_bucket.db_backups
  id = "e093b1328feb8fef8d914c5e5351bc41/bta-db-backups/eu"
}
