// src/frontend/shared/utils/hasCriteria.spec.ts
import { describe, expect, it } from "vitest";

import { hasCriteria } from "./hasCriteria";

describe("hasCriteria", () => {
  it("is false when nothing is set", () => {
    expect(hasCriteria({})).toBe(false);
    expect(hasCriteria({ search: undefined, category: undefined })).toBe(false);
  });

  it("treats an empty search box as not set", () => {
    expect(hasCriteria({ search: "" })).toBe(false);
  });

  it("is true when one criterion is set", () => {
    expect(hasCriteria({ search: "mar", category: undefined })).toBe(true);
    expect(hasCriteria({ clubId: 12 })).toBe(true);
  });

  it("counts 0 as set, since it is a real value", () => {
    expect(hasCriteria({ number: 0 })).toBe(true);
  });
});
