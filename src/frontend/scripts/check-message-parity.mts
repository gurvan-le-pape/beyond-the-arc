// src/frontend/scripts/check-message-parity.mts
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Fails the build when the locale message files drift apart.
 *
 * next-intl resolves keys at runtime, so a key present in one locale and
 * missing from another raises MISSING_MESSAGE in the browser and nowhere
 * else — there is no compile-time signal. Type-safe message keys (the
 * `AppConfig` augmentation) would not help either: those types are generated
 * from a single locale, so they cannot see cross-locale drift.
 *
 * Three parities are checked, per namespace file:
 *
 *   1. the namespace files themselves
 *   2. the flattened key sets
 *   3. the ICU placeholders inside each shared key — a translation that drops
 *      `{name}` renders without the interpolation and never reports anything
 *
 * Run with `npm run check:messages`. Node executes this file directly by
 * stripping the types — no build step, no dependencies. The `.mts` extension
 * marks it as an ES module, which the package cannot declare globally because
 * `next.config.js`, `postcss.config.js` and `tailwind.config.js` are CommonJS.
 */

const problems: string[] = [];

const MESSAGES_DIR = join(import.meta.dirname, "..", "messages");
const MIDDLEWARE_FILE = join(import.meta.dirname, "..", "middleware.ts");
const LOCALES_FILE = join(import.meta.dirname, "..", "locales.ts");

/**
 * Reads the locale set out of `locales.ts` as text rather than importing it.
 *
 * Importing works but makes Node reparse a type-less `.ts` module and warn on
 * every run (MODULE_TYPELESS_PACKAGE_JSON); `"type": "module"` is not available
 * as a fix because `next.config.js`, `postcss.config.js` and
 * `tailwind.config.js` are CommonJS. Parsing keeps this script dependency-free
 * and coupled to nothing, and a rename or a reshape of the declaration throws
 * here rather than silently checking an empty list.
 */
function declaredLocales(): { locales: string[]; defaultLocale: string } {
  const source = readFileSync(LOCALES_FILE, "utf8");

  const list = /export const LOCALES = \[([^\]]*)\]/.exec(source)?.[1];
  const fallback = /export const DEFAULT_LOCALE: Locale = "(\w+)"/.exec(
    source,
  )?.[1];

  if (!list || !fallback) {
    throw new Error(
      `Could not read LOCALES/DEFAULT_LOCALE out of ${LOCALES_FILE}. ` +
        `If the declaration moved or changed shape, update this parser — ` +
        `an unparsed list would silently check nothing.`,
    );
  }

  return {
    locales: [...list.matchAll(/"(\w+)"/g)].map(([, name]) => name),
    defaultLocale: fallback,
  };
}

const DECLARED = declaredLocales();

/** The locale every other locale is compared against. */
const REFERENCE_LOCALE = DECLARED.defaultLocale;

