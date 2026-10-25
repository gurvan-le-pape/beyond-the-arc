// src/backend/modules/competitions/leaderboards/recent-form.spec.ts
import { buildRecentForm, type FormMatch } from "./recent-form";

/** A scored match between teams 1 and 2, home first. */
const game = (homeScore: number, awayScore: number): FormMatch => ({
  homeTeamId: 1,
  awayTeamId: 2,
  homeTeamScore: homeScore,
  awayTeamScore: awayScore,
});

describe("buildRecentForm", () => {
  it("gives each side its own result, oldest first", () => {
    // Newest first: team 1 lost the latest, won the one before.
    const form = buildRecentForm([game(70, 80), game(90, 60)]);

    expect(form.get(1)).toEqual(["W", "L"]);
    expect(form.get(2)).toEqual(["L", "W"]);
  });

  it("keeps only the five most recent results", () => {
    // Newest first: one loss, then six wins.
    const matches = [
      game(60, 70),
      ...Array.from({ length: 6 }, () => game(80, 70)),
    ];

    expect(buildRecentForm(matches).get(1)).toEqual(["W", "W", "W", "W", "L"]);
  });

  it("skips a match missing a score", () => {
    const unscored: FormMatch = { ...game(0, 0), homeTeamScore: null };

    expect(buildRecentForm([unscored, game(80, 70)]).get(1)).toEqual(["W"]);
  });

  it("leaves out a team with no scored match", () => {
    expect(buildRecentForm([]).has(1)).toBe(false);
  });
});
