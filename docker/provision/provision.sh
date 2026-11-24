#!/usr/bin/env bash
# docker/provision/provision.sh
#
# Brings an Ubuntu 24.04 host to the state the production VPS is in: every
# setting under "Host setup" in docs/infrastructure.md. Run as root:
#
#   VOLUME_ID=<hetzner-volume-id> DEPLOY_PUBKEY='<ssh public key>' bash provision.sh [--check]
#
# Idempotent: each step looks at the host first and changes only what differs,
# so a second run reports no changes, and running it on the live server is safe.
# It never overwrites something it did not write — an fstab entry for the volume
# pointing elsewhere, a file where the Nginx symlink belongs, a clone that is not
# sparse — it reports a WARNING and leaves it. It never formats a disk.
#
#   --check   report what would change, change nothing; exits 1 if anything would.
#
# Settings (environment):
#   VOLUME_ID      Hetzner volume id; the data volume is skipped when unset.
#   VOLUME_DEVICE  device to mount instead of /dev/disk/by-id/scsi-0HC_Volume_<id>.
#   DEPLOY_PUBKEY  public key the CI deploys with, added to deploy's authorized_keys.
#   SWAPFILE       swap file path, /swapfile by default.
#
# Not covered, because it cannot be done from the host or needs a decision: the
# Hetzner firewall, Cloudflare, the TLS certificate's first issuance, the .env
# file, the GitHub Actions secrets. docs/infrastructure.md, "Rebuilding the server
# from zero", lists them in order.

set -euo pipefail

check=0
case "${1:-}" in
  --check) check=1 ;;
  "") ;;
  *)
    echo "usage: $0 [--check]" >&2
    exit 2
    ;;
esac

# Fixed paths: the CI deploy, docker/deploy.sh and the Nginx config all name them.
app_dir=/opt/beyondthearc
repo_url=https://github.com/gurvan-le-pape/beyond-the-arc.git
volume_mount=/var/lib/docker/volumes
cert=/etc/letsencrypt/live/beyondthearc.app/fullchain.pem

volume_id=${VOLUME_ID:-}
volume_device=${VOLUME_DEVICE:-${volume_id:+/dev/disk/by-id/scsi-0HC_Volume_$volume_id}}
deploy_pubkey=${DEPLOY_PUBKEY:-}
swapfile=${SWAPFILE:-/swapfile}

changes=0
warnings=0

section() { printf '\n== %s\n' "$*"; }
ok() { printf '  ok      %s\n' "$*"; }
warn() {
  printf '  WARNING %s\n' "$*"
  warnings=$((warnings + 1))
}

# change DESCRIPTION COMMAND... — one counted change; only printed under --check.
change() {
  local description=$1
  shift
  changes=$((changes + 1))
  if [ "$check" = 1 ]; then
    printf '  would   %s\n' "$description"
    return 0
  fi
  printf '  change  %s\n' "$description"
  "$@"
}

# then COMMAND... — the follow-up of a change (a reload, a restart); not counted.
then_run() { if [ "$check" = 0 ]; then "$@"; fi; }

# has_content PATH MODE CONTENT — the file exists with exactly these bytes and mode.
has_content() {
  [ -f "$1" ] && [ "$(stat -c %a "$1")" = "$2" ] && [ "$(
    cat "$1"
    printf x
  )" = "${3}x" ]
}

# write_file PATH MODE CONTENT [VALIDATOR] — atomic write, validated before it lands.
write_file() {
  local path=$1 mode=$2 content=$3 validator=${4:-} tmp
  mkdir -p "$(dirname "$path")"
  tmp=$(mktemp "$path.XXXXXX")
  printf '%s' "$content" > "$tmp"
  chmod "$mode" "$tmp"
  if [ -n "$validator" ] && ! "$validator" "$tmp"; then
    rm -f "$tmp"
    echo "refusing to install $path: validation failed" >&2
    return 1
  fi
  mv "$tmp" "$path"
}

# ensure_file PATH MODE CONTENT [VALIDATOR] — succeeds when it changed the file.
ensure_file() {
  if has_content "$1" "$2" "$3"; then
    ok "$1"
    return 1
  fi
  change "write $1" write_file "$@"
}

# Matching is done on captured output, never on `cmd | grep -q`: under pipefail,
# grep -q exiting at the first match kills the writer with SIGPIPE, and the
# pipeline then fails even though it matched.
installed() { [ "$(dpkg-query -W -f='${db:Status-Status}' "$1" 2> /dev/null || true)" = installed ]; }

