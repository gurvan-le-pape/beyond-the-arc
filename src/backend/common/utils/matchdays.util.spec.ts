// src/backend/common/utils/matchdays.util.spec.ts
import { countMatchdays } from "./matchdays.util";

describe("countMatchdays", () => {
  it.each([
    [2, 2],
    [3, 6],
    [4, 6],
    [12, 22],
    [13, 26],
  ])("plays %i teams over %i matchdays", (teamCount, matchdays) => {
    expect(countMatchdays(teamCount)).toBe(matchdays);
  });

  it("is 0 for a pool with fewer than two teams", () => {
    expect(countMatchdays(1)).toBe(0);
    expect(countMatchdays(0)).toBe(0);
  });
});
