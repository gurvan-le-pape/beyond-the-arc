// src/frontend/shared/utils/matchWinner.spec.ts
import { describe, expect, it } from "vitest";

import { matchWinner } from "./matchWinner";

describe("matchWinner", () => {
  it("names the side with the higher score", () => {
    expect(matchWinner(82, 75)).toBe("home");
    expect(matchWinner(60, 71)).toBe("away");
  });

  it("names no winner for a level score", () => {
    expect(matchWinner(70, 70)).toBeNull();
  });

  it("names no winner before the match is played", () => {
    expect(matchWinner(null, null)).toBeNull();
    expect(matchWinner(80, null)).toBeNull();
  });
});
