# Phase 5 gate: latency, the CX23 against the CX33

The first gate of phase 5, set by the phase 4 assessment (`ASSESSMENT.md`, "Latency"):
the same scenario against the CX23 running Compose and the CX33 running k3s, from the
same client, through the same path, with the same data. The no-go was a page median or
p95 worse on the CX33.

## Verdict: pass

The CX33 served pages faster in every pair, at a higher rate than the CX23 received, and
the API the same. Nothing failed on either side.

| Server side, ms | Pages median / p95 | API median / p95 |
|---|---|---|
| CX23, nginx `upstream_response_time` | 30–44 / 194–300 | 14–17 / 53–57 |
| CX33, Traefik `OriginDuration` | 26 / 126–130 | 16–17 / 52–54 |

## Conditions

- 2026-11-28, 00:08–00:26 UTC. Both hosts on application commit `2fe89b18`: the CX23 on
  `main` (no change under `src/` since), the CX33 on the image digests pinned in
  `app/production/kustomization.yaml`.
- The CX33's database restored from the CX23's backup the same evening, so the ids in
  `load/visits.js` resolve to the same rows. No match was due on either scheduler (the next
  one at 13:00 UTC), so neither was simulating.
- Both measured through Cloudflare from the same machine: `beyondthearc.app` and
  `rehearsal.beyondthearc.app`, proxied records on the same zone, Full (strict).
- `/en/players/…` and `/en/matches/…` skipped on both sides (`SKIP`): those paths carry
  Cloudflare's managed challenge on production, which a script does not pass. 11 paths
  remain, 7 pages and 4 API calls.
- 2 minutes of warm-up on each host, then six 2-minute runs alternating CX23, CX33, so a
  drift in the background or in Cloudflare lands on both.

## The rate, and the CX23's background

The CX23 serves the live site while it is measured; the CX33 serves nothing else. Its
nginx log counted the background during each run: 2.1, 3.6 and 2.2 requests per second
(crawlers, and one scraper rotating addresses). So the CX23 runs were at 5 requests per
second on top of that, 7.1–8.6 in all, and the CX33 runs at a flat 8. One CX23 run (8.6)
had slightly more load than the CX33; the other two had less.

## Results per run

Through Cloudflare, as k6 saw them (ms):

| Run | Host | k6 rate | Pages median / p95 | API median / p95 | CPU avg / max |
|---|---|---|---|---|---|
| a1 | CX23 | 5 | 85 / 261 | 70 / 124 | 37 / 46 % |
| b1 | CX33 | 8 | 77 / 172 | 72 / 128 | 35 / 38 % |
| a2 | CX23 | 5 | 94 / 355 | 70 / 124 | 42 / 60 % |
| b2 | CX33 | 8 | 76 / 167 | 69 / 121 | 36 / 41 % |
| a3 | CX23 | 5 | 86 / 267 | 74 / 125 | 41 / 64 % |
| b3 | CX33 | 8 | 75 / 168 | 67 / 122 | 36 / 40 % |

Behind the proxy, from its access log, k6's lines only (picked by their User-Agent):

| Run | Host | Pages median / p95 | API median / p95 |
|---|---|---|---|
| a1 | CX23 | 30 / 214 | 14 / 56 |
| b1 | CX33 | 26 / 130 | 17 / 54 |
| a2 | CX23 | 44 / 300 | 17 / 53 |
| b2 | CX33 | 26 / 126 | 16 / 52 |
| a3 | CX23 | 32 / 194 | 16 / 57 |
| b3 | CX33 | 26 / 130 | 17 / 52 |

CPU is Hetzner's metric for the server, divided by its vCPUs (2 and 4). Zero failures and
zero 5xx on both sides, in k6 and in both proxies' logs.

The two server-side numbers measure the same span: from the proxy sending the request to
the container to the last byte of the response coming back. nginx's
`upstream_response_time` is that span (the `beyondthearc_timing` log in
`docker/nginx/beyondthearc.conf`); Traefik's `OriginDuration` is the same span for its
backend (`traefik/helmchartconfig.yaml`).

## Reading it

- **The API is a tie.** Its calls are short queries and the time a visitor sees is the
  trip through Cloudflare, about 50 ms of the 70.
- **Pages are where the CX33 wins, mostly in the tail.** Server-side p95 drops from
  194–300 ms to about 130, with no spread between runs, while the CX23's p95 moves with
  its background (its worst run, a2, is the one with the most). A page is the frontend
  rendering on Node and calling the backend; on two vCPUs it competes with the backend,
  PostgreSQL and the observability stack, on four it does not.
- **The CX33 has headroom left.** It ran at 36 % with 8 requests per second; the CX23
  peaked at 64 % with fewer.

## What it does not show

- Traefik in place of nginx on the same machine. The phase 4 lab measured that on its own
  (+6 ms on a page median); this gate compares the two production setups as a whole.
- Rates beyond 8 requests per second, or the crawler surges production has seen. The
  gate is that latency does not degrade at today's load, not a capacity test.

## Seen on the way: a deploy is an outage on the CX23

While choosing the window, the CX23's nginx log showed about 400 502s in three hours. All
of them fell within five minutes of the end of a `main` CI run, one burst per deploy, ten
deploys that evening: each lasted 21–37 seconds and turned away 30–58 requests. It is the
Compose deploy replacing the frontend container: requests in flight are cut when Docker
kills the old one after its 10-second stop grace, and nothing answers until the new one
is up. A Deployment's rolling update on k3s starts the new pod before stopping the old
one, so the same deploy should cost nothing there; the cutover rehearsal measures that
rather than assuming it.

## To run it again

`load/README.md` has the command. Against production, at most 5 requests per second, off
peak, and with no merge to `main` during the window, since a deploy cuts the CX23 out
mid-run. The server-side times need the CX23's `/var/log/nginx/beyondthearc-timing.log`
and the CX33's Traefik log (`kubectl -n kube-system logs deploy/traefik`), filtered on the
run's `UA`.
