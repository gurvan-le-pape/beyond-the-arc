// src/frontend/shared/utils/normalizeString.spec.ts
import { describe, expect, it } from "vitest";

import { normalizeString } from "./normalizeString";

describe("normalizeString", () => {
  it("lowercases and strips accents, so a search matches either spelling", () => {
    expect(normalizeString("Côtes-d'Armor")).toBe("cotes-d'armor");
    expect(normalizeString("FINISTÈRE")).toBe("finistere");
    expect(normalizeString("Ardèche")).toBe(normalizeString("ardeche"));
  });

  it("keeps characters that are not accented letters", () => {
    expect(normalizeString("U18 · Division 2")).toBe("u18 · division 2");
  });
});
