// src/frontend/styles/contrast.spec.ts
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * WCAG contrast of every foreground/background pairing the design system
 * promises, in all three themes, read straight from the custom properties in
 * `globals.css` and the generated `roles.css`.
 *
 * Works as a ratchet. `contrast.baseline.json` lists the pairings known to fail
 * today; the test fails when a pairing fails that is not listed (a regression),
 * and when a listed pairing now passes (so the list only ever shrinks). Rewrite
 * the list after an intended change with
 * `UPDATE_CONTRAST_BASELINE=1 npx vitest run styles/contrast.spec.ts`.
 */

const MIN_TEXT_CONTRAST = 4.5;
const CSS_PATHS = [
  path.join(__dirname, "globals.css"),
  path.join(__dirname, "roles.css"),
];
const TONES = Object.keys(
  JSON.parse(readFileSync(path.join(__dirname, "tones.json"), "utf8")),
);
const BASELINE_PATH = path.join(__dirname, "contrast.baseline.json");

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

const WHITE: Rgb = [255, 255, 255];
const SURFACES = ["surface-base", "surface-subtle", "surface-raised"];

/**
 * The pairings the system promises are readable, by the role each token
 * plays (see the naming convention at the top of globals.css):
 * - reading text on every surface: the text scale from `secondary` up, links
 *   (`primary`), every ramp's `-strong` end and the event label colours;
 * - filled buttons: white text on the fill and on its hover fill;
 * - chips: a ramp's `-strong` text on its own `-subtle` fill;
 * - the colour roles of every tone: `on-solid` on `solid` and its hover, and
 *   `ink` on every surface and on the tone's `tint` and its hover.
 * `text-muted` is left out on purpose: it is reserved for decorative marks and
 * is documented as below AA.
 */
function promisedPairs(palette: Palette): [fg: string, bg: string][] {
  const tokens = Object.keys(palette);
  const ramps = tokens
    .filter(
      (t) =>
        t.endsWith("-subtle") &&
        tokens.includes(t.replace(/-subtle$/, "-strong")),
    )
    .map((t) => t.replace(/-subtle$/, ""))
    .filter((ramp) => ramp !== "surface");
  const readingText = [
    "text-secondary",
    "text-body",
    "text-emphasis",
    "text-heading",
    "primary",
    ...ramps.map((ramp) => `${ramp}-strong`),
    ...tokens.filter((t) => t.startsWith("event-")),
  ];
  const buttonFills = [
    "primary",
    "secondary",
    "success",
    "error",
    "team-male",
    "team-female",
    "clubs",
  ].flatMap((fill) => [fill, `${fill}-strong`]);

  return [
    ...readingText.flatMap((fg) =>
      SURFACES.map((bg): [string, string] => [fg, bg]),
    ),
    ...buttonFills.map((bg): [string, string] => ["white", bg]),
    ...ramps.map((ramp): [string, string] => [
      `${ramp}-strong`,
      `${ramp}-subtle`,
    ]),
    ...TONES.flatMap((tone): [string, string][] => [
      [`on-solid-${tone}`, `solid-${tone}`],
      [`on-solid-${tone}`, `solid-${tone}-hover`],
      ...[...SURFACES, `tint-${tone}`, `tint-${tone}-hover`].map(
        (bg): [string, string] => [`ink-${tone}`, bg],
      ),
    ]),
  ];
}

function colourOf(palette: Palette, token: string): Rgb {
  if (token === "white") return WHITE;
  const value = palette[token];
  if (!value) throw new Error(`Unknown colour token --color-${token}`);
  return value;
}

/** Every promised pairing below the threshold, as "theme | fg on bg" → ratio. */
function failingPairs(): Record<string, number> {
  const failures: Record<string, number> = {};
  for (const [theme, palette] of Object.entries(readPalettes())) {
    for (const [fg, bg] of promisedPairs(palette)) {
      const ratio = contrastRatio(colourOf(palette, fg), colourOf(palette, bg));
      if (ratio < MIN_TEXT_CONTRAST) {
        failures[`${theme} | ${fg} on ${bg}`] = Math.round(ratio * 100) / 100;
      }
    }
  }
  return failures;
}

describe("design-token contrast", () => {
  const failures = failingPairs();

  if (process.env.UPDATE_CONTRAST_BASELINE) {
    const sorted = Object.fromEntries(
      Object.entries(failures).sort(([a], [b]) => a.localeCompare(b)),
    );
    writeFileSync(BASELINE_PATH, `${JSON.stringify(sorted, null, 2)}\n`);
  }

  const baseline: Record<string, number> = JSON.parse(
    readFileSync(BASELINE_PATH, "utf8"),
  );

  it("introduces no pairing below 4.5:1 that is not already known", () => {
    const regressions = Object.keys(failures).filter(
      (key) => !(key in baseline),
    );
    expect(regressions).toEqual([]);
  });

  it("lists no known failure that has since been fixed", () => {
    const fixed = Object.keys(baseline).filter((key) => !(key in failures));
    expect(fixed).toEqual([]);
  });
});
