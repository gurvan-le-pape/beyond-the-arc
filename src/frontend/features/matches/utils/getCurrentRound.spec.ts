// src/frontend/features/matches/utils/getCurrentRound.spec.ts
import { describe, expect, it } from "vitest";

import type { Match } from "@/features/matches/types";

import { getCurrentRound } from "./getCurrentRound";

const match = (homeTeamScore: number | null) =>
  ({ homeTeamScore, awayTeamScore: homeTeamScore }) as Match;

describe("getCurrentRound", () => {
  it("is the latest round with a result", () => {
    expect(
      getCurrentRound({
        1: [match(70), match(64)],
        2: [match(81)],
        3: [match(null)],
      }),
    ).toBe(2);
  });

  it("includes a round still in progress", () => {
    expect(
      getCurrentRound({ 1: [match(70)], 2: [match(55), match(null)] }),
    ).toBe(2);
  });

  it("orders rounds numerically, not as object keys", () => {
    expect(getCurrentRound({ 2: [match(60)], 10: [match(72)] })).toBe(10);
  });

  it("is the first round before any result", () => {
    expect(getCurrentRound({ 3: [match(null)], 1: [match(null)] })).toBe(1);
  });

  it("is null without rounds", () => {
    expect(getCurrentRound({})).toBeNull();
  });
});
