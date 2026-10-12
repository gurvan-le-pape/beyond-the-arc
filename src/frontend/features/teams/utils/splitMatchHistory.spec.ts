// src/frontend/features/teams/utils/splitMatchHistory.spec.ts
import { describe, expect, it } from "vitest";

import type { TeamMatchHistory } from "../types/TeamMatchHistory";
import { splitMatchHistory } from "./splitMatchHistory";

/** A match on `startsAt`, played when it has a score. */
function match(
  id: number,
  startsAt: string,
  score: number | null,
): TeamMatchHistory {
  return {
    id,
    startsAt,
    homeTeamScore: score,
    awayTeamScore: score,
  } as TeamMatchHistory;
}

describe("splitMatchHistory", () => {
  // Latest first, as the backend returns a season in progress: fixtures on top.
  const season = [
    match(4, "2026-12-26T21:00:00Z", null),
    match(3, "2026-12-18T18:00:00Z", null),
    match(2, "2026-10-03T12:00:00Z", 70),
    match(1, "2026-09-26T12:00:00Z", 65),
  ];

  it("keeps played matches latest first", () => {
    expect(splitMatchHistory(season).played.map((m) => m.id)).toEqual([2, 1]);
  });

  it("puts the next upcoming match first", () => {
    expect(splitMatchHistory(season).upcoming.map((m) => m.id)).toEqual([3, 4]);
  });

  it("has no upcoming matches once the season is over", () => {
    expect(splitMatchHistory(season.slice(2)).upcoming).toEqual([]);
  });
});
