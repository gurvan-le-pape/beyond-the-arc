// src/frontend/features/competitions/championships/utils/buildChampionshipTitle.spec.ts
import { describe, expect, it } from "vitest";

import { buildChampionshipHeading } from "./buildChampionshipHeading";
import { buildChampionshipTitle } from "./buildChampionshipTitle";
import { championship } from "./championshipFixtures";

const labels = { gender: "Masculin", division: "Division 1" };

describe("buildChampionshipHeading", () => {
  it("joins category, gender and division", () => {
    expect(buildChampionshipHeading(championship(1), labels)).toBe(
      "U18 · Masculin · Division 1",
    );
  });
});

describe("buildChampionshipTitle", () => {
  it("names a regional championship by its region, with the season", () => {
    expect(buildChampionshipTitle(championship(1), labels)).toBe(
      "Bretagne · U18 · Masculin · Division 1 · 2026-2027",
    );
  });

  it("names a departmental championship by its department", () => {
    const departmental = championship(1, {
      level: "departmental",
      departmentName: "Finistère",
    });

    expect(buildChampionshipTitle(departmental, labels)).toBe(
      "Finistère · U18 · Masculin · Division 1 · 2026-2027",
    );
  });

  it("drops a missing place instead of leaving an empty segment", () => {
    const national = championship(1, { level: "national", regionName: null });

    expect(buildChampionshipTitle(national, labels)).toBe(
      "U18 · Masculin · Division 1 · 2026-2027",
    );
  });
});
