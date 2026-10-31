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
