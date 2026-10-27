// src/frontend/shared/components/blocks/stat-comparison/resolveValue.spec.ts
import { createFormatter } from "next-intl";
import { describe, expect, it } from "vitest";

import { createStatFormat } from "@/shared/utils";

import { getWinner, resolveValue } from "./resolveValue";

const format = createFormatter({ locale: "fr" });
const { perGame, percent } = createStatFormat(format);
const options = {
  formatNumber: (value: number) => format.number(value),
  formatPercent: percent,
  percentageMap: { fieldGoals: "fieldGoalPercentage" },
};

describe("resolveValue", () => {
  it("formats the display without changing the number compared", () => {
    const a = resolveValue({ pointsPerGame: 12.5 }, "pointsPerGame", {
      ...options,
      formatNumber: perGame,
    });
    const b = resolveValue({ pointsPerGame: 9 }, "pointsPerGame", {
      ...options,
      formatNumber: perGame,
    });

    expect(a).toEqual({ display: "12,5", numeric: 12.5 });
    expect(b).toEqual({ display: "9,0", numeric: 9 });
    expect(getWinner(a.numeric, b.numeric)).toBe("A");
  });

  it("pairs a made/attempted stat with its percentage and compares on it", () => {
    expect(
      resolveValue(
        { fieldGoals: "27/54", fieldGoalPercentage: 50 },
        "fieldGoals",
        options,
      ),
    ).toEqual({ display: "27/54 (50\u00a0%)", numeric: 50 });
  });

  it("drops the parenthetical when the percentage is null", () => {
    expect(
      resolveValue(
        { fieldGoals: "0/0", fieldGoalPercentage: null },
        "fieldGoals",
        options,
      ).display,
    ).toBe("0/0");
  });

  it("shows the missing label for an absent stat and never wins on it", () => {
    const missing = resolveValue({}, "pointsPerGame", {
      ...options,
      missingLabel: "N/D",
    });

    expect(missing.display).toBe("N/D");
    expect(getWinner(missing.numeric, 3)).toBe("tie");
  });
});
