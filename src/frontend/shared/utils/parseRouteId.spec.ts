// src/frontend/shared/utils/parseRouteId.spec.ts
import { describe, expect, it } from "vitest";

import { parseRouteId } from "./parseRouteId";

/** What Next's real `notFound()` throws; the not-found boundary keys on it. */
const NOT_FOUND = { digest: "NEXT_HTTP_ERROR_FALLBACK;404" };

describe("parseRouteId", () => {
  it("parses a positive integer segment", () => {
    expect(parseRouteId("7")).toBe(7);
    expect(parseRouteId("2147483647")).toBe(2_147_483_647);
  });

  it.each(["abc", "", "0", "-3"])("is a 404 for %j", (segment) => {
    expect(() => parseRouteId(segment)).toThrow(
      expect.objectContaining(NOT_FOUND),
    );
  });

  it("is a 404 above the int4 ceiling, which the backend would answer 400", () => {
    expect(() => parseRouteId("2147483648")).toThrow(
      expect.objectContaining(NOT_FOUND),
    );
  });
});
