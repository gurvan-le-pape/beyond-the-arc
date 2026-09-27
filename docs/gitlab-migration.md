# GitLab migration — runner, variables, VPS

Operational companion to `.gitlab-ci.yml`. `docs/ci-cd.md` still describes the
GitHub Actions pipeline and is stale until it is rewritten.

## Why a self-hosted runner

GitLab's free tier includes 400 compute minutes per month on shared runners. One
pipeline here is 12 jobs plus four image builds, and every merge produces two
pipelines (merge request, then `main`) — roughly 50-70 minutes. That is six to
eight merges a month before the quota is gone. Jobs executed on a runner you
host are unmetered, and using one also avoids the credit-card verification that
GitLab requires for shared runners.

## Runner registration

Two settings are not optional, and neither announces itself when missed.

Register with the **docker executor**, and mount the host Docker socket so the
`deploy` job builds against a long-lived daemon. That daemon's layer cache is
what replaces GitHub's `cache-from/cache-to: type=gha`, which has no counterpart
here — without it every pipeline rebuilds four images from scratch.

In `~/.gitlab-runner/config.toml`, under the runner's `[runners.docker]`:

```toml
volumes = ["/var/run/docker.sock:/var/run/docker.sock", "/cache"]
```

The socket makes the job root-equivalent on the host. That is acceptable here
because the runner runs on the developer's own machine and builds only this
repository's own Dockerfiles; it would not be on a runner shared with anything
else.

**Untagged jobs.** A new runner runs only jobs carrying a matching tag. No job
here declares `tags:`, so the runner must be created with *Run untagged jobs*
checked, or every pipeline sits pending with no error.

**Instance runners off.** Settings -> CI/CD -> Runners -> disable *Enable
instance runners for this project*. Left on, GitLab's shared runners win most
jobs — measured on the first green pipeline: 11 of 12 jobs ran on
`k8s.saas-linux-small-amd64`, one on `wsl-local`. That spends the 400 free
compute minutes the self-hosted runner exists to avoid, and it breaks `deploy`
outright, which needs the host Docker socket that only this runner mounts.

**Concurrency.** `concurrent = 1` is the default, a global key at the top of
`config.toml`, and it serializes all twelve jobs. `concurrent = 4` on an 8-core
host runs a full pipeline in under two minutes and leaves the machine usable;
raise it only if that proves slow.

WSL note: the runner only executes while WSL is up. `ci.yml`'s triggers are
pushes and merge requests, which only happen while you are working, so this
costs nothing — except `audit.yml`'s weekly cron, which has no equivalent here
yet. Port it as a scheduled pipeline and let it run on GitLab's shared runners:
it is a few minutes a week and fits the free quota.

## CI/CD variables

Settings → CI/CD → Variables. Mask every secret; none may be exposed in job
logs.

| Variable | Purpose |
|---|---|
| `VPS_HOST` | VPS address |
| `VPS_USER` | `deploy` — unprivileged, owns `/opt/beyondthearc`, in the `docker` group |
| `VPS_SSH_KEY` | Private deploy key (masked) |
| `VPS_HOST_KEY` | Pinned host key **material only** (`ssh-ed25519 AAAA…`), not a full `known_hosts` line |
| `DEPLOY_REGISTRY_USER` | Deploy token username, for the VPS's registry login |
| `DEPLOY_REGISTRY_TOKEN` | Deploy token with `read_registry` (masked) |
| `NEXT_PUBLIC_API_URL` | Frontend build arg |
| `FRONTEND_URL` | Frontend build arg |
| `SENTRY_AUTH_TOKEN` | Source map upload; passed as a BuildKit secret, never a build arg (masked) |
| `SONAR_TOKEN` | SonarCloud (masked) |
| `SONAR_HOST_URL` | `https://sonarcloud.io` |

A **deploy token** rather than the pipeline's `CI_JOB_TOKEN` for the VPS: the job
token dies with the job, so a later manual `docker compose pull` on the VPS
would fail. The push side of the pipeline keeps using `CI_REGISTRY_USER` /
`CI_REGISTRY_PASSWORD`, which GitLab injects automatically.

## VPS changes

1. Repoint the clone:
   `cd /opt/beyondthearc && git remote set-url origin <new repository URL>`
   The deploy does `git pull`, so this must work non-interactively. A public
   project pulls anonymously; a private one needs a deploy token in the URL.
2. Add the registry path to `/opt/beyondthearc/.env`:
   `REGISTRY_IMAGE=registry.gitlab.com/<namespace>/beyond-the-arc`
   `docker/docker-compose.prod.yml` reads it, so the overlay is registry-agnostic
   and a future move is an `.env` edit.
3. `IMAGE_TAG` in `.env` keeps its meaning — the deploy pins it to the commit
   SHA, and rollback is still: set it to a previous SHA, then rerun the pull and
   `up -d`.

## Registry storage

The free tier's 10 GiB is shared across repository and registry storage, and
every deploy pushes four `:SHA`-tagged images. Set a cleanup policy on the
container registry (keep the most recent N tags plus `latest`) or the quota will
fill the way the VPS disk did.

## SonarCloud

The original organization is owned by the GitHub-authenticated identity.
Signing in through GitLab creates a separate SonarCloud user that is a member
of nothing — the old project stays readable only because it is public, and its
binding still points at the suspended GitHub repository. The scanner
authenticates, then fails resolving the merge request against that binding:

    Auto-configuring pull request 1
    ERROR Could not find the pullrequest with key '1'

Restricting the job to `main` would sidestep it, and is the wrong trade: the
analysis exists to catch a regression before it is merged, not after.

So the project now lives in a new organization bound to GitLab —
`sonar.organization=beyondthearc`, `sonar.projectKey=gurvan-le-pape_beyond-the-arc2`,
still on `https://sonarcloud.io`. Analysis history and the server-side quality
gate did not carry over; the exclusions and their reasoning did, since they
live in `sonar-project.properties`.

Disable *Automatic Analysis* (project -> Administration -> Analysis Method).
It ignores `sonar-project.properties` entirely — its first run reported 58k
lines of code and 1.9k maintainability issues against the configured
analysis's 34k and 4 — and SonarCloud refuses a CI analysis while it is on.

## Still to do

- Rewrite `docs/ci-cd.md`, which documents the GitHub pipeline.
- Port `.github/workflows/audit.yml` as a scheduled pipeline.
- Replace Dependabot, which has no GitLab equivalent, with Renovate.
- Bound the Next.js cache. `docker/frontend/Dockerfile` copies `.next/standalone`
  and `.next/static` and mounts nothing at `/app/.next/cache`, so the fetch Data
  Cache grows unbounded in the container's writable layer. Deploy frequency was
  its only eviction mechanism — every deploy recreated the container — and five
  weeks without one filled the VPS disk (27.4 GB in that layer alone, 38 GB
  total). See `docs/observability.md` for the alerting side: the Disk Full rule
  fired correctly and Grafana then stopped writing at 100%, because it stores
  its alert state on the disk it is watching.
