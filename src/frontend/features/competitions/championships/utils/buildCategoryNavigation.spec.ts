// src/frontend/features/competitions/championships/utils/buildCategoryNavigation.spec.ts
import { describe, expect, it } from "vitest";

import { buildCategoryNavigation } from "./buildCategoryNavigation";
import { championship } from "./championshipFixtures";

describe("buildCategoryNavigation", () => {
  it("lists each category once, by age, marking the current one", () => {
    const current = championship(1, { category: "U18" });
    const links = buildCategoryNavigation(
      [
        championship(2, { category: "Seniors" }),
        current,
        championship(3, { category: "U11" }),
        championship(4, { category: "U13" }),
      ],
      current,
    );

    expect(links).toEqual([
      { label: "U11", href: "/championships/3", isCurrent: false },
      { label: "U13", href: "/championships/4", isCurrent: false },
      { label: "U18", href: "/championships/1", isCurrent: true },
      { label: "Seniors", href: "/championships/2", isCurrent: false },
    ]);
  });

  it("keeps the current division when the other category has it", () => {
    const current = championship(1, { category: "Seniors", division: 2 });
    const links = buildCategoryNavigation(
      [
        current,
        championship(10, { category: "U18", division: 1 }),
        championship(11, { category: "U18", division: 2 }),
        championship(12, { category: "U18", division: 3 }),
      ],
      current,
    );

    expect(links.find((link) => link.label === "U18")?.href).toBe(
      "/championships/11",
    );
  });

  it("falls back to the category's top division when it lacks the current one", () => {
    const current = championship(1, { category: "Seniors", division: 4 });
    const links = buildCategoryNavigation(
      [
        current,
        championship(12, { category: "U18", division: 3 }),
        championship(10, { category: "U18", division: 1 }),
        championship(11, { category: "U18", division: 2 }),
      ],
      current,
    );

    expect(links.find((link) => link.label === "U18")?.href).toBe(
      "/championships/10",
    );
  });

  it("ignores the other gender", () => {
    const current = championship(1, { category: "U18", gender: "female" });
    const links = buildCategoryNavigation(
      [current, championship(2, { category: "U13", gender: "male" })],
      current,
    );

    expect(links.map((link) => link.label)).toEqual(["U18"]);
  });

  it("leaves the caller's list in its order", () => {
    const current = championship(1, { category: "U18" });
    const siblings = [championship(2, { category: "Seniors" }), current];

    buildCategoryNavigation(siblings, current);

    expect(siblings.map((sibling) => sibling.id)).toEqual([2, 1]);
  });
});
