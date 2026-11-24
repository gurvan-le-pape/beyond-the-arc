// src/backend/common/utils/request-log.util.spec.ts
import {
  attachFailureLog,
  failureLogProps,
  LOGGED_REQUEST_HEADERS,
  requestLogLevel,
  serializeRequestLog,
  serializeResponseLog,
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

describe("requestLogLevel", () => {
  it.each([
    [200, "info"],
    [304, "info"],
    [404, "warn"],
    [499, "warn"],
    [500, "error"],
    [503, "error"],
  ])("logs a %i at %s", (statusCode, level) => {
    expect(requestLogLevel({}, { statusCode })).toBe(level);
  });

  it("logs at error when pino-http saw an error, whatever the status", () => {
    expect(requestLogLevel({}, { statusCode: 200 }, new Error("x"))).toBe(
      "error",
    );
  });
});

describe("attachFailureLog / failureLogProps", () => {
  it("hands the attached fields to the completion line", () => {
    const res: { locals?: Record<string, unknown>; err?: unknown } = {
      locals: {},
    };
    attachFailureLog(res, { message: "not found" });
    expect(failureLogProps({}, res)).toEqual({ message: "not found" });
    expect(res.err).toBeUndefined();
  });

  // pino-http calls customProps when the request arrives too, before any
  // filter has attached anything — and before Express has always set `locals`.
  it("adds nothing to a request no filter touched", () => {
    expect(failureLogProps({}, { locals: {} })).toEqual({});
    expect(failureLogProps({}, {})).toEqual({});
  });

  it("puts the exception on res.err for pino-http to log", () => {
    const res: { locals?: Record<string, unknown>; err?: unknown } = {};
    const error = new TypeError("boom");
    attachFailureLog(res, { message: "boom" }, error);
    expect(res.err).toBe(error);
  });

  it("wraps a non-Error throw, which pino's err serializer cannot render", () => {
    const res: { locals?: Record<string, unknown>; err?: unknown } = {};
    attachFailureLog(res, { message: "raw" }, "raw");
    expect(res.err).toBeInstanceOf(Error);
    expect((res.err as Error).message).toBe("raw");
  });

  it("keeps the contents of a thrown object, circular or not", () => {
    const res: { locals?: Record<string, unknown>; err?: unknown } = {};
    const thrown: Record<string, unknown> = { code: "E_QUOTA" };
    thrown.self = thrown;
    attachFailureLog(res, { message: "object" }, thrown);
    expect(res.err).toBeInstanceOf(Error);
    expect((res.err as Error).message).toContain("E_QUOTA");
  });
});

describe("serializeResponseLog", () => {
  it("keeps the status and drops every header", () => {
    const res = {
      statusCode: 404,
      getHeaders: () => ({
        vary: "Origin",
        "x-request-id": "4431e8a0-0000-4000-8000-000000000000",
        etag: 'W/"9c-abc"',
      }),
    };
    expect(serializeResponseLog(res)).toEqual({ statusCode: 404 });
  });
});
