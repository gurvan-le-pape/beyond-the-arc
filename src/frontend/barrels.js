const fs = require("node:fs");
const path = require("node:path");

// The frontend's barrel directories, read from the root barrelsby.json — the
// single source of truth for which directories have generated barrels. Both
// `enforce-barrel-import` (which imports must go through a barrel) and
// next.config.js (which barrels the bundler may see through) derive from it,
// so neither can drift from barrel generation.
//
// Found by walking up from this file rather than by a fixed `../../`, because
// src/frontend is not always two levels below the repo root. Every container is
// a copy of src/frontend alone (`COPY src/frontend ./`, plus the dev
// bind-mount) with the file placed at `/`: with /app holding src/frontend, the
// container root stands in for the repo root. The image carries a copy so it is
// self-sufficient, and the dev compose file bind-mounts the real one over it
// read-only, so no second copy is ever committed and the two cannot diverge.
function findBarrelsbyConfig(startDir) {
  const checked = [];

  for (let dir = startDir; ; dir = path.dirname(dir)) {
    const candidate = path.join(dir, "barrelsby.json");
    checked.push(candidate);
    if (fs.existsSync(candidate)) return candidate;
    if (dir === path.dirname(dir)) break;
  }

  // Never fall back to "no barrels". A lint rule that quietly stops enforcing
  // is invisible; a config that refuses to load is a build error someone reads.
  throw new Error(
    `barrelsby.json not found. Looked in:\n  ${checked.join("\n  ")}\n` +
      `The barrel import rule and next.config.js derive their directory list ` +
      `from that file. If src/frontend has been copied somewhere without the ` +
      `repo root, the file has to come with it — see ` +
      `docker/frontend/Dockerfile and docker-compose.dev.yml.`,
  );
}

const barrelsbyConfig = JSON.parse(
  fs.readFileSync(findBarrelsbyConfig(__dirname), "utf8"),
);

/** Every frontend barrel directory, as the `@/` import path that reaches it. */
const FRONTEND_BARREL_DIRS = barrelsbyConfig.directory
  .filter((dir) => dir.startsWith("src/frontend/"))
  .map((dir) => dir.replace(/^src\/frontend\//, "@/"));

module.exports = { barrelsbyConfig, FRONTEND_BARREL_DIRS };
