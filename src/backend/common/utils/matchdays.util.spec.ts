// src/backend/common/utils/matchdays.util.spec.ts
import { countMatchdays } from "./matchdays.util";

describe("countMatchdays", () => {
  it("counts a matchday once when several teams play at home on it", () => {
    expect(
      countMatchdays([
        { homeMatches: [{ matchday: 1 }, { matchday: 3 }] },
        { homeMatches: [{ matchday: 1 }, { matchday: 2 }] },
      ]),
    ).toBe(3);
  });

  it("is 0 for a pool with no schedule", () => {
    expect(countMatchdays([{ homeMatches: [] }])).toBe(0);
    expect(countMatchdays([])).toBe(0);
  });
});
