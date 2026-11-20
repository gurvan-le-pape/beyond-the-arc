// src/frontend/features/competitions/championships/utils/findLevelAbove.spec.ts
import { describe, expect, it } from "vitest";

import { championship } from "./championshipFixtures";
import { findLevelAbove } from "./findLevelAbove";

describe("findLevelAbove", () => {
  it("picks the regional division a departmental champion moves up into: the last one", () => {
    const above = findLevelAbove([
      championship(1, { division: 1 }),
      championship(3, { division: 3 }),
      championship(2, { division: 2 }),
    ]);

    expect(above?.id).toBe(3);
  });

  it("is undefined when the league has no regional championship", () => {
    expect(findLevelAbove([])).toBeUndefined();
  });
});
