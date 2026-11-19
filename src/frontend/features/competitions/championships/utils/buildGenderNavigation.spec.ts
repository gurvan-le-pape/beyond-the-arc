// src/frontend/features/competitions/championships/utils/buildGenderNavigation.spec.ts
import { describe, expect, it } from "vitest";

import type { Gender } from "@/shared/constants";

import { buildGenderNavigation } from "./buildGenderNavigation";
import { championship } from "./championshipFixtures";

const label = (gender: Gender) => (gender === "male" ? "Men" : "Women");

describe("buildGenderNavigation", () => {
  it("links each gender's twin of this championship, men first", () => {
    const current = championship(2, { gender: "female" });
    const links = buildGenderNavigation(
      [current, championship(1, { gender: "male" })],
      current,
      label,
    );

    expect(links).toEqual([
      { label: "Men", href: "/championships/1", isCurrent: false },
      { label: "Women", href: "/championships/2", isCurrent: true },
    ]);
  });

  it("only counts a twin in the same category, level and division", () => {
    const current = championship(1);
    const links = buildGenderNavigation(
      [
        current,
        championship(2, { gender: "female", division: 2 }),
        championship(3, { gender: "female", category: "Seniors" }),
        championship(4, { gender: "female", level: "departmental" }),
      ],
      current,
      label,
    );

    expect(links.map((link) => link.label)).toEqual(["Men"]);
  });
});
