// src/frontend/shared/utils/helpers/date-helpers.spec.ts
import { describe, expect, it } from "vitest";

import {
  formatMatchDay,
  formatMatchDayMonth,
  formatMatchDayTime,
} from "./date-helpers";

// 17:00 UTC on Saturday 24 October 2026 is 19:00 in Paris, the day before the
// clocks go back — and 18:00 the day after, when they have.
const BEFORE_DST_END = "2026-10-24T17:00:00Z";
const AFTER_DST_END = "2026-10-26T17:00:00Z";

describe("formatMatchDayTime", () => {
  it("gives the day and the start time in the competition's zone", () => {
    const formatted = formatMatchDayTime(BEFORE_DST_END, "fr");
    expect(formatted).toContain("24");
    expect(formatted).toContain("19:00");
  });

  it("follows the zone's own offset across a clock change", () => {
    expect(formatMatchDayTime(AFTER_DST_END, "fr")).toContain("18:00");
  });
});

describe("formatMatchDayMonth", () => {
  it("gives the day of the month in the competition's zone", () => {
    // 23:30 UTC on the 24th is already the 25th in Paris.
    expect(formatMatchDayMonth("2026-10-24T23:30:00Z", "fr")).toContain("25");
  });
});

describe("formatMatchDay", () => {
  it("leaves the time out", () => {
    expect(formatMatchDay(BEFORE_DST_END, "fr")).not.toContain("19");
  });
});
