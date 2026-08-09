// scripts/check-barrels-config.mjs
/**
 * Validates barrelsby.json itself.
 *
 * The barrels' *content* is already checked indirectly: `enforce-barrel-import`
 * forces imports through the barrel, so a stale barrel is a type error at the
 * import site and the typecheck/build jobs fail. What nothing checks is the
 * config, which is why three defects survived in one ~100-line file — an
 * unrecognised `barrelName` key, a `watch` flag barrelsby 2.8.1 does not read,
 * and a directory whose barrel had been deleted.
 *
 * None of those three change the generated output, so a regenerate-and-diff
 * check cannot see them. That is what this script is for; the diff check in
 * CI covers the other half.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "barrelsby.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));

const errors = [];

/**
 * The options barrelsby actually reads, taken from the installed package's own
 * type declaration rather than a hand-written list — so upgrading barrelsby
 * cannot leave this allowlist silently stale.
 */
function acceptedKeys() {
  const declaration = join(
    root,
    "node_modules/barrelsby/bin/options/options.d.ts",
  );
  const source = readFileSync(declaration, "utf8");
  const block = source.match(/export interface Arguments \{([\s\S]*?)\n\}/);
  if (!block) {
    throw new Error(
      `Could not read barrelsby's Arguments interface from ${declaration}. ` +
        `If the package layout changed, update this script rather than dropping the check.`,
    );
  }
  return new Set(
    [...block[1].matchAll(/^\s{4}([a-zA-Z]+)\??:/gm)].map((m) => m[1]),
  );
}

const accepted = acceptedKeys();
for (const key of Object.keys(config)) {
  if (!accepted.has(key)) {
    errors.push(
      `unrecognised key "${key}" — barrelsby ignores it silently, so it reads as configuration and is inert. ` +
        `Accepted: ${[...accepted].sort().join(", ")}`,
    );
  }
}

// Every configured directory must exist and hold a barrel. An entry pointing at
// an empty directory is a silent no-op; one pointing at a missing directory is
// an uncaught ENOENT that takes the whole run down.
const barrelName = (config.name ?? "index").replace(/\.tsx?$/, "");
for (const dir of config.directory ?? []) {
  const absolute = join(root, dir);
  if (!existsSync(absolute) || !statSync(absolute).isDirectory()) {
    errors.push(
      `"${dir}" does not exist — barrelsby exits 1 on a missing directory`,
    );
    continue;
  }
  if (!existsSync(join(absolute, `${barrelName}.ts`))) {
    errors.push(
      `"${dir}" has no ${barrelName}.ts after regeneration — the directory holds no source file barrelsby will export, so the entry does nothing`,
    );
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`barrelsby.json: ${error}`);
  process.exit(1);
}

console.log(
  `barrelsby.json OK — ${Object.keys(config).length} keys, ${config.directory.length} directories, each with an ${barrelName}.ts.`,
);
