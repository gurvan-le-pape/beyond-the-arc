// src/frontend/shared/constants/externalLinks.spec.ts
import { afterEach, describe, expect, it, vi } from "vitest";

/** The module as loaded with one NEXT_PUBLIC_API_URL, read when it loads. */
async function loadWithApiUrl(url: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_API_URL", url);
  return import("./externalLinks");
}

describe("API_DOCS_URL", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is Swagger under the API's prefix, on the page's own host", async () => {
    const { API_DOCS_URL } = await loadWithApiUrl("/api");

    expect(API_DOCS_URL).toBe("/api/docs");
  });

  it("is Swagger on the API's host when the base is absolute", async () => {
    const { API_DOCS_URL } = await loadWithApiUrl("http://localhost:4000/api/");

    expect(API_DOCS_URL).toBe("http://localhost:4000/api/docs");
  });
});
