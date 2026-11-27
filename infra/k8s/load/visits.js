// A constant stream of what visitors request: server-rendered pages, and the API calls the
// browser makes from them. Each iteration is one request, taken in turn from the list
// below, at RATE requests per second for DURATION. Pages and API calls are timed apart
// (the page and api trends), and each path on its own; the end-of-run summary is JSON on
// stdout.
//
//   PAGE_BASE  where the pages are, e.g. https://lab.beyondthearc.app or http://frontend.bta.svc:3000
//   API_BASE   where /api is, e.g. https://lab.beyondthearc.app or http://backend.bta.svc:4000
//   RATE, DURATION  requests per second (default 5), how long (default 2m)
//   RESOLVE    optional host=ip:port, to reach a name with no public record pointing there
//   INSECURE   1 to accept a certificate no browser trusts (Let's Encrypt staging)
//
// The ids (a championship, its pool, a club, one of its teams, a player of it, a completed
// match) are the same in production and in a lab restored from its backup.
import http from "k6/http";
import { check } from "k6";
import exec from "k6/execution";
import { Trend, Rate } from "k6/metrics";

const pageBase = __ENV.PAGE_BASE;
const apiBase = __ENV.API_BASE;
if (!pageBase || !apiBase)
  throw new Error("PAGE_BASE and API_BASE are required");

const hosts = {};
if (__ENV.RESOLVE) {
  const [name, target] = __ENV.RESOLVE.split("=");
  hosts[name] = target;
}

export const options = {
  hosts,
  insecureSkipTLSVerify: __ENV.INSECURE === "1",
  discardResponseBodies: true,
  scenarios: {
    visits: {
      executor: "constant-arrival-rate",
      rate: Number(__ENV.RATE || 5),
      timeUnit: "1s",
      duration: __ENV.DURATION || "2m",
      preAllocatedVUs: 20,
      maxVUs: 200,
    },
  },
};

const requests = [
  ["page", "/en"],
  ["api", "/api/stats"],
  ["page", "/en/championships"],
  ["page", "/en/championships/294"],
  ["api", "/api/championships/294"],
  ["api", "/api/pools/795/leaderboard"],
  ["api", "/api/pools/795/matches"],
  ["page", "/en/organizations/clubs"],
  ["page", "/en/organizations/clubs/534"],
  ["page", "/en/teams/8409"],
  ["page", "/en/players/100897"],
  ["page", "/en/matches/83629"],
  ["api", "/api/matches/83629"],
];

const trends = { page: new Trend("page", true), api: new Trend("api", true) };
const failed = new Rate("failed");
const byPath = requests.map(([, path], i) => [
  path,
  new Trend(`path_${i}`, true),
  new Rate(`path_${i}_failed`),
]);

export default function () {
  // The test's iteration count, not the VU's: every path in turn, whichever VU runs it.
  const i = exec.scenario.iterationInTest % requests.length;
  const [kind, path] = requests[i];
  const res = http.get((kind === "page" ? pageBase : apiBase) + path, {
    tags: { kind, path },
    redirects: 0,
  });
  const ok = check(res, { "2xx": (r) => r.status >= 200 && r.status < 300 });
  failed.add(!ok);
  trends[kind].add(res.timings.duration);
  const [, trend, pathFailed] = byPath[i];
  trend.add(res.timings.duration);
  pathFailed.add(!ok);
}

export function handleSummary(data) {
  const pick = (name) => {
    const m = data.metrics[name];
    return m ? m.values : null;
  };
  return {
    stdout:
      JSON.stringify({
        requests: pick("http_reqs"),
        failed: pick("failed"),
        page: pick("page"),
        api: pick("api"),
        paths: Object.fromEntries(
          byPath.map(([path], i) => [
            path,
            { ...pick(`path_${i}`), failed: pick(`path_${i}_failed`)?.rate },
          ]),
        ),
      }) + "\n",
  };
}
