locals {
  account_id = "e093b1328feb8fef8d914c5e5351bc41"
  zone_id    = "a5f69dbbf3927ab4b24cde3ad4a8e005"

  # Every proxied A record points at the production server.
  proxied_hosts = {
    apex    = { id = "7b2ec6802b65f28146622295850226ce", name = "beyondthearc.app" }
    www     = { id = "60c44c5cf35343620814f07a3903637d", name = "www.beyondthearc.app" }
    grafana = { id = "33d63c9a28db2442629e8669830c6806", name = "grafana.beyondthearc.app" }
  }
}

resource "cloudflare_zone" "this" {
  account = { id = local.account_id }
  name    = "beyondthearc.app"
  type    = "full"

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_dns_record" "proxied" {
  for_each = local.proxied_hosts

  zone_id = cloudflare_zone.this.id
  name    = each.value.name
  type    = "A"
  content = var.origin_ipv4
  proxied = true
  ttl     = 1

  # Deleting one takes its host offline: the site (apex, www) or Grafana.
  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_dns_record" "google_site_verification" {
  zone_id = cloudflare_zone.this.id
  name    = "beyondthearc.app"
  type    = "TXT"
  content = "\"google-site-verification=khye19bYRyK8dFm_n1jz4JIh232nMaX3FUJ1JAIYwWI\""
  proxied = false
  ttl     = 3600
}

# Grafana is reachable only through Access, for the allowed e-mail addresses...
resource "cloudflare_zero_trust_access_policy" "grafana_users" {
  account_id = local.account_id
  name       = "Me"
  decision   = "allow"
  # Set by the API on every policy; declared so an import reads as no change.
  connection_rules = { rdp = {} }
  include          = [for email in var.grafana_allowed_emails : { email = { email = email } }]
}

resource "cloudflare_zero_trust_access_application" "grafana" {
  account_id                 = local.account_id
  name                       = "Grafana"
  type                       = "self_hosted"
  domain                     = "grafana.beyondthearc.app"
  destinations               = [{ type = "public", uri = "grafana.beyondthearc.app" }]
  session_duration           = "24h"
  app_launcher_visible       = true
  auto_redirect_to_identity  = false
  enable_binding_cookie      = false
  http_only_cookie_attribute = false
  options_preflight_bypass   = false
  policies                   = [{ id = cloudflare_zero_trust_access_policy.grafana_users.id, precedence = 1 }]

  # Deleting it leaves Grafana open to anyone who finds its address.
  lifecycle {
    prevent_destroy = true
  }
}

# ...except the ACME challenge path, which Let's Encrypt must reach to renew the
# certificate.
resource "cloudflare_zero_trust_access_policy" "acme" {
  account_id       = local.account_id
  name             = "Let's Encrypt"
  decision         = "bypass"
  connection_rules = { rdp = {} }
  include          = [{ everyone = {} }]
}

resource "cloudflare_zero_trust_access_application" "grafana_acme" {
  account_id                 = local.account_id
  name                       = "Grafana ACME"
  type                       = "self_hosted"
  domain                     = "grafana.beyondthearc.app/.well-known/acme-challenge/"
  destinations               = [{ type = "public", uri = "grafana.beyondthearc.app/.well-known/acme-challenge/" }]
  session_duration           = "24h"
  app_launcher_visible       = true
  auto_redirect_to_identity  = false
  enable_binding_cookie      = false
  http_only_cookie_attribute = false
  options_preflight_bypass   = false
  policies                   = [{ id = cloudflare_zero_trust_access_policy.acme.id, precedence = 1 }]

  # Deleting it puts Let's Encrypt behind the login: Grafana's certificate stops renewing
  # and expires.
  lifecycle {
    prevent_destroy = true
  }
}
