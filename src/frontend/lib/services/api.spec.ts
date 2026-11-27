// src/frontend/lib/services/api.spec.ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { request } from "./api";

/** A fetch that never answers, and rejects with the signal's reason on abort. */
function hangingFetch() {
  return vi.fn(
    (_url: string, init: { signal: AbortSignal }) =>
      new Promise<Response>((_resolve, reject) => {
        if (init.signal.aborted) reject(init.signal.reason);
        init.signal.addEventListener("abort", () => reject(init.signal.reason));
      }),
  );
}

describe("request", () => {
  const { any, timeout } = AbortSignal;

  beforeEach(() => {
    // Safari before 17.4 has neither; request must not depend on them.
    Reflect.deleteProperty(AbortSignal, "any");
    Reflect.deleteProperty(AbortSignal, "timeout");
  });

  afterEach(() => {
    Object.assign(AbortSignal, { any, timeout });
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("works without AbortSignal.any or AbortSignal.timeout", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ data: { id: 7 } })),
    );

    await expect(
      request("/players/7", { signal: new AbortController().signal }),
    ).resolves.toEqual({ id: 7 });
  });

  it("aborts with a TimeoutError after 30 seconds", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", hangingFetch());

    const result = request("/players/7");
    const assertion = expect(result).rejects.toMatchObject({
      name: "TimeoutError",
    });
    await vi.advanceTimersByTimeAsync(30_000);
    await assertion;
  });

  it("aborts when the caller's signal does", async () => {
    vi.stubGlobal("fetch", hangingFetch());
    const controller = new AbortController();

    const result = request("/players/7", { signal: controller.signal });
    controller.abort(new DOMException("superseded", "AbortError"));

    await expect(result).rejects.toMatchObject({ name: "AbortError" });
  });

  it("aborts at once when the caller's signal already has", async () => {
    const fetch = hangingFetch();
    vi.stubGlobal("fetch", fetch);
    const controller = new AbortController();
    controller.abort(new DOMException("superseded", "AbortError"));

    await expect(
      request("/players/7", { signal: controller.signal }),
    ).rejects.toMatchObject({ name: "AbortError" });
  });
});

/**
 * `request` as loaded in one runtime. Which URL it uses and how it reports a
 * network failure are fixed when the module loads, from `window` and the
 * environment, so each case loads a fresh copy after setting those.
 */
async function loadRequest(runtime: "server" | "browser") {
  vi.resetModules();
  vi.stubEnv("INTERNAL_API_URL", "http://backend:4000/api");
  vi.stubEnv("NEXT_PUBLIC_API_URL", "/api");
  if (runtime === "browser") vi.stubGlobal("window", globalThis);
  return (await import("./api")).request;
}

/** Records every call and answers each with `respond()`. */
function recordingFetch(respond: () => Response) {
  return vi.fn(async (_url: string, _init: RequestInit & { next?: unknown }) =>
    respond(),
  );
}

/** A fetch that answers every call with one JSON error body. */
function failingFetch(body: unknown, init: ResponseInit) {
  return vi.fn(async () => Response.json(body, init));
}

