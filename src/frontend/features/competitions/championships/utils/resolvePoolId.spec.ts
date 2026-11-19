// src/frontend/features/competitions/championships/utils/resolvePoolId.spec.ts
import { describe, expect, it } from "vitest";

import type { ChampionshipPool } from "../types";
import { resolvePoolId } from "./resolvePoolId";

const pools = [{ id: 7 }, { id: 8 }, { id: 9 }] as ChampionshipPool[];

describe("resolvePoolId", () => {
  it("returns the pool the query names", () => {
    expect(resolvePoolId(pools, "8")).toBe(8);
  });

  it("falls back to the first pool when the param is absent, unknown or not a number", () => {
    expect(resolvePoolId(pools, undefined)).toBe(7);
    expect(resolvePoolId(pools, "")).toBe(7);
    expect(resolvePoolId(pools, "42")).toBe(7);
    expect(resolvePoolId(pools, "abc")).toBe(7);
  });
});
