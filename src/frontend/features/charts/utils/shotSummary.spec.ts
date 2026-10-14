// src/frontend/features/charts/utils/shotSummary.spec.ts
import { describe, expect, it } from "vitest";

import type { ShotEvent } from "@/shared/types";

import { ShotFilter } from "../constants";
import { maxCellValue, summarizeShots } from "./shotSummary";

const shot = (made: boolean) => ({ made }) as ShotEvent;

describe("summarizeShots", () => {
  it("counts made and missed shots and rounds the percentage", () => {
    expect(summarizeShots([shot(true), shot(false), shot(false)])).toEqual({
      total: 3,
      made: 1,
      missed: 2,
      percent: 33,
    });
  });

  it("reports 0% with no shots", () => {
    expect(summarizeShots([]).percent).toBe(0);
  });
});

describe("maxCellValue", () => {
  const bins = [
    [
      { made: 2, missed: 0, total: 2 },
      { made: 0, missed: 5, total: 5 },
    ],
    [{ made: 3, missed: 3, total: 6 }],
  ];

  it("takes the highest count for the shots the filter shows", () => {
    expect(maxCellValue(bins, ShotFilter.ALL)).toBe(6);
    expect(maxCellValue(bins, ShotFilter.MADE)).toBe(3);
    expect(maxCellValue(bins, ShotFilter.MISSED)).toBe(5);
  });

  it("never goes below 1", () => {
    expect(maxCellValue([], ShotFilter.ALL)).toBe(1);
  });
});