describe("request — the HTTP contract", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("calls the backend over the Docker network on the server", async () => {
    const fetch = recordingFetch(() => Response.json({ data: [] }));
    vi.stubGlobal("fetch", fetch);
    const request = await loadRequest("server");

    await request("/teams");

    expect(fetch.mock.calls[0][0]).toBe("http://backend:4000/api/teams");
  });

  it("calls the API on the page's own origin in the browser", async () => {
    const fetch = recordingFetch(() => Response.json({ data: [] }));
    vi.stubGlobal("fetch", fetch);
    const request = await loadRequest("browser");

    await request("/teams");

    expect(fetch.mock.calls[0][0]).toBe("/api/teams");
  });

  it("returns the envelope's data, or the body when it has none", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          Response.json({ data: { id: 7 }, statusCode: 200, path: "/x" }),
        )
        .mockResolvedValueOnce(Response.json([1, 2])),
    );
    const request = await loadRequest("server");

    await expect(request("/players/7")).resolves.toEqual({ id: 7 });
    await expect(request("/raw")).resolves.toEqual([1, 2]);
  });

  it("writes params as a query string, leaving out undefined and null", async () => {
    const fetch = recordingFetch(() => Response.json({ data: [] }));
    vi.stubGlobal("fetch", fetch);
    const request = await loadRequest("server");

    await request("/matches", {
      params: { teamId: 4, status: undefined, search: null, page: 0 },
    });
    await request("/matches", { params: { status: undefined } });

    expect(fetch.mock.calls[0][0]).toBe(
      "http://backend:4000/api/matches?teamId=4&page=0",
    );
    expect(fetch.mock.calls[1][0]).toBe("http://backend:4000/api/matches");
  });

  it("caches on the server for an hour unless told otherwise", async () => {
    const fetch = recordingFetch(() => Response.json({ data: [] }));
    vi.stubGlobal("fetch", fetch);
    const request = await loadRequest("server");

    await request("/teams");
    await request("/matches", { revalidate: 60 });

    expect(fetch.mock.calls[0][1].next).toEqual({ revalidate: 3_600 });
    expect(fetch.mock.calls[1][1].next).toEqual({ revalidate: 60 });
  });

  it("sends no Content-Type, so a browser GET needs no CORS preflight", async () => {
    const fetch = recordingFetch(() => Response.json({ data: [] }));
    vi.stubGlobal("fetch", fetch);
    const request = await loadRequest("browser");

    await request("/teams");

    expect(fetch.mock.calls[0][1].headers).toBeUndefined();
  });

  it("throws an ApiError carrying the status, the envelope and the request id", async () => {
    vi.stubGlobal(
      "fetch",
      failingFetch(
        {
          statusCode: 404,
          message: "Team 99 not found",
          error: "Not Found",
          path: "/api/teams/99",
          timestamp: "2026-11-20T00:00:00.000Z",
        },
        { status: 404, headers: { "x-request-id": "req-123" } },
      ),
    );
    const request = await loadRequest("server");

    await expect(request("/teams/99")).rejects.toMatchObject({
      name: "ApiError",
      statusCode: 404,
      message: "Team 99 not found",
      error: "Not Found",
      path: "/api/teams/99",
      requestId: "req-123",
    });
  });

  it("joins a validation error's message list", async () => {
    vi.stubGlobal(
      "fetch",
      failingFetch(
        {
          statusCode: 400,
          message: [
            "limit must not be greater than 100",
            "page must be an integer",
          ],
          error: "Bad Request",
        },
        { status: 400 },
      ),
    );
    const request = await loadRequest("server");

    await expect(request("/teams")).rejects.toMatchObject({
      statusCode: 400,
      message: "limit must not be greater than 100, page must be an integer",
    });
  });

  it("falls back to the status text when the error body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response("<html>Bad Gateway</html>", {
            status: 502,
            statusText: "Bad Gateway",
          }),
      ),
    );
    const request = await loadRequest("server");

    await expect(request("/teams")).rejects.toMatchObject({
      statusCode: 502,
      message: "Bad Gateway",
      error: "Bad Gateway",
      requestId: undefined,
    });
  });

  it("turns a request with no response into an ApiError 0 in the browser", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );
    const request = await loadRequest("browser");

    await expect(request("/teams")).rejects.toMatchObject({
      name: "ApiError",
      statusCode: 0,
      message: "Failed to fetch",
      error: "TypeError",
    });
  });

  it("rethrows a fetch failure untouched on the server", async () => {
    // Next signals its own render control flow by throwing out of fetch;
    // repackaging that would break it.
    const thrown = new Error("NEXT_REDIRECT");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw thrown;
      }),
    );
    const request = await loadRequest("server");

    await expect(request("/teams")).rejects.toBe(thrown);
  });
});
