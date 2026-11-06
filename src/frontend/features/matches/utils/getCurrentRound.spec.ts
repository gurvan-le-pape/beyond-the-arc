// src/frontend/features/matches/utils/getCurrentRound.spec.ts
import { describe, expect, it } from "vitest";

import type { Match } from "@/features/matches/types";

import { getCurrentRound } from "./getCurrentRound";

const match = (status: Match["status"]) => ({ status }) as Match;
const completed = match("completed");
const scheduled = match("scheduled");

describe("getCurrentRound", () => {
  it("is the latest round with a result", () => {
    expect(
      getCurrentRound({
        1: [completed, completed],
        2: [completed],
        3: [scheduled],
      }),
    ).toBe(2);
  });

  it("includes a round still in progress", () => {
    expect(getCurrentRound({ 1: [completed], 2: [completed, scheduled] })).toBe(
      2,
    );
  });

  it("orders rounds numerically, not as object keys", () => {
    expect(getCurrentRound({ 2: [completed], 10: [completed] })).toBe(10);
  });

  it("is the first round before any result", () => {
    expect(getCurrentRound({ 3: [scheduled], 1: [scheduled] })).toBe(1);
  });

  it("is null without rounds", () => {
    expect(getCurrentRound({})).toBeNull();
  });

  it("does not count a failed match as a result", () => {
    expect(getCurrentRound({ 1: [completed], 2: [match("failed")] })).toBe(1);
  });
});
