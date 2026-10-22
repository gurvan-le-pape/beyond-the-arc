// src/frontend/features/matches/utils/buildTeam.spec.ts
import { describe, expect, it } from "vitest";

import type { TeamStats } from "@/features/teams/types";

import type { MatchPlayerWithStats, MatchTeamRef } from "../types";
import { buildTeam } from "./buildTeam";

const home = {
  id: 10,
  number: 1,
  club: { id: 100, name: "Garonne Avenir", committeeId: 5, leagueId: 2 },
} as MatchTeamRef;

const stats = {} as TeamStats;

/** A player line of the flat, both-sides list the API returns. */
function playerOf(teamId: number, playerId: number): MatchPlayerWithStats {
  return {
    player: { id: playerId, team: { id: teamId } },
  } as MatchPlayerWithStats;
}

describe("buildTeam", () => {
  it("builds a side for a match that has not been played", () => {
    const side = buildTeam(home, null, [], stats);

    expect(side.id).toBe(10);
    expect(side.name).toBe("Garonne Avenir\u00a0-\u2060\u00a01");
    expect(side.clubId).toBe(100);
    expect(side.score).toBeNull();
    expect(side.players).toEqual([]);
  });

  it("keeps only this side's players and the official score", () => {
    const players = [playerOf(10, 1), playerOf(20, 2), playerOf(10, 3)];

    const side = buildTeam(home, 72, players, stats);

    expect(side.players.map((p) => p.player.id)).toEqual([1, 3]);
    expect(side.score).toBe(72);
  });
});
