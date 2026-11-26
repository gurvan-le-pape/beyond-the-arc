# Everything in this stack exists already: Terraform adopts it, never creates it.
import {
  to = hcloud_firewall.compose
  id = "10809843"
}

import {
  to = hcloud_firewall.k3s
  id = "12166174"
}

import {
  to = hcloud_server.compose
  id = "126081500"
}

import {
  to = hcloud_volume.database
  id = "105727762"
}

import {
  to = hcloud_server.k3s
  id = "177696102"
}
