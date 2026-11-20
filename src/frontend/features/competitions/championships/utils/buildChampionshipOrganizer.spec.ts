// src/frontend/features/competitions/championships/utils/buildChampionshipOrganizer.spec.ts
import { describe, expect, it } from "vitest";

import { buildChampionshipOrganizer } from "./buildChampionshipOrganizer";
import { championship } from "./championshipFixtures";

describe("buildChampionshipOrganizer", () => {
  it("names the committee, without the federation suffix", () => {
    const departmental = championship(1, {
      level: "departmental",
      committeeName: "COMITE DU FINISTERE DE BASKET-BALL",
    });

    expect(buildChampionshipOrganizer(departmental, "Departmental")).toBe(
      "COMITE DU FINISTERE",
    );
  });

  it("names the league, without its boilerplate", () => {
    const regional = championship(1, {
      leagueName: "LIGUE REGIONALE DE BRETAGNE DE BASKET-BALL",
    });

    expect(buildChampionshipOrganizer(regional, "Regional")).toBe(
      "LIGUE DE BRETAGNE",
    );
  });

  it("falls back to the level name when nobody organises it", () => {
    const national = championship(1, {
      level: "national",
      leagueName: null,
      committeeName: null,
    });

    expect(buildChampionshipOrganizer(national, "National")).toBe("National");
  });
});
