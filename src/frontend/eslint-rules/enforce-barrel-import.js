const fs = require("node:fs");
const path = require("node:path");

// Derived from the root barrelsby.json — the single source of truth for
// which directories have generated barrels — so this rule cannot drift
// from barrel generation again.
//
// Found by walking up from this file rather than by a fixed `../../../`,
// because src/frontend is not always three levels below the repo root. Every
// container is a copy of src/frontend alone (`COPY src/frontend ./`, plus the
// dev bind-mount), so the fixed path resolved above `/` and ESLint died with
// `ENOENT: … '/barrelsby.json'` — exit 2 in the dev image, and a silently
// skipped lint pass during `next build` in the production image, which is the
// worse of the two because the image still built green.
//
// The containers now put the file at `/`, which is where `../../../` was
// pointing all along: with /app holding src/frontend, the container root is
// standing in for the repo root. The image carries a copy so it is
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

  // Never fall back to "enforce nothing". A rule that quietly stops enforcing
  // is invisible; one that refuses to load is a build error someone reads.
  throw new Error(
    `enforce-barrel-import: barrelsby.json not found. Looked in:\n  ${checked.join(
      "\n  ",
    )}\nThis rule derives its directory list from that file. If src/frontend ` +
      `has been copied somewhere without the repo root, the file has to come ` +
      `with it — see docker/frontend/Dockerfile and docker-compose.dev.yml.`,
  );
}

const barrelsbyConfig = JSON.parse(
  fs.readFileSync(findBarrelsbyConfig(__dirname), "utf8"),
);

const FRONTEND_BARREL_DIRS = barrelsbyConfig.directory
  .filter((dir) => dir.startsWith("src/frontend/"))
  .map((dir) => dir.replace(/^src\/frontend\//, "@/"));

// A file barrelsby is told to skip has no barrel form, so demanding one would
// name an export that does not exist — and the autofix would write it. Derived
// from the same config as the directory list, for the same reason.
const EXCLUDED_FROM_BARRELS = (barrelsbyConfig.exclude ?? []).map(
  (pattern) => new RegExp(pattern),
);

function isExcludedFromBarrel(importPath) {
  const filePath = importPath.replace(/^@\//, "src/frontend/");

  return EXCLUDED_FROM_BARRELS.some((pattern) =>
    [".ts", ".tsx"].some((extension) => pattern.test(filePath + extension)),
  );
}

module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      description:
        "Enforce imports from barrel index instead of direct file paths",
    },
    messages: {
      useBarrelImport:
        'Import from barrel index instead. Use "{{ barrelPath }}" instead of "{{ foundPath }}"',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value.replace(/\/index$/, "");

        const matchingBarrel = FRONTEND_BARREL_DIRS.find((barrel) =>
          importPath.startsWith(barrel + "/"),
        );

        if (!matchingBarrel) return;

        if (isExcludedFromBarrel(importPath)) return;

        context.report({
          node: node.source,
          messageId: "useBarrelImport",
          data: {
            barrelPath: matchingBarrel,
            foundPath: importPath,
          },
          fix(fixer) {
            return fixer.replaceText(node.source, `"${matchingBarrel}"`);
          },
        });
      },
    };
  },
};
