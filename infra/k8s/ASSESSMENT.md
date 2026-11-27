# Phase 4 assessment: the k3s lab, go or no-go

Measured 2026-11-27 on the lab as `main` deploys it (PRs 1–7: Argo CD, CloudNativePG, the
app, Traefik with cert-manager and Sealed Secrets, observability, ARC), on the
maintainer's PC: k3d, k3s v1.37.2, the node capped at 8 GiB, the same memory as the CX33.

The plan's criteria: done when the app runs fully in the lab, a real R2 dump restores
with counts equal to production, memory under load stays under 6 GB, and Argo CD deploys
from Git; no-go if memory at rest is over 75 %, the restore fails, or latency degrades.
Memory is judged on the node's anonymous memory (cgroup `anon`), the memory nothing can
reclaim: the page cache of the database files fills whatever is left and is given back
under pressure (ruled 2026-11-27, see the README).

## Verdict: go, with latency as phase 5's first gate

| Criterion | Threshold | Measured | |
|---|---|---|---|
| Memory at rest | anon < 75 % of 8 GiB (6 GiB) | 3.15 GiB, 39 % | pass |
| Memory under load | < 6 GB | peak 3.25 GiB, 41 % (load + two runner jobs) | pass |
| Memory during a restore | (same) | peak 3.42 GiB, 43 %, no OOM kill | pass |
| Restore | counts equal to production | equal, 270 s | pass |
| Argo CD from Git | every Application from `main` | 12 Synced/Healthy | pass |
| Latency | not degraded | what k3s adds: +1 ms API, +6 ms pages (median) | pass in the lab; CX33 against CX23 in phase 5 |

## Restore

The lab's database Cluster deleted, Argo CD recreated it empty, and `restore.sh` restored
the latest dump (`daily/btadb-2026-11-27T093842Z.dump.age`, 1.26 GB):

- restored in 270 s, analysed in 4 s (285 s end to end);
- counts identical to `restore-test.sh`'s restore of the same dump, which were identical to
  production when it was taken: matches 525 384 (completed 231 828), match events
  79 477 001, players 634 608, teams 52 884, clubs 3 804;
- the backend and scheduler restarted onto it; `/api/stats` serves the same figures.

Memory every 5 s during it: anon from 3.26 to a peak of 3.42 GiB, page cache up to
5.2 GiB, 190 k reclaim events at the cgroup limit, 0 OOM kills. The page cache meeting the
limit is reclaim working as intended, not pressure on the application.

One trap: the deleted Cluster's pod stayed `Terminating` for several minutes. Its instance
manager loses access to the API as soon as the Cluster goes (`Unauthorized`), so it never
reports PostgreSQL stopped, and the pod waits out its 1 800 s grace period while the new
Cluster waits for its name. Force-deleting it is safe, since its data is the data being
replaced; `restore.sh` says so now.

## Memory under load

`load/visits.js` at 20 requests per second for 5 minutes through Traefik (6 001 requests,
0 failed, pages median 8 ms / p95 35 ms), with a `lab-runner.yml` job at 1 and 2.5
minutes, sampled every 2 s:

| | anon |
|---|---|
| Before the load | 3.15 GiB |
| Peak | 3.25 GiB (+100 MiB) |
| Mean | 3.16 GiB |
| Runner pods (each pod's `memory.peak`) | 111 MiB and 216 MiB |

At rest, what the cluster holds since PR 4 (anon 1.81 GiB with the app alone):
observability +1.2 GiB (Prometheus, Loki, Grafana, Alloy, blackbox, the operator, kube-state-metrics, node-exporter), ARC +0.3 GiB (controller and listener; runners only while a job runs).
Under 6 GB with 2.75 GiB to spare, which is what two concurrent CI jobs that build images
would have to fit in once CI moves to these runners.

## Latency

The same 13 requests, a visitor's mix (the home page, a championship, its pool's
leaderboard and matches, a club, a team, a player, a match, and the API calls behind them,
with the same ids in both databases), at 5 requests per second for 2 minutes after a
2-minute warm-up, along three paths:

| Path | Pages median / p95 | API median / p95 |
|---|---|---|
| a. Inside the cluster, to the Services | 4 / 27 ms | 2 / 9 ms |
| b. Inside the cluster, through Traefik with TLS | 10 / 42 ms | 3 / 11 ms |
| c. From the machine, through k3d's port and Traefik | 9 / 38 ms | 4 / 10 ms |
| d. Production, through Cloudflare (1 request per second) | 95 / 226 ms | 81 / 168 ms |

What k3s adds is b − a: the Ingress and its TLS, +6 ms on a page median, +1 ms on the API.
Production already has a reverse proxy with TLS in that place (nginx), so this is a
replacement, not an addition. k3d's port adds nothing (c ≈ b). The heaviest pages (the
home page, a championship) take 20–25 ms in the app itself, the same with or without
Traefik.

The production row does not answer the question, and is not meant to. It crosses the
internet and Cloudflare to two shared vCPUs, against eight local cores. It is the baseline
for phase 5. Two of its paths, `/en/players/…` and `/en/matches/…`, got Cloudflare's
managed challenge (403, `cf-mitigated: challenge`), the scraper protection those paths
have; a script is not a browser, so those two are excluded from the row.

"Latency does not degrade" can only be measured on the same class of machine. So it is
the first gate of phase 5. Before cutover, `load/visits.js` runs against the CX23 and
against the CX33 running k3s, from the same client, at the same rate, with the same data.
The no-go is a page median or p95 worse on the CX33.

## Carried into phase 5

- The latency gate above.
- Traefik: HTTP to HTTPS redirect and the security headers nginx sets today.
- A production issuer (Let's Encrypt production) for the real hostnames.
- CloudNativePG's own backups to R2 with WAL archiving, replacing the systemd timer, and
  the Database Backup Missing alert pointed at them.
- The node filesystem alert (Disk Full fires in the lab because a k3d node has no `/`;
  a real node does).
- CI on the ARC runners needs a way to build and start images without the host's Docker
  socket.
