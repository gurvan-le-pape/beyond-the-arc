// src/frontend/shared/utils/safeFetch.spec.ts
import { afterEach, describe, expect, it, vi } from "vitest";

import { safeFetch } from "./safeFetch";

describe("safeFetch", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the parsed body, passing the caller's signal through", async () => {
    const fetch = vi.fn(async () =>
      Response.json({ type: "FeatureCollection" }),
    );
    vi.stubGlobal("fetch", fetch);
    const { signal } = new AbortController();

    await expect(
      safeFetch("https://example.org/a.geojson", signal),
    ).resolves.toEqual({
      type: "FeatureCollection",
    });
    expect(fetch).toHaveBeenCalledWith("https://example.org/a.geojson", {
      signal,
    });
  });

  it("throws an ApiError for a non-2xx response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () => new Response("", { status: 404, statusText: "Not Found" }),
      ),
    );

    await expect(
      safeFetch("https://example.org/missing"),
    ).rejects.toMatchObject({
      name: "ApiError",
      statusCode: 404,
      message: "Not Found",
    });
  });
});
