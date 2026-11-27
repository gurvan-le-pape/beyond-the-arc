# Kept out of the repository and out of plan output (the logs of a public repository's
# CI are public too): tf.sh reads them from ~/.config/bta-terraform/cloudflare.vars.env
# as TF_VAR_*. The state holds them in clear.

variable "origin_ipv4" {
  description = "Public IPv4 of the production server, behind the proxied A records."
  type        = string
  sensitive   = true
}

variable "rehearsal_origin_ipv4" {
  description = "Public IPv4 of the k3s server (bta-prod-k3s), behind the rehearsal record."
  type        = string
  sensitive   = true
}

variable "grafana_allowed_emails" {
  description = "E-mail addresses allowed through Cloudflare Access to Grafana."
  type        = list(string)
  sensitive   = true
}
