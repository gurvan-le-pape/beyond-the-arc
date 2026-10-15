// src/frontend/scripts/generate-palette.mts
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

/**
 * Writes `styles/palette.css`, the Radix Colors scales as `R G B` channel
 * triplets, and `styles/roles.css`, the colour roles solved from them. Run
 * with `npm run palette` after changing the scale list, `styles/tones.json`,
 * a surface colour in `globals.css`, or the `@radix-ui/colors` version.
 *
 * Radix ships its scales as hex. The roles in `globals.css` are channel
 * triplets so that Tailwind can apply an opacity (`bg-primary/40`), and a role
 * can only point at a primitive of the same form — hence this conversion
 * rather than importing Radix's own CSS.
 *
 * Each scale has twelve steps with a fixed use, the same in every scale and in
 * both themes: 1–2 backgrounds, 3–5 component fills (rest, hover, pressed),
 * 6–8 borders, 9–10 solid fills (rest, hover), 11 low-contrast text, 12
 * high-contrast text. The dark scales are not the light ones inverted: each
 * step keeps its use, which is what lets a role name one step for both themes.
 *
 * The high-contrast theme is a dark theme, so it takes the dark scales; its
 * own roles override what it needs on top.
 *
 * Node executes this file directly by stripping the types — no build step.
 */

const require = createRequire(import.meta.url);
const radix = require("@radix-ui/colors") as Record<
  string,
  Record<string, string>
>;

/**
 * The scales in use, and the hue each one stands for. Only scales a role
 * points at belong here: every scale is 24 custom properties on every page.
 */
const SCALES = [
  "slate", // neutrals: surfaces, borders, text
  "indigo", // brand
  "grass", // brand secondary
  "green", // success, made shot
  "red", // error
  "crimson", // missed shot
  "amber", // warning, matches
  "cyan", // info
  "sky", // men's teams, division
  "pink", // women's teams
  "iris", // national level
  "teal", // regional level
  "yellow", // departmental level, foul
  "violet", // clubs
  "orange", // pool, turnover
  "jade", // players
  "purple", // teams
  "plum", // rebound
  "blue", // substitution, home side
] as const;

function channels(hex: string): string {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255].join(" ");
}

function block(selector: string, suffix: "" | "Dark"): string {
  const lines = SCALES.flatMap((scale) => {
    const steps = radix[`${scale}${suffix}`];
    if (!steps) throw new Error(`@radix-ui/colors has no "${scale}${suffix}"`);
    return Array.from({ length: 12 }, (_, i) => {
      const step = i + 1;
      const hex = steps[scale + step];
      return `  --${scale}-${step}: ${channels(hex)};`;
    });
  });
  return `${selector} {\n${lines.join("\n")}\n}\n`;
}

// ─── Roles ───────────────────────────────────────────────────────────────────

/**
 * Each tone in `styles/tones.json` (primary, error, clubs, home…) names the
 * scale it is drawn from — or, as `{ "default": …, "high-contrast": … }`, a
 * different scale for that one theme — and gets one value per role in each
 * theme:
 *
 * - `solid` / `solid-hover`: a filled control's background, at rest and on
 *   hover, with `on-solid` the text on both;
 * - `tint` / `tint-hover`: a low-emphasis fill (chip, selected option);
 * - `ink`: text in the tone, readable on every surface and on its own tint;
 * - `line`: a border in the tone.
 *
 * Radix's scales are tuned for APCA, not for WCAG 2's 4.5:1, so a fixed step
 * per role does not hold that ratio: white on step 9 is 3.3:1 in blue and
 * 1.6:1 in amber. The steps are therefore solved per tone and theme, from a
 * fixed rule, rather than picked. `solid` is the first step from 9 up that
 * carries white text at 4.5:1 with a hover step either side that does too,
 * else the same search with dark ink. `ink` is the lightest mix of steps 11
 * and 12 (in OKLab, by 5% increments) that clears 4.5:1 on the three
 * surfaces and on the tint: step 12 alone is near-black, and would drop the
 * hue the text is meant to carry. `styles/contrast.spec.ts` checks the result
 * independently.
 *
 * The high-contrast theme runs the same rule at 7:1, WCAG's AAA level, which
 * is the promise that theme exists to keep.
 */

type Rgb = readonly [number, number, number];
const HIGH_CONTRAST = "high-contrast";
type Theme = "light" | "dark" | typeof HIGH_CONTRAST;

const MIN_CONTRAST: Record<Theme, number> = {
  light: 4.5,
  dark: 4.5,
  [HIGH_CONTRAST]: 7,
};
const WHITE: Rgb = [255, 255, 255];
const THEME_SELECTOR: Record<Theme, string> = {
  light: ":root",
  dark: ".dark",
  [HIGH_CONTRAST]: ".high-contrast",
};

type Scale = (typeof SCALES)[number];

const tones = JSON.parse(
  readFileSync(join(import.meta.dirname, "..", "styles", "tones.json"), "utf8"),
) as Record<string, Scale | { default: Scale; [HIGH_CONTRAST]?: Scale }>;

function scaleOf(tone: string, theme: Theme): Scale {
  const entry = tones[tone];
  if (typeof entry === "string") return entry;
  return (theme === HIGH_CONTRAST && entry[HIGH_CONTRAST]) || entry.default;
}

