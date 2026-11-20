// src/frontend/features/competitions/championships/utils/buildLevelBelowNavigation.spec.ts
import { describe, expect, it } from "vitest";

import { buildLevelBelowNavigation } from "./buildLevelBelowNavigation";
import { championship } from "./championshipFixtures";

function departmental(
  id: number,
  committeeId: number | null,
  departmentName: string | null,
  division: number,
) {
  return championship(id, {
    level: "departmental",
    committeeId,
    departmentName,
    division,
  });
}

describe("buildLevelBelowNavigation", () => {
  it("links each committee's top division", () => {
    const links = buildLevelBelowNavigation(
      [
        departmental(1, 22, "Côtes-d'Armor", 2),
        departmental(2, 22, "Côtes-d'Armor", 1),
        departmental(3, 22, "Côtes-d'Armor", 3),
      ],
      "fr",
    );

    expect(links).toEqual([
      { label: "Côtes-d'Armor", href: "/championships/2", isCurrent: false },
    ]);
  });

  it("orders departments by name in the given locale", () => {
    const links = buildLevelBelowNavigation(
      [
        departmental(1, 56, "Morbihan", 1),
        departmental(2, 29, "Finistère", 1),
        departmental(3, 35, "Ille-et-Vilaine", 1),
        departmental(4, 22, "Côtes-d'Armor", 1),
      ],
      "fr",
    );

    expect(links.map((link) => link.label)).toEqual([
      "Côtes-d'Armor",
      "Finistère",
      "Ille-et-Vilaine",
      "Morbihan",
    ]);
  });

  it("skips a championship with no committee or no department name", () => {
    const links = buildLevelBelowNavigation(
      [
        departmental(1, null, "Finistère", 1),
        departmental(2, 29, null, 1),
        departmental(3, 56, "Morbihan", 1),
      ],
      "fr",
    );

    expect(links.map((link) => link.href)).toEqual(["/championships/3"]);
  });

  it("is empty when the league has no departmental championship", () => {
    expect(buildLevelBelowNavigation([], "fr")).toEqual([]);
  });
});
