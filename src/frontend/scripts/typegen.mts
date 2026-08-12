// src/frontend/scripts/typegen.mts
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";

/**
 * Regenerates `shared/types/api.generated.ts` from the committed OpenAPI
 * snapshot. Run with `npm run typegen`, after the backend has rewritten
 * `docs/openapi.json`.
 *
 * The snapshot lives at the repository root because both applications use it:
 * `src/backend/scripts/generate-openapi.ts` writes it and this reads it. That
 * makes it the one file this project depends on from outside itself, so the
 * two things that go wrong with such a dependency are handled here rather than
 * left to a stack trace.
 *
 * **Paths are resolved from this file, not the cwd.** The previous form passed
 * `../../docs/openapi.json` straight to the CLI, which meant the script only
 * worked when invoked with the cwd at exactly `src/frontend` — from anywhere
 * else the relative path pointed at whatever happened to be two levels up.
 * `generate-openapi.ts` derives its path the same way and for the same reason.
 *
 * **A missing snapshot is reported, not thrown.** `.dockerignore` excludes
 * `docs` from every build context and no Dockerfile copies it, so inside a
 * container the file is simply not there. Without this check the failure is a
 * `ResolveError` from a transitive dependency of the generator, naming an
 * absolute path nobody typed.
 *
 * Node executes this file directly by stripping the types — no build step. See
 * `check-message-parity.mts` for why the extension is `.mts`.
 */

const PROJECT_DIR = join(import.meta.dirname, "..");
const SNAPSHOT = join(PROJECT_DIR, "..", "..", "docs", "openapi.json");
const OUTPUT = join(PROJECT_DIR, "shared", "types", "api.generated.ts");

if (!existsSync(SNAPSHOT)) {
  console.error(
    [
      `No OpenAPI snapshot at ${SNAPSHOT}.`,
      "",
      "This script reads the committed snapshot at the repository root, so it",
      "needs a full checkout. It cannot run inside an image or the dev",
      "container: .dockerignore excludes `docs` from every build context.",
      "",
      "If the file should exist, regenerate it from src/backend:",
      "  npm run build && node dist/scripts/generate-openapi.js",
    ].join("\n"),
  );
  process.exit(1);
}

// Resolved through the package's own `bin` field rather than the
// `openapi-typescript` name on PATH, which is only set when npm runs the
// script. Resolving `bin/cli.js` directly does not work: the package's
// `exports` map rewrites `./*.js` to `./*.mjs`, a file it does not ship.
const manifestPath = createRequire(import.meta.url).resolve(
  "openapi-typescript/package.json",
);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
  bin: Record<string, string>;
};
const cli = join(dirname(manifestPath), manifest.bin["openapi-typescript"]);

const { status } = spawnSync(process.execPath, [cli, SNAPSHOT, "-o", OUTPUT], {
  stdio: "inherit",
});

if (status !== 0) {
  process.exit(status ?? 1);
}

console.log(`Wrote ${relative(PROJECT_DIR, OUTPUT)}`);
