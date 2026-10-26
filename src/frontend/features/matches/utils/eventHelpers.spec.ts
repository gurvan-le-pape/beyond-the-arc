// src/frontend/features/matches/utils/eventHelpers.spec.ts
import { describe, expect, it } from "vitest";

import type { MatchEvent } from "@/features/matches/types";
import { EventType, Role } from "@/shared/constants";

import { getTeamIdFromEvent } from "./eventHelpers";

const HOME = 1;
const AWAY = 2;

// An event whose players are given as [role, teamId] pairs, in API order.
function event(eventType: string, players: [string, number][]): MatchEvent {
  return {
    eventType,
    players: players.map(([role, teamId], index) => ({
      role,
      player: { id: index + 1, team: { id: teamId } },
    })),
  } as unknown as MatchEvent;
}

describe("getTeamIdFromEvent", () => {
  it("gives a block to the blocker's team, not the blocked shooter's", () => {
    expect(
      getTeamIdFromEvent(
        event(EventType.BLOCKED_SHOT, [
          [Role.BLOCKED, HOME],
          [Role.BLOCKER, AWAY],
        ]),
      ),
    ).toBe(AWAY);
  });

  it("gives a substitution to the team making it", () => {
    expect(
      getTeamIdFromEvent(
        event(EventType.SUBSTITUTION, [
          [Role.EXITING_PLAYER, HOME],
          [Role.ENTERING_PLAYER, HOME],
        ]),
      ),
    ).toBe(HOME);
  });

  it("has no team for an event without players", () => {
    expect(getTeamIdFromEvent(event(EventType.QUARTER_END, []))).toBe(
      undefined,
    );
  });
});
