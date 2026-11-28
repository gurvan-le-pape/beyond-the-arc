# Load

`visits.js` is the k6 scenario the phase 4 assessment measured with (`../ASSESSMENT.md`),
kept to measure again: on the CX33 against the CX23 at the phase 5 rehearsal, or after a
change that could move latency. One request per iteration at a constant rate, pages and
API calls in a visitor's proportions, each timed apart.

From the machine, against the lab (staging certificate, name resolved to the lab):

```bash
docker run --rm -i --network host grafana/k6:2.4.0@sha256:d41bb79cd8de5a7ad619b53570e3712633e8bff0937010a5c6c57a4747e7a276 run - \
  -e PAGE_BASE=https://lab.beyondthearc.app -e API_BASE=https://lab.beyondthearc.app \
  -e RESOLVE=lab.beyondthearc.app:443=127.0.0.1:8443 -e INSECURE=1 \
  -e RATE=5 -e DURATION=2m < infra/k8s/load/visits.js
```

From inside the cluster, to the Services directly, with no Ingress in the path:

```bash
infra/k8s/k.sh kubectl run k6 -n bta -i --rm --restart=Never --image=grafana/k6:2.4.0@sha256:d41bb79cd8de5a7ad619b53570e3712633e8bff0937010a5c6c57a4747e7a276 -- \
  run - -e PAGE_BASE=http://frontend:3000 -e API_BASE=http://backend:4000 \
  -e RATE=5 -e DURATION=2m < infra/k8s/load/visits.js
```

Against production only gently: it is the live site on two vCPUs. The phase 4 assessment
used one request per second; the phase 5 gate (`../ASSESSMENT-phase5.md`) used 5, off peak,
with no merge to `main` during the window. Through Cloudflare, skip the two paths its
managed challenge stops, and mark the run so the proxy's access log gives its server-side
times:

```bash
docker run --rm -i --network host grafana/k6:2.4.0@sha256:d41bb79cd8de5a7ad619b53570e3712633e8bff0937010a5c6c57a4747e7a276 run - \
  -e PAGE_BASE=https://beyondthearc.app -e API_BASE=https://beyondthearc.app \
  -e SKIP='^/en/(players|matches)/' -e UA=bta-load-a1 \
  -e RATE=5 -e DURATION=2m < infra/k8s/load/visits.js
```

A run stops itself once more than 1 % of its requests have failed.