/** Matches the name in an ICU argument: `{name}`, `{count, plural, ...}`. */
const PLACEHOLDER = /\{\s*(\w+)/g;

type Leaves = Map<string, string>;

/**
 * Flattens a nested message object into dot-separated paths, so that
 * `{ a: { b: "x" } }` becomes `a.b -> "x"`.
 *
 * Nesting differences fall out of this naturally: if a path is a leaf in one
 * locale and an object in another, the two key sets simply disagree.
 */
function flatten(
  value: unknown,
  prefix = "",
  into: Leaves = new Map(),
): Leaves {
  if (typeof value !== "object" || value === null) {
    into.set(prefix, String(value));
    return into;
  }

  for (const [key, child] of Object.entries(value)) {
    flatten(child, prefix ? `${prefix}.${key}` : key, into);
  }

  return into;
}

function placeholdersOf(message: string): Set<string> {
  return new Set([...message.matchAll(PLACEHOLDER)].map(([, name]) => name));
}

function readNamespace(locale: string, file: string): Leaves {
  const raw = readFileSync(join(MESSAGES_DIR, locale, file), "utf8");
  return flatten(JSON.parse(raw));
}

function sorted(values: Iterable<string>): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function listJsonFiles(locale: string): string[] {
  return sorted(
    readdirSync(join(MESSAGES_DIR, locale)).filter((file) =>
      file.endsWith(".json"),
    ),
  );
}

function difference(a: Set<string>, b: Set<string>): string[] {
  return sorted(a).filter((value) => !b.has(value));
}

// The locale list comes from `locales.ts`, not from whatever happens to be on
// disk. Discovering directories instead made deletion invisible: remove
// `messages/fr` entirely and the loop below had nothing left to compare, so the
// script printed "OK" and exited 0 on a codebase with one locale's copy gone.
const locales = sorted(DECLARED.locales);
const present = new Set(
  readdirSync(MESSAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name),
);

for (const locale of locales.filter((name) => !present.has(name))) {
  problems.push(`no messages/${locale} directory for declared locale`);
}

for (const extra of sorted(present).filter((name) => !locales.includes(name))) {
  problems.push(`messages/${extra} is not a locale declared in locales.ts`);
}

if (!present.has(REFERENCE_LOCALE)) {
  throw new Error(`No "${REFERENCE_LOCALE}" directory in ${MESSAGES_DIR}`);
}

// The middleware matcher must be a literal — Next ignores computed values, so
// it cannot import the list. Check the literal instead, or a new locale routes
// nowhere while every other copy agrees it exists.
if (existsSync(MIDDLEWARE_FILE)) {
  const matcher = readFileSync(MIDDLEWARE_FILE, "utf8");
  const alternation = /"\/\(([a-z|]+)\)\/:path\*"/.exec(matcher)?.[1];

  if (!alternation) {
    problems.push(`middleware.ts: no locale matcher found to check`);
  } else {
    const matched = new Set(alternation.split("|"));

    for (const missing of locales.filter((name) => !matched.has(name))) {
      problems.push(`middleware.ts: matcher does not route "${missing}"`);
    }

    for (const extra of sorted(matched).filter((n) => !locales.includes(n))) {
      problems.push(`middleware.ts: matcher routes undeclared "${extra}"`);
    }
  }
}

const referenceFiles = listJsonFiles(REFERENCE_LOCALE);

for (const locale of locales.filter(
  (name) => name !== REFERENCE_LOCALE && present.has(name),
)) {
  const files = listJsonFiles(locale);

  for (const missing of difference(new Set(referenceFiles), new Set(files))) {
    problems.push(`${locale}: missing namespace file ${missing}`);
  }

  for (const extra of difference(new Set(files), new Set(referenceFiles))) {
    problems.push(`${locale}: unexpected namespace file ${extra}`);
  }

  for (const file of referenceFiles.filter((name) => files.includes(name))) {
    const reference = readNamespace(REFERENCE_LOCALE, file);
    const translated = readNamespace(locale, file);

    const referenceKeys = new Set(reference.keys());
    const translatedKeys = new Set(translated.keys());

    for (const key of difference(referenceKeys, translatedKeys)) {
      problems.push(`${locale}/${file}: missing key "${key}"`);
    }

    for (const key of difference(translatedKeys, referenceKeys)) {
      problems.push(
        `${locale}/${file}: key "${key}" not in ${REFERENCE_LOCALE}`,
      );
    }

    for (const key of sorted(referenceKeys).filter((name) =>
      translatedKeys.has(name),
    )) {
      const expected = placeholdersOf(reference.get(key)!);
      const actual = placeholdersOf(translated.get(key)!);

      const dropped = difference(expected, actual);
      const added = difference(actual, expected);

      if (dropped.length || added.length) {
        problems.push(
          `${locale}/${file}: key "${key}" placeholder mismatch` +
            (dropped.length ? ` — missing {${dropped.join("}, {")}}` : "") +
            (added.length ? ` — unexpected {${added.join("}, {")}}` : ""),
        );
      }
    }
  }
}

if (problems.length > 0) {
  console.error(
    `Message parity check failed — ${problems.length} problem(s):\n`,
  );
  for (const problem of problems) console.error(`  ${problem}`);
  console.error(
    `\nEvery locale declared in locales.ts must have a messages directory, be ` +
      `routed by the middleware matcher, and define exactly the same keys — ` +
      `with the same ICU placeholders — as "${REFERENCE_LOCALE}".`,
  );
  process.exit(1);
}

const keyCount = referenceFiles.reduce(
  (total, file) => total + readNamespace(REFERENCE_LOCALE, file).size,
  0,
);

console.log(
  `Message parity OK — ${locales.length} locales, ${referenceFiles.length} ` +
    `namespaces, ${keyCount} keys each.`,
);
