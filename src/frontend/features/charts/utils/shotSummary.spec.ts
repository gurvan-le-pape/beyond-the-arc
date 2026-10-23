// src/frontend/features/charts/utils/shotSummary.spec.ts
import { describe, expect, it } from "vitest";

import type { ShotEvent } from "@/shared/types";

import { summarizeShots } from "./shotSummary";

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
