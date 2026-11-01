// src/frontend/features/matches/components/detail/match-events/match-flow/flowGeometry.spec.ts
import { describe, expect, it } from "vitest";

import { flowGeometry, nearestPoint, stepPicked } from "./flowGeometry";
import type { MarginPoint } from "./matchFlow";

// Baskets as [seconds, margin] pairs; the chart never reads their play.
const points = (...pairs: [number, number][]) =>
  pairs.map(([seconds, margin]) => ({ seconds, margin }) as MarginPoint);

const QUARTERS = [600, 1200, 1800, 2400].map((seconds, index) => ({
  period: index + 1,
  seconds,
}));

describe("flowGeometry", () => {
  it("spans at least ±5, so a small lead does not fill the chart", () => {
    const { y } = flowGeometry(points([300, 2]), QUARTERS);
    expect([y(5), y(0), y(-5)]).toEqual([0, 50, 100]);
  });

  it("spans one past the widest lead of either side", () => {
    const { y } = flowGeometry(points([300, 3], [900, -12]), QUARTERS);
    expect([y(13), y(-13)]).toEqual([0, 100]);
  });

  it("draws gridlines every 5 points, every 10 past a 16-point lead", () => {
    const ticksFor = (margin: number) =>
      flowGeometry(points([300, margin]), QUARTERS).ticks;
    expect(ticksFor(2)).toEqual([]);
    expect(ticksFor(9)).toEqual([5]);
    expect(ticksFor(15)).toEqual([5, 10, 15]);
    expect(ticksFor(16)).toEqual([10]);
  });

  it("runs the time axis to the last buzzer and clamps past it", () => {
    const { duration, x } = flowGeometry(points([300, 2]), QUARTERS);
    expect(duration).toBe(2400);
    expect([x(0), x(1200), x(2400), x(3000)]).toEqual([0, 50, 100, 100]);
  });

  it("gives each period its span on the axis", () => {
    const { periods } = flowGeometry(points([300, 2]), QUARTERS.slice(0, 2));
    expect(periods).toEqual([
      { period: 1, start: 0, end: 600 },
      { period: 2, start: 600, end: 1200 },
    ]);
  });

  it("steps the line at each basket and closes the area on zero", () => {
    const { line, area } = flowGeometry(
      points([300, 2], [450, -1]),
      QUARTERS.slice(0, 1),
    );
    expect(line).toBe("M0,50 H500 V30 H750 V60 H1000");
    expect(area).toBe(`${line} V50 H0 Z`);
  });
});

describe("nearestPoint", () => {
  const baskets = points([100, 2], [300, 0], [500, -3]);

  it("picks the basket closest in time", () => {
    expect(nearestPoint(baskets, 280)).toBe(1);
    expect(nearestPoint(baskets, 0)).toBe(0);
    expect(nearestPoint(baskets, 9999)).toBe(2);
  });

  it("keeps the earlier basket on a tie", () => {
    expect(nearestPoint(baskets, 200)).toBe(0);
  });
});

describe("stepPicked", () => {
  it("starts from the first basket going forward, the last going back", () => {
    expect(stepPicked("ArrowRight", null, 5)).toBe(0);
    expect(stepPicked("ArrowUp", null, 5)).toBe(0);
    expect(stepPicked("ArrowLeft", null, 5)).toBe(4);
    expect(stepPicked("ArrowDown", null, 5)).toBe(4);
  });

  it("steps one basket and stops at either end", () => {
    expect(stepPicked("ArrowRight", 2, 5)).toBe(3);
    expect(stepPicked("ArrowRight", 4, 5)).toBe(4);
    expect(stepPicked("ArrowLeft", 0, 5)).toBe(0);
  });

  it("jumps to either end", () => {
    expect(stepPicked("Home", 3, 5)).toBe(0);
    expect(stepPicked("End", null, 5)).toBe(4);
  });

  it("leaves other keys to the caller", () => {
    expect(stepPicked("Enter", 2, 5)).toBeNull();
    expect(stepPicked(" ", null, 5)).toBeNull();
  });
});
