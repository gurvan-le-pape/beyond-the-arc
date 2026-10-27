// src/frontend/shared/utils/statFormat.spec.ts
import { createFormatter } from "next-intl";
import { describe, expect, it } from "vitest";

import { createStatFormat } from "./statFormat";

// French separates a number from "%" with a no-break space.
const NBSP = "\u00a0";

const en = createStatFormat(createFormatter({ locale: "en" }));
const fr = createStatFormat(createFormatter({ locale: "fr" }));

describe("createStatFormat", () => {
  it("always shows one decimal for a per-game average", () => {
    expect(en.perGame(12)).toBe("12.0");
    expect(en.perGame(12.5)).toBe("12.5");
    expect(fr.perGame(12)).toBe("12,0");
    expect(fr.perGame(12.5)).toBe("12,5");
  });

  it("reads a percentage out of 100 and lets the locale place the sign", () => {
    expect(en.percent(45)).toBe("45%");
    expect(en.percent(46.7)).toBe("46.7%");
    expect(fr.percent(45)).toBe(`45${NBSP}%`);
    expect(fr.percent(46.7)).toBe(`46,7${NBSP}%`);
  });

  it("keeps the edges of the range", () => {
    expect(en.percent(0)).toBe("0%");
    expect(en.percent(100)).toBe("100%");
  });
});
