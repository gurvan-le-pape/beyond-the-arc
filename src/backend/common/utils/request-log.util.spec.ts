// src/backend/common/utils/request-log.util.spec.ts
import {
  LOGGED_REQUEST_HEADERS,
  serializeRequestLog,
} from "./request-log.util";

// The header block a real visitor's request carries by the time it reaches the
// backend, through Cloudflare and then Nginx.
const VISITOR_REQUEST = {
  id: "req-1",
  method: "GET",
  url: "/api/clubs?search=Dupont&limit=1",
  headers: {
    host: "backend:4000",
    connection: "keep-alive",
    "cf-connecting-ip": "203.0.113.77",
    "x-forwarded-for": "203.0.113.77, 172.70.100.1",
    "x-real-ip": "203.0.113.77",
    "cf-ipcountry": "FR",
    "accept-language": "fr-FR,fr;q=0.9",
    referer: "https://elsewhere.example/profile/42",
    "user-agent": "Mozilla/5.0",
    cookie: "session=secret",
    authorization: "Bearer secret",
    accept: "application/json",
  },
};

describe("serializeRequestLog", () => {
  it("keeps the fields a log line is diagnosed with", () => {
    const serialized = serializeRequestLog(VISITOR_REQUEST);

    expect(serialized.id).toBe("req-1");
    expect(serialized.method).toBe("GET");
    expect(serialized.url).toBe("/api/clubs?search=Dupont&limit=1");
    expect(serialized.headers).toEqual({
      host: "backend:4000",
      "user-agent": "Mozilla/5.0",
      accept: "application/json",
    });
  });

  it("drops every header carrying the visitor's IP", () => {
    const line = JSON.stringify(serializeRequestLog(VISITOR_REQUEST));

    expect(line).not.toContain("203.0.113.77");
    for (const header of ["cf-connecting-ip", "x-forwarded-for", "x-real-ip"]) {
      expect(line).not.toContain(header);
    }
  });

  it("drops credentials without depending on a redact path", () => {
    const line = JSON.stringify(serializeRequestLog(VISITOR_REQUEST));

    expect(line).not.toContain("secret");
    expect(line).not.toContain("authorization");
    expect(line).not.toContain("cookie");
  });

  it("drops the fingerprinting and referrer headers nothing reads", () => {
    const line = JSON.stringify(serializeRequestLog(VISITOR_REQUEST));

    expect(line).not.toContain("accept-language");
    expect(line).not.toContain("cf-ipcountry");
    expect(line).not.toContain("elsewhere.example");
  });

  // The point of an allowlist: a header nobody has heard of yet is not logged.
  it("does not log a header added by a future proxy", () => {
    const serialized = serializeRequestLog({
      ...VISITOR_REQUEST,
      headers: { ...VISITOR_REQUEST.headers, "cf-pseudo-ipv4": "203.0.113.9" },
    });

    expect(JSON.stringify(serialized)).not.toContain("cf-pseudo-ipv4");
  });

  it("keeps the query string on the url", () => {
    expect(serializeRequestLog(VISITOR_REQUEST).url).toContain("search=Dupont");
  });

  it("omits an allowlisted header that is absent rather than writing undefined", () => {
    const serialized = serializeRequestLog({
      id: "req-2",
      method: "GET",
      url: "/api/health/ready",
      headers: { host: "backend:4000" },
    });

    expect(serialized.headers).toEqual({ host: "backend:4000" });
    expect(Object.keys(serialized.headers)).not.toContain("user-agent");
  });

  it("survives a request with no headers at all", () => {
    expect(serializeRequestLog({ id: "req-3" })).toEqual({
      id: "req-3",
      method: undefined,
      url: undefined,
      headers: {},
    });
  });

  it("allowlists nothing that could carry an address or an identity", () => {
    expect([...LOGGED_REQUEST_HEADERS]).toEqual([
      "host",
      "user-agent",
      "content-type",
      "accept",
    ]);
  });
});
