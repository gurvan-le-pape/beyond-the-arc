// src/frontend/features/matches/components/list/matches-by-round/roundWindow.spec.ts
import { describe, expect, it } from "vitest";

import { visibleRoundCount, windowStartShowing } from "./roundWindow";

describe("visibleRoundCount", () => {
  it("fits as many pills as the width allows, from 1 to 8", () => {
    expect(visibleRoundCount(400)).toBe(5);
    expect(visibleRoundCount(100)).toBe(1);
    expect(visibleRoundCount(2000)).toBe(8);
  });
});

describe("windowStartShowing", () => {
  it("keeps the window when the round is already in it", () => {
    expect(windowStartShowing(2, 4, 5)).toBe(2);
  });

  it("moves just far enough to bring the round in", () => {
    expect(windowStartShowing(5, 3, 5)).toBe(3);
    expect(windowStartShowing(0, 9, 5)).toBe(5);
  });
});
