// src/frontend/features/competitions/championships/utils/buildDivisionNavigation.spec.ts
import { describe, expect, it } from "vitest";

import { buildDivisionNavigation } from "./buildDivisionNavigation";
import { championship } from "./championshipFixtures";

const label = (division: number) => `D${division}`;

describe("buildDivisionNavigation", () => {
  it("lists the divisions in ascending order, marking the current one", () => {
    const current = championship(2, { division: 2 });
    const links = buildDivisionNavigation(
      [
        championship(3, { division: 3 }),
        current,
        championship(1, { division: 1 }),
      ],
      current,
      label,
    );

    expect(links).toEqual([
      { label: "D1", href: "/championships/1", isCurrent: false },
      { label: "D2", href: "/championships/2", isCurrent: true },
      { label: "D3", href: "/championships/3", isCurrent: false },
    ]);
  });

  it("keeps to the same category, gender and level", () => {
    const current = championship(1);
    const links = buildDivisionNavigation(
      [
        current,
        championship(2, { division: 2, category: "Seniors" }),
        championship(3, { division: 2, gender: "female" }),
        championship(4, { division: 2, level: "departmental" }),
      ],
      current,
      label,
    );

    expect(links.map((link) => link.href)).toEqual(["/championships/1"]);
  });

  it("sorts divisions numerically, not as text", () => {
    const current = championship(1, { division: 1 });
    const links = buildDivisionNavigation(
      [
        current,
        championship(10, { division: 10 }),
        championship(2, { division: 2 }),
      ],
      current,
      label,
    );

    expect(links.map((link) => link.label)).toEqual(["D1", "D2", "D10"]);
  });
});
