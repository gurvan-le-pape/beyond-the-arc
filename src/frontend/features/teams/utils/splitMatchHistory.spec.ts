// src/frontend/features/teams/utils/splitMatchHistory.spec.ts
import { describe, expect, it } from "vitest";

import type { TeamMatchHistory } from "../types/TeamMatchHistory";
import { splitMatchHistory } from "./splitMatchHistory";

function match(
  id: number,
  startsAt: string,
  status: TeamMatchHistory["status"],
): TeamMatchHistory {
  return { id, startsAt, status } as TeamMatchHistory;
}

describe("splitMatchHistory", () => {
  // Latest first, as the backend returns a season in progress: fixtures on top.
  const season = [
    match(4, "2026-12-26T21:00:00Z", "scheduled"),
    match(3, "2026-12-18T18:00:00Z", "scheduled"),
    match(2, "2026-10-03T12:00:00Z", "completed"),
    match(1, "2026-09-26T12:00:00Z", "completed"),
  ];

  it("keeps past matches latest first", () => {
    expect(splitMatchHistory(season).past.map((m) => m.id)).toEqual([2, 1]);
  });

  it("puts the next upcoming match first", () => {
    expect(splitMatchHistory(season).upcoming.map((m) => m.id)).toEqual([3, 4]);
  });

  it("has no upcoming matches once the season is over", () => {
    expect(splitMatchHistory(season.slice(2)).upcoming).toEqual([]);
  });

  it("counts a failed match as past, in date order, not as upcoming", () => {
    const { past, upcoming } = splitMatchHistory([
      match(3, "2026-10-10T12:00:00Z", "completed"),
      match(2, "2026-10-03T12:00:00Z", "failed"),
      match(1, "2026-09-26T12:00:00Z", "completed"),
    ]);

    expect(past.map((m) => m.id)).toEqual([3, 2, 1]);
    expect(upcoming).toEqual([]);
  });

  it("counts a match being generated as upcoming", () => {
    const { past, upcoming } = splitMatchHistory([
      match(1, "2026-10-03T12:00:00Z", "generating"),
    ]);

    expect(past).toEqual([]);
    expect(upcoming.map((m) => m.id)).toEqual([1]);
  });
});