function rgb(hex: string): Rgb {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function luminance([r, g, b]: Rgb): number {
  const linear = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function step(scale: string, theme: Theme, n: number): Rgb {
  const steps = radix[theme === "light" ? scale : `${scale}Dark`];
  return rgb(steps[scale + n]);
}

/**
 * The three surfaces of a theme, read from `globals.css`.
 *
 * @param theme - the theme whose surfaces to read
 * @returns base, subtle and raised, in that order
 */
function surfaces(theme: Theme): Rgb[] {
  const css = readFileSync(
    join(import.meta.dirname, "..", "styles", "globals.css"),
    "utf8",
  );
  const read = (selector: string, name: string): Rgb | undefined => {
    const start = css.indexOf(`${selector} {`);
    const body = css.slice(start, css.indexOf("\n}", start));
    const match = new RegExp(
      String.raw`--color-${name}:\s*(\d+) (\d+) (\d+);`,
    ).exec(body);
    return match
      ? [Number(match[1]), Number(match[2]), Number(match[3])]
      : undefined;
  };
  return ["surface-base", "surface-subtle", "surface-raised"].map((name) => {
    const value = read(THEME_SELECTOR[theme], name) ?? read(":root", name);
    if (!value) throw new Error(`globals.css has no --color-${name}`);
    return value;
  });
}

function toOklab([r, g, b]: Rgb): Rgb {
  const linear = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [lr, lg, lb] = [linear(r), linear(g), linear(b)];
  const l = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
  );
  const m = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
  );
  const s = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
  );
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([L, a, b]: Rgb): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const encode = (v: number) => {
    const c = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, c)) * 255);
  };
  return [
    encode(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    encode(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    encode(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  const [x, y] = [toOklab(a), toOklab(b)];
  return fromOklab(
    [0, 1, 2].map((i) => x[i] + (y[i] - x[i]) * t) as unknown as Rgb,
  );
}

function inkColour(scale: string, theme: Theme, percent: number): Rgb {
  return mix(step(scale, theme, 11), step(scale, theme, 12), percent / 100);
}

interface Solved {
  solid: number;
  hover: number;
  onSolid: "white" | "ink";
  /** Share of step 12 in the 11→12 mix, in percent. */
  inkMix: number;
}

function solve(scale: string, theme: Theme): Solved {
  const darkInk = step("slate", "light", 12);
  const readableOn = (fg: Rgb, n: number) =>
    n >= 1 &&
    n <= 12 &&
    contrast(fg, step(scale, theme, n)) >= MIN_CONTRAST[theme];

  let fill: Pick<Solved, "solid" | "hover" | "onSolid"> | undefined;
  for (const onSolid of ["white", "ink"] as const) {
    const fg = onSolid === "white" ? WHITE : darkInk;
    for (let n = 9; n <= 12 && !fill; n++) {
      const hover = [n + 1, n - 1].find((h) => readableOn(fg, h));
      if (readableOn(fg, n) && hover) fill = { solid: n, hover, onSolid };
    }
    if (fill) break;
  }
  if (!fill) throw new Error(`No solid step for ${scale} in ${theme}`);

  const backgrounds = [
    ...surfaces(theme),
    step(scale, theme, 3),
    step(scale, theme, 4),
  ];
  const inkMix = Array.from({ length: 21 }, (_, i) => i * 5).find((percent) =>
    backgrounds.every(
      (bg) =>
        contrast(inkColour(scale, theme, percent), bg) >= MIN_CONTRAST[theme],
    ),
  );
  if (inkMix === undefined) throw new Error(`No ink for ${scale} in ${theme}`);

  return { ...fill, inkMix };
}

function rolesBlock(theme: Theme): string {
  const lines = Object.keys(tones).flatMap((tone) => {
    const scale = scaleOf(tone, theme);
    const s = solve(scale, theme);
    const value = (n: number) =>
      `${step(scale, theme, n).join(" ")}; /* ${scale}-${n} */`;
    const onSolid =
      s.onSolid === "white"
        ? "255 255 255; /* white */"
        : `${step("slate", "light", 12).join(" ")}; /* light slate-12 */`;
    return [
      `  --color-solid-${tone}: ${value(s.solid)}`,
      `  --color-solid-${tone}-hover: ${value(s.hover)}`,
      `  --color-on-solid-${tone}: ${onSolid}`,
      `  --color-tint-${tone}: ${value(3)}`,
      `  --color-tint-${tone}-hover: ${value(4)}`,
      `  --color-ink-${tone}: ${inkColour(scale, theme, s.inkMix).join(" ")}; /* ${scale}-11→12 at ${s.inkMix}% */`,
      `  --color-line-${tone}: ${value(7)}`,
    ];
  });
  return `${THEME_SELECTOR[theme]} {\n${lines.join("\n")}\n}\n`;
}

const { version } = require("@radix-ui/colors/package.json") as {
  version: string;
};

const banner = [
  `/* Generated by scripts/generate-palette.mts from @radix-ui/colors ${version}.`,
  "   Do not edit: change the script and run `npm run palette`. */",
  "",
];

const css = [
  ...banner,
  block(":root", ""),
  block(".dark,\n.high-contrast", "Dark"),
].join("\n");

const roles = [
  ...banner,
  rolesBlock("light"),
  rolesBlock("dark"),
  rolesBlock(HIGH_CONTRAST),
].join("\n");

const stylesDir = join(import.meta.dirname, "..", "styles");
writeFileSync(join(stylesDir, "palette.css"), css);
writeFileSync(join(stylesDir, "roles.css"), roles);
console.log(
  `Wrote ${SCALES.length} scales and ${Object.keys(tones).length} tones to ${stylesDir}`,
);
