// src/frontend/features/charts/utils/downloadPng.spec.ts
import { describe, expect, it } from "vitest";

import { shotChartFileName } from "./downloadPng";

describe("shotChartFileName", () => {
  it("keeps letters and digits, accents included", () => {
    expect(shotChartFileName("Adélaïde Adam")).toBe(
      "shotchart-Adélaïde_Adam.png",
    );
  });

  it("collapses any other run into one underscore", () => {
    expect(shotChartFileName("Jean-Luc  O'Neil / 2")).toBe(
      "shotchart-Jean_Luc_O_Neil_2.png",
    );
  });
});
