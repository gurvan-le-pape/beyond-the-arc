// src/frontend/features/matches/utils/eventDescription.spec.ts
import { describe, expect, it } from "vitest";

import type { MatchEvent } from "@/features/matches/types";

import { describeEvent } from "./eventDescription";

function event(
  eventType: string,
  roles: Record<string, string>,
): Pick<MatchEvent, "eventType" | "players"> {
  return {
    eventType: eventType as MatchEvent["eventType"],
    players: Object.entries(roles).map(([role, name], index) => ({
      role,
      player: {
        id: index + 1,
        name,
        number: index,
        team: { id: 1, club: { name: "C" } },
      },
    })) as unknown as MatchEvent["players"],
  };
}

describe("describeEvent", () => {
  it("credits an assisted basket to both players", () => {
    expect(
      describeEvent(event("made_layup", { shooter: "Ana", assister: "Bo" })),
    ).toEqual({
      key: "shotMadeAssisted",
      values: { shooter: "Ana", assister: "Bo" },
    });
  });

  it("describes an unassisted basket by its shooter alone", () => {
    expect(describeEvent(event("made_dunk", { shooter: "Ana" }))).toEqual({
      key: "shotMade",
      values: { shooter: "Ana" },
    });
  });

  it("reads the simulator's role names: a block's victim is `blocked`", () => {
    expect(
      describeEvent(event("blocked_shot", { blocker: "Cy", blocked: "Ana" })),
    ).toEqual({ key: "block", values: { blocker: "Cy", blocked: "Ana" } });
  });

  it("groups the foul types that share a sentence", () => {
    for (const type of ["charging_foul", "reaching_foul", "illegal_screen"]) {
      expect(
        describeEvent(event(type, { fouler: "Di", victim: "Ana" }))?.key,
      ).toBe("foul");
    }
    expect(
      describeEvent(
        event("3_point_shooting_foul", { fouler: "Di", shooter: "Ana" }),
      )?.key,
    ).toBe("shootingFoul");
  });

  it("names a substitution's two players", () => {
    expect(
      describeEvent(
        event("substitution", { entering_player: "Ed", exiting_player: "Ana" }),
      ),
    ).toEqual({
      key: "substitution",
      values: { entering: "Ed", exiting: "Ana" },
    });
  });

  it("describes player-less events without names", () => {
    expect(describeEvent(event("quarter_end", {}))).toEqual({
      key: "quarterEnd",
      values: {},
    });
  });

  it("returns null when a player the sentence needs is missing", () => {
    expect(describeEvent(event("steal", { stealer: "Fa" }))).toBeNull();
  });

  it("returns null for a type it does not know", () => {
    expect(describeEvent(event("alley_oop", { shooter: "Ana" }))).toBeNull();
  });
});