if [ "$(id -u)" != 0 ]; then
  echo "run as root" >&2
  exit 2
fi

# ---------------------------------------------------------------------------
# The data volume comes first: Docker must never start before it is mounted, or
# Postgres initialises an empty database on the root disk.
section "Data volume on $volume_mount"
if [ -z "$volume_device" ]; then
  warn "VOLUME_ID not set — data volume skipped (docs/infrastructure.md, Host setup)"
else
  fstab_source=$(awk -v m="$volume_mount" '$1 !~ /^#/ && $2 == m { print $1 }' /etc/fstab)
  if [ -n "$fstab_source" ] && [ "$fstab_source" != "$volume_device" ]; then
    warn "/etc/fstab mounts $volume_mount from $fstab_source, not $volume_device — left as is"
  elif [ -n "$fstab_source" ]; then
    ok "/etc/fstab entry for $volume_mount"
  elif [ ! -e "$volume_device" ]; then
    warn "$volume_device does not exist — is the volume attached?"
  elif [ "$(blkid -o value -s TYPE "$volume_device" || true)" != ext4 ]; then
    warn "$volume_device holds no ext4 filesystem. If the volume is new and empty: mkfs.ext4 $volume_device, then re-run"
  else
    change "add $volume_device to /etc/fstab" \
      sh -c "printf '%s\n' '$volume_device $volume_mount ext4 defaults,nofail 0 2' >> /etc/fstab"
    fstab_source=$volume_device
  fi

  if [ "$fstab_source" = "$volume_device" ]; then
    if findmnt -rn "$volume_mount" > /dev/null; then
      ok "$volume_mount mounted"
    else
      change "mount $volume_mount" sh -c "mkdir -p '$volume_mount' && systemctl daemon-reload && mount '$volume_mount'"
    fi
    # Docker refuses to start without the volume, instead of starting on the
    # empty directory underneath it.
    if ensure_file /etc/systemd/system/docker.service.d/require-volumes.conf 644 \
      $'[Unit]\nRequiresMountsFor=/var/lib/docker/volumes\n'; then
      then_run systemctl daemon-reload
    fi
  fi
fi

# ---------------------------------------------------------------------------
section "Swap and swappiness"
if [ -e "$swapfile" ]; then
  ok "$swapfile exists"
else
  change "create a 2 GB $swapfile" sh -c "fallocate -l 2G '$swapfile' && chmod 600 '$swapfile' && mkswap '$swapfile' > /dev/null"
fi
if awk -v f="$swapfile" '$1 == f && $3 == "swap" { found = 1 } END { exit !found }' /etc/fstab; then
  ok "$swapfile in /etc/fstab"
else
  change "add $swapfile to /etc/fstab" sh -c "printf '%s\n' '$swapfile none swap sw 0 0' >> /etc/fstab"
fi
if grep -qxF -- "$swapfile" <<< "$(swapon --show=NAME --noheadings)"; then
  ok "$swapfile active"
else
  change "swapon $swapfile" swapon "$swapfile"
fi
if ensure_file /etc/sysctl.d/99-swappiness.conf 644 $'vm.swappiness=10\n'; then
  then_run sysctl -q -p /etc/sysctl.d/99-swappiness.conf
fi

# ---------------------------------------------------------------------------
section "journald size"
if ensure_file /etc/systemd/journald.conf.d/size.conf 644 $'[Journal]\nSystemMaxUse=500M\n'; then
  then_run systemctl restart systemd-journald
fi

# ---------------------------------------------------------------------------
section "Packages"
if grep -rqs 'download.docker.com' /etc/apt/sources.list /etc/apt/sources.list.d/; then
  ok "Docker apt repository"
