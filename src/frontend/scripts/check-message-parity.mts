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
 *
 * @returns the declared locale list and the default, parsed out of the file's text
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

type Leaves = Map<string, string>;

/**
 * Flattens a nested message object into dot-separated paths, so that
 * `{ a: { b: "x" } }` becomes `a.b -> "x"`.
 *
 * Nesting differences fall out of this naturally: if a path is a leaf in one
 * locale and an object in another, the two key sets simply disagree.
 *
 * @param value - the node to flatten; a non-object is treated as a leaf
 * @param prefix - the dotted path accumulated so far
 * @param into - the set leaves are collected into, mutated in place
 * @returns the same map, so a leaf and an object at one path simply disagree between locales
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

/** ICU argument types whose style is a set of submessages, not a format. */
const SUBMESSAGE_TYPES = new Set(["plural", "select", "selectordinal"]);

/**
 * The ICU argument names in a message.
 *
 * This walks the string rather than matching it, because the distinction it
 * has to make is positional and not lexical. A regex over `{\s*(\w+)` reads
 * every `{word` as an argument, but in
 *
 *   {count, plural, =1 {joueur} other {joueurs}}
 *
 * two of the three braces open *submessages* whose contents are literal text —
 * so the checker reported `joueur` and `joueurs` as placeholders, found
 * `player` and `players` on the English side, and failed a correct
 * translation while naming placeholders that do not exist. It read as a
 * translation bug rather than a tool bug.
 *
 * That never fired because the only two plural messages in the catalogue begin
 * every branch with `#`, which is not `\w`. `#` cannot carry a message with
 * more than one number in it, so the first one that needed two would have hit
 * this.
 *
 * Submessages are descended into, so an argument used only inside a branch is
 * still counted.
 *
 * What this returns is a *set of names*, which is the check's contract and not
 * an oversight: a translation may legitimately word one branch without the
 * number the others carry (`no players` against `{count} players`), and locales
 * do not even agree on how many branches exist — French has `one`/`other` where
 * Russian has `one`/`few`/`many`/`other`. Per-branch parity across locales
 * would therefore reject correct translations. A name that appears in no branch
 * at all is what this catches, and still does.
 *
 * @param message - one catalogue string, ICU syntax included
 * @returns the argument names it declares — an empty set for a message with none
 */
function placeholdersOf(message: string): Set<string> {
  const names = new Set<string>();
  readMessage(message, 0, names);
  return names;
}

/**
 * Reads message text from `from` until the end or an unmatched `}`.
 *
 * @param source - the message text being scanned
 * @param from - the index to start at
 * @param into - the set argument names are collected into, mutated in place
 * @returns the index of the unmatched `}` that ended the message, or the source length
 */
function readMessage(source: string, from: number, into: Set<string>): number {
  let index = from;

  while (index < source.length) {
    const char = source[index];

    if (char === "}") return index;
    if (char === "'") {
      const afterQuote = skipQuoted(source, index);
      if (afterQuote !== index) {
        index = afterQuote;
        continue;
      }
    }

    index = char === "{" ? readArgument(source, index, into) : index + 1;
  }

  return index;
}

/**
 * Reads one `{...}` argument, starting at its opening brace.
 *
 * @param source - the message text being scanned
 * @param from - the index of the argument's opening brace
 * @param into - the set argument names are collected into, mutated in place
 * @returns the index just past the argument's closing brace
 */
function readArgument(source: string, from: number, into: Set<string>): number {
  let index = skipSpace(source, from + 1);

  const nameStart = index;
  while (index < source.length && /[\w.]/.test(source[index]!)) index++;
  const name = source.slice(nameStart, index);
  if (name) into.add(name);

  const end = closingBrace(source, from);

  index = skipSpace(source, index);
  if (source[index] !== ",") return end + 1;

  index = skipSpace(source, index + 1);
  const typeStart = index;
  while (index < source.length && /\w/.test(source[index]!)) index++;
  const type = source.slice(typeStart, index);

  // `{when, date, short}` and friends: the style is a format, never a message.
  if (!SUBMESSAGE_TYPES.has(type)) return end + 1;

  // `{count, plural, =1 {…} other {…}}` — each selector is text and each
  // brace after one opens a submessage that may hold arguments of its own.
  while (index < end) {
    if (source[index] === "{") {
      index = readMessage(source, index + 1, into) + 1;
    } else {
      index++;
    }
  }

  return end + 1;
}

/**
 * Index of the `}` matching the `{` at `from`.
 *
 * @param source - the message text being scanned
 * @param from - the index of the opening brace to match
 * @returns the matching brace's index, or the source length when it is unmatched
 */
function closingBrace(source: string, from: number): number {
  let depth = 0;
  let index = from;

  while (index < source.length) {
    const afterQuote = skipQuoted(source, index);
    if (afterQuote !== index) {
      index = afterQuote;
      continue;
    }

    if (source[index] === "{") depth++;
    else if (source[index] === "}" && --depth === 0) return index;
    index++;
  }

  return source.length;
}

/**
 * Index just past an ICU quoted section, or `from` when there is none.
 *
 * Only `'{`, `'}` and `'#` start one — a lone apostrophe is a literal, which
 * is what keeps every `l'équipe` and `s'est` in the French catalogue from
 * being read as an escape.
 *
 * @param source - the message text being scanned
 * @param from - the index to start at
 * @returns the index just past the quoted section, or `from` unchanged when none starts here
 */
function skipQuoted(source: string, from: number): number {
  if (source[from] !== "'") return from;
  if (!"{}#".includes(source[from + 1] ?? "")) return from;

  const close = source.indexOf("'", from + 2);
  return close === -1 ? source.length : close + 1;
}

function skipSpace(source: string, from: number): number {
  let index = from;
  while (index < source.length && /\s/.test(source[index]!)) index++;
  return index;
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
