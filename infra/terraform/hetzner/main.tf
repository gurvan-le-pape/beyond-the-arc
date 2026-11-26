locals {
  # Cloudflare's published ranges (cloudflare.com/ips): the site is proxied, so HTTP and
  # HTTPS reach the server from Cloudflare only.
  cloudflare_ranges = [
    "173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22",
    "141.101.64.0/18", "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20",
    "197.234.240.0/22", "198.41.128.0/17", "162.158.0.0/15", "104.16.0.0/13",
    "104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22",
    "2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32",
    "2405:8100::/32", "2a06:98c0::/29", "2c0f:f248::/32",
  ]
  anywhere = ["0.0.0.0/0", "::/0"]
}

resource "hcloud_firewall" "compose" {
  name = "firewall-1"

  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "22"
    source_ips = local.anywhere
  }

  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "80"
    source_ips = local.cloudflare_ranges
  }

  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "443"
    source_ips = local.cloudflare_ranges
  }
}

resource "hcloud_firewall" "k3s" {
  name = "firewall-k3s"

  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "22"
    source_ips = local.anywhere
  }
}

# The production server today, running the Compose stack.
resource "hcloud_server" "compose" {
  name               = "bta-prod-compose"
  server_type        = "cx23"
  location           = "nbg1"
  image              = "ubuntu-24.04"
  firewall_ids       = [hcloud_firewall.compose.id]
  delete_protection  = true
  rebuild_protection = true

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      # Set at creation only: changing any of them would rebuild the server.
      image, ssh_keys, user_data,
      # Provider-side settings, not Hetzner ones: an import leaves them unset.
      keep_disk, shutdown_before_deletion, ignore_remote_firewall_ids,
    ]
  }
}

# Holds the production PostgreSQL data.
resource "hcloud_volume" "database" {
  name              = "fw-prod-compose"
  size              = 90
  server_id         = hcloud_server.compose.id
  delete_protection = true

  lifecycle {
    prevent_destroy = true
  }
}

# The k3s production server, empty until Ansible provisions it.
resource "hcloud_server" "k3s" {
  name               = "bta-prod-k3s"
  server_type        = "cx33"
  location           = "nbg1"
  image              = "ubuntu-24.04"
  firewall_ids       = [hcloud_firewall.k3s.id]
  delete_protection  = true
  rebuild_protection = true

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      image, ssh_keys, user_data,
      keep_disk, shutdown_before_deletion, ignore_remote_firewall_ids,
    ]
  }
}