else
  # shellcheck source=/dev/null
  codename=$(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
  change "add Docker's apt repository" sh -c "
    install -m 0755 -d /etc/apt/keyrings &&
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc &&
    chmod a+r /etc/apt/keyrings/docker.asc &&
    printf 'Types: deb\nURIs: https://download.docker.com/linux/ubuntu\nSuites: %s\nComponents: stable\nSigned-By: /etc/apt/keyrings/docker.asc\n' '$codename' \
      > /etc/apt/sources.list.d/docker.sources"
fi

wanted=(ca-certificates curl git nginx certbot python3-certbot-nginx unattended-upgrades
  docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin)
missing=()
for p in "${wanted[@]}"; do installed "$p" || missing+=("$p"); done
if [ ${#missing[@]} = 0 ]; then
  ok "installed: ${wanted[*]}"
else
  # Only what is missing, so a re-run never upgrades what is already there;
  # upgrades are unattended-upgrades' job.
  change "install ${missing[*]}" sh -c "apt-get update -q > /dev/null &&
    DEBIAN_FRONTEND=noninteractive apt-get install -y -q ${missing[*]} > /dev/null"
fi

# Nothing here uses them; snapd ran permanently with no snap installed.
unwanted=(snapd open-vm-tools lxd-agent-loader lxd-installer docker-model-plugin)
present=()
for p in "${unwanted[@]}"; do installed "$p" && present+=("$p"); done
if [ ${#present[@]} = 0 ]; then
  ok "absent: ${unwanted[*]}"
else
  change "purge ${present[*]}" sh -c "DEBIAN_FRONTEND=noninteractive apt-get purge -y -q ${present[*]} > /dev/null &&
    DEBIAN_FRONTEND=noninteractive apt-get autoremove -y -q > /dev/null &&
    rm -rf /snap /var/snap /var/lib/snapd /var/cache/snapd"
fi
# Keeps a recommends chain from bringing snapd back.
ensure_file /etc/apt/preferences.d/no-snapd 644 $'Package: snapd\nPin: release *\nPin-Priority: -1\n' || true

# ---------------------------------------------------------------------------
section "Services"
for unit in docker nginx; do
  if systemctl is-enabled --quiet "$unit" 2> /dev/null && systemctl is-active --quiet "$unit"; then
    ok "$unit enabled and running"
  else
    change "enable and start $unit" systemctl enable --now --quiet "$unit"
  fi
done

# ---------------------------------------------------------------------------
section "Unattended security upgrades"
periodic() {
  local v=
  eval "$(apt-config shell v "APT::Periodic::$1")"
  [ "$v" = 1 ]
}
if periodic Update-Package-Lists && periodic Unattended-Upgrade; then
  ok "APT::Periodic::Update-Package-Lists and ::Unattended-Upgrade are 1"
else
  change "enable unattended-upgrades" write_file /etc/apt/apt.conf.d/20auto-upgrades 644 \
    $'APT::Periodic::Update-Package-Lists "1";\nAPT::Periodic::Unattended-Upgrade "1";\n'
fi

# ---------------------------------------------------------------------------
section "SSH: keys only"
# Judged on the effective config (sshd -T), not on file contents: drop-ins are
# first-value-wins, so a file can exist and still be overridden.
if ! command -v sshd > /dev/null; then
  warn "sshd not installed — skipped"
elif effective=$(sshd -T 2> /dev/null) \
  && grep -qx 'passwordauthentication no' <<< "$effective" \
  && grep -qx 'kbdinteractiveauthentication no' <<< "$effective"; then
  ok "password and keyboard-interactive logins off"
else
  # Validated with the rest of the config before the reload, and removed if
  # sshd rejects it, so a broken file never waits for the next restart.
  disable_password_auth() {
    local f=/etc/ssh/sshd_config.d/10-disable-password-auth.conf
    write_file "$f" 644 $'PasswordAuthentication no\nKbdInteractiveAuthentication no\n'
    if ! sshd -t; then
      rm -f "$f"
      echo "sshd -t rejected the config; $f removed" >&2
      return 1
    fi
    systemctl reload ssh
  }
  change "write /etc/ssh/sshd_config.d/10-disable-password-auth.conf and reload ssh" disable_password_auth
fi

# ---------------------------------------------------------------------------
section "The deploy user"
if id deploy > /dev/null 2>&1; then
  ok "user deploy"
else
  change "create user deploy" sh -c "adduser --disabled-password --gecos '' deploy > /dev/null"
fi
if [[ " $(id -nG deploy 2> /dev/null || true) " == *" docker "* ]]; then
  ok "deploy in group docker"
else
  change "add deploy to group docker" usermod -aG docker deploy
fi
keys=/home/deploy/.ssh/authorized_keys
if [ -d /home/deploy/.ssh ] && [ "$(stat -c '%a %U' /home/deploy/.ssh)" = "700 deploy" ]; then
  ok "/home/deploy/.ssh"
else
  change "create /home/deploy/.ssh" install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
fi
if [ -z "$deploy_pubkey" ]; then
  ok "DEPLOY_PUBKEY not set — authorized_keys left as is"
elif [ -f "$keys" ] && grep -qF -- "$(awk '{ print $2 }' <<< "$deploy_pubkey")" "$keys"; then
  ok "deploy key in $keys"
else
  change "add the deploy key to $keys" sh -c "printf '%s\n' '$deploy_pubkey' >> '$keys' && chown deploy:deploy '$keys' && chmod 600 '$keys'"
fi

# The two commands the deploy runs to apply an Nginx config change, nothing else.
sudoers_check() { visudo -cqf "$1"; }
ensure_file /etc/sudoers.d/deploy-nginx 440 \
  $'deploy ALL=(root) NOPASSWD: /usr/sbin/nginx -t, /usr/bin/systemctl reload nginx\n' \
  sudoers_check || true

# ---------------------------------------------------------------------------
section "Deploy clone at $app_dir"
if [ -d "$app_dir/.git" ]; then
  sparse=$(runuser -u deploy -- git -C "$app_dir" sparse-checkout list 2> /dev/null || true)
  if [ "$sparse" = docker ]; then
    ok "sparse clone of docker/"
  else
    warn "$app_dir is a clone but its sparse checkout is '${sparse:-off}', not 'docker' — left as is"
  fi
else
  change "clone docker/ into $app_dir" sh -c "install -d -o deploy -g deploy '$app_dir' &&
    runuser -u deploy -- git clone -q --sparse '$repo_url' '$app_dir' &&
    runuser -u deploy -- git -C '$app_dir' sparse-checkout set --cone docker"
fi
[ -f "$app_dir/.env" ] || warn "$app_dir/.env missing — create it from .env.example (docs/infrastructure.md)"

# ---------------------------------------------------------------------------
section "Database volume"
# external: true in the prod overlay, so compose neither creates nor deletes it.
if ! systemctl is-active --quiet docker; then
  warn "Docker is not running — postgres_data not checked"
elif docker volume inspect postgres_data > /dev/null 2>&1; then
  ok "docker volume postgres_data"
else
  change "create docker volume postgres_data" sh -c "docker volume create postgres_data > /dev/null"
fi

# ---------------------------------------------------------------------------
section "Nginx"
nginx_reload() { nginx -t -q && systemctl reload nginx; }
if [ ! -f /etc/nginx/nginx.conf ]; then
  ok "Nginx not installed yet — nothing to check"
elif grep -Eq '^\s*server_tokens\s+off;' /etc/nginx/nginx.conf; then
  ok "server_tokens off"
elif grep -Eq '^\s*#\s*server_tokens\s+off;' /etc/nginx/nginx.conf; then
  change "uncomment server_tokens off in /etc/nginx/nginx.conf" \
    sed -i -E 's/^(\s*)#\s*(server_tokens\s+off;)/\1\2/' /etc/nginx/nginx.conf
  then_run nginx_reload
else
  warn "/etc/nginx/nginx.conf has no server_tokens line to switch on — add 'server_tokens off;' to its http block"
fi

site=/etc/nginx/sites-enabled/beyondthearc
site_target=$app_dir/docker/nginx/beyondthearc.conf
if [ "$(readlink "$site" || true)" = "$site_target" ]; then
  ok "$site -> $site_target"
elif [ -e "$site" ] || [ -L "$site" ]; then
  warn "$site exists and is not a link to $site_target — left as is"
elif [ ! -f "$site_target" ]; then
  warn "$site_target missing — the clone is not in place yet"
elif [ ! -f "$cert" ]; then
  warn "no certificate at $cert yet — issue it, then re-run (docs/infrastructure.md, Rebuilding the server from zero)"
else
  link_site() {
    ln -s "$site_target" "$site"
    if ! nginx -t -q; then
      rm -f "$site"
      echo "nginx -t rejected the site; link removed" >&2
      return 1
    fi
    systemctl reload nginx
  }
  change "link $site -> $site_target" link_site
fi

# ---------------------------------------------------------------------------
printf '\n%s: %d change(s), %d warning(s)\n' "$([ "$check" = 1 ] && echo check || echo applied)" "$changes" "$warnings"
if [ "$check" = 1 ] && [ "$changes" -gt 0 ]; then exit 1; fi
