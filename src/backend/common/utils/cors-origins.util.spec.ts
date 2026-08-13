// src/backend/common/utils/cors-origins.util.spec.ts
import { DEV_ORIGIN, resolveCorsOrigins } from "./cors-origins.util";

describe("resolveCorsOrigins", () => {
  describe("in production", () => {
    it("trusts FRONTEND_URL and nothing else", () => {
      const origins = resolveCorsOrigins({
        NODE_ENV: "production",
        FRONTEND_URL: "https://example.com",
      });

      expect(origins).toEqual(["https://example.com"]);
      expect(origins).not.toContain(DEV_ORIGIN);
    });

    it("throws when FRONTEND_URL is unset, naming the variable", () => {
      expect(() => resolveCorsOrigins({ NODE_ENV: "production" })).toThrow(
        /FRONTEND_URL/,
      );
    });

    // The filed defect to the character: `process.env.FRONTEND_URL || ""` put an
    // empty string in the allowlist, which matches no Origin header.
    it("throws on an empty FRONTEND_URL rather than allowlisting an empty string", () => {
      expect(() =>
        resolveCorsOrigins({ NODE_ENV: "production", FRONTEND_URL: "" }),
      ).toThrow(/FRONTEND_URL/);
    });

    it("throws on a whitespace-only FRONTEND_URL", () => {
      expect(() =>
        resolveCorsOrigins({ NODE_ENV: "production", FRONTEND_URL: "   " }),
      ).toThrow(/FRONTEND_URL/);
    });

    it("trims a padded FRONTEND_URL", () => {
      expect(
        resolveCorsOrigins({
          NODE_ENV: "production",
          FRONTEND_URL: " https://example.com ",
        }),
      ).toEqual(["https://example.com"]);
    });
  });

  describe("outside production", () => {
    it("allows the dev origin when FRONTEND_URL is unset", () => {
      expect(resolveCorsOrigins({ NODE_ENV: "development" })).toEqual([
        DEV_ORIGIN,
      ]);
    });

    it("allows both when FRONTEND_URL names a different origin", () => {
      expect(
        resolveCorsOrigins({
          NODE_ENV: "development",
          FRONTEND_URL: "http://127.0.0.1:3000",
        }),
      ).toEqual(["http://127.0.0.1:3000", DEV_ORIGIN]);
    });

    // What the local .env actually sets.
    it("does not list the dev origin twice when FRONTEND_URL is the dev origin", () => {
      expect(
        resolveCorsOrigins({
          NODE_ENV: "development",
          FRONTEND_URL: DEV_ORIGIN,
        }),
      ).toEqual([DEV_ORIGIN]);
    });

    it("allows the dev origin when NODE_ENV is unset", () => {
      expect(resolveCorsOrigins({})).toEqual([DEV_ORIGIN]);
    });
  });

  it("reads process.env by default", () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    try {
      expect(resolveCorsOrigins()).toContain(DEV_ORIGIN);
    } finally {
      process.env.NODE_ENV = previous;
    }
  });
});
