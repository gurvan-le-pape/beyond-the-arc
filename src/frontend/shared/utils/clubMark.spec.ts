// src/frontend/shared/utils/clubMark.spec.ts
import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { clubHue, clubInitials } from "./clubMark";

describe("clubInitials", () => {
  it("takes the initials of the first two distinctive words", () => {
    expect(clubInitials("GARONNE AVENIR BASKET DU MARMANDAIS")).toBe("GA");
    expect(clubInitials("ENTENTE DU PAYS DES SORGUES U18M")).toBe("PS");
    expect(clubInitials("ROUILLON E.G")).toBe("RE");
  });

  it("uses the first two letters of a single distinctive word", () => {
    expect(clubInitials("BASKET CLUB BARCELONNETTE")).toBe("BA");
  });

  it("ignores accents and falls back to the generic words alone", () => {
    expect(clubInitials("Étoile Sportive")).toBe("ET");
    expect(clubInitials("BASKET CLUB")).toBe("BC");
    expect(clubInitials("")).toBe("?");
  });
});

describe("clubHue", () => {
  it("is stable for a name and spread across names", () => {
    expect(clubHue("ROUILLON E.G")).toBe(clubHue("ROUILLON E.G"));
    const hues = new Set(
      ["A", "B", "C", "GARONNE", "ROUILLON", "LE MANS"].map(clubHue),
    );
    expect(hues.size).toBeGreaterThan(4);
  });
});

type Rgb = [number, number, number];

function hslToRgb(h: number, s: number, l: number): Rgb {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    const value = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(value * 255);
  };
  return [channel(0), channel(8), channel(4)];
}

function luminance([r, g, b]: Rgb): number {
  const c = (v: number) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
}

function ratio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The saturation/lightness pair of one property in one `.club-mark` rule. */
function readHsl(css: string, selector: string, property: string) {
  const rule = css.slice(css.indexOf(`${selector} {`));
  const match = new RegExp(
    // Anchored on the line start: "color" is also the end of "background-color".
    `\\n\\s*${property}: hsl\\(var\\(--club-hue\\) (\\d+)% (\\d+)%\\)`,
  ).exec(rule.slice(0, rule.indexOf("}")));
  if (!match) throw new Error(`No ${property} for ${selector}`);
  return { s: Number(match[1]), l: Number(match[2]) };
}

describe("club mark contrast", () => {
  const css = readFileSync(
    path.join(__dirname, "../../styles/globals.css"),
    "utf8",
  );

  for (const selector of [".club-mark", ".dark .club-mark"]) {
    it(`clears 4.5:1 for every hue (${selector})`, () => {
      const fill = readHsl(css, selector, "background-color");
      const text = readHsl(css, selector, "color");
      const worst = Math.min(
        ...Array.from({ length: 360 }, (_, hue) =>
          ratio(hslToRgb(hue, fill.s, fill.l), hslToRgb(hue, text.s, text.l)),
        ),
      );
      expect(worst).toBeGreaterThanOrEqual(4.5);
    });
  }
});
