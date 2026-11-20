// src/frontend/shared/utils/grouping.spec.ts
import { describe, expect, it } from "vitest";

import { groupBy } from "./grouping";

describe("groupBy", () => {
  it("buckets items by key, keeping input order inside each bucket", () => {
    const matches = [
      { id: 1, round: 2 },
      { id: 2, round: 1 },
      { id: 3, round: 2 },
    ];

    expect(groupBy(matches, (match) => match.round)).toEqual({
      1: [{ id: 2, round: 1 }],
      2: [
        { id: 1, round: 2 },
        { id: 3, round: 2 },
      ],
    });
  });

  it("turns a numeric key into a string, as its docs warn", () => {
    const groups = groupBy([{ round: 3 }], (match) => match.round);

    expect(Object.keys(groups)).toEqual(["3"]);
  });

  it("is empty for no items, including untyped null data", () => {
    expect(groupBy([], () => "x")).toEqual({});
    expect(groupBy(null as unknown as [], () => "x")).toEqual({});
  });
});
