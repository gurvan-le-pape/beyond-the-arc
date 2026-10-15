// src/frontend/styles/contrast.spec.ts
import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * WCAG contrast of every foreground/background pairing the design system
 * promises, in all three themes, read straight from the custom properties in
 * `globals.css` and the generated `roles.css`. Every pairing must clear its
 * floor: there is no list of known failures to fall back on.
 */

const MIN_TEXT_CONTRAST = 4.5;
/** WCAG's floor for graphics that carry meaning (a made or missed shot). */
const MIN_GRAPHIC_CONTRAST = 3;
/** What the colour roles promise in the high-contrast theme: WCAG AAA. */
const MIN_HIGH_CONTRAST_ROLE = 7;
const CSS_PATHS = [
  path.join(__dirname, "globals.css"),
  path.join(__dirname, "roles.css"),
];
const TONES = Object.keys(
  JSON.parse(readFileSync(path.join(__dirname, "tones.json"), "utf8")),
);

type Rgb = readonly [number, number, number];
type Palette = Record<string, Rgb>;

const THEME_SELECTORS = {
  light: ":root",
  dark: ".dark",
  "high-contrast": ".high-contrast",
} as const;

function readThemeBlock(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`No ${selector} block`);
  return css.slice(start, css.indexOf("\n}", start));
}

function parsePalette(block: string): Palette {
  const palette: Palette = {};
  for (const [, name, r, g, b] of block.matchAll(
    /--color-([\w-]+):\s*(\d+) (\d+) (\d+);/g,
  )) {
    palette[name] = [Number(r), Number(g), Number(b)];
  }
  return palette;
}

/** Each theme's palette; a theme inherits every value it does not redefine. */
function readPalettes(): Record<keyof typeof THEME_SELECTORS, Palette> {
  const sheets = CSS_PATHS.map((file) => readFileSync(file, "utf8"));
  const read = (selector: string): Palette =>
    Object.assign(
      {},
      ...sheets.map((css) => parsePalette(readThemeBlock(css, selector))),
    );
  const light = read(THEME_SELECTORS.light);
  const palettes = {} as Record<keyof typeof THEME_SELECTORS, Palette>;
  for (const [theme, selector] of Object.entries(THEME_SELECTORS)) {
    palettes[theme as keyof typeof THEME_SELECTORS] =
      theme === "light" ? light : { ...light, ...read(selector) };
  }
  return palettes;
}

function relativeLuminance([r, g, b]: Rgb): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: Rgb, b: Rgb): number {
  const [light, dark] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x,
  );
  return (light + 0.05) / (dark + 0.05);
}

const SURFACES = ["surface-base", "surface-subtle", "surface-raised"];

/**
 * The pairings the system promises are readable:
 * - reading text on every surface: the text scale from `secondary` up and the
 *   match-event label colours;
 * - the colour roles of every tone: `on-solid` on `solid` and its hover, and
 *   `ink` on every surface and on the tone's `tint` and its hover;
 * - the shot-chart court: its lines and zone figures on its floor, and the
 *   made and missed shot marks on it at the 3:1 graphics floor.
 * `text-muted` is left out on purpose: it is reserved for decorative marks and
 * is documented as below AA.
 */
type Pair = [fg: string, bg: string, min?: number];

function promisedPairs(palette: Palette): Pair[] {
  const readingText = [
    "text-secondary",
    "text-body",
    "text-emphasis",
    "text-heading",
    ...Object.keys(palette).filter((t) => t.startsWith("event-")),
  ];

  return [
    ...readingText.flatMap((fg) => SURFACES.map((bg): Pair => [fg, bg])),
    ["court-line", "court-floor"],
    ["court-label", "court-floor"],
    ["event-made", "court-floor", MIN_GRAPHIC_CONTRAST],
    ["event-miss", "court-floor", MIN_GRAPHIC_CONTRAST],
    ...TONES.flatMap((tone): Pair[] => [
      [`on-solid-${tone}`, `solid-${tone}`],
      [`on-solid-${tone}`, `solid-${tone}-hover`],
      ...[...SURFACES, `tint-${tone}`, `tint-${tone}-hover`].map(
        (bg): Pair => [`ink-${tone}`, bg],
      ),
    ]),
  ];
}

function colourOf(palette: Palette, token: string): Rgb {
  const value = palette[token];
  if (!value) throw new Error(`Unknown colour token --color-${token}`);
  return value;
}

/** Every promised pairing below the threshold, as "theme | fg on bg" → ratio. */
function failingPairs(): Record<string, number> {
  const failures: Record<string, number> = {};
  for (const [theme, palette] of Object.entries(readPalettes())) {
    for (const [fg, bg, pairMin] of promisedPairs(palette)) {
      const ratio = contrastRatio(colourOf(palette, fg), colourOf(palette, bg));
      const isRole = fg.startsWith("on-solid-") || fg.startsWith("ink-");
      const min =
        pairMin ??
        (theme === "high-contrast" && isRole
          ? MIN_HIGH_CONTRAST_ROLE
          : MIN_TEXT_CONTRAST);
      if (ratio < min) {
        failures[`${theme} | ${fg} on ${bg}`] = Math.round(ratio * 100) / 100;
      }
    }
  }
  return failures;
}

describe("design-token contrast", () => {
  it("clears every promised pairing in every theme", () => {
    expect(failingPairs()).toEqual({});
  });
});
