const fs = require("node:fs");
const path = require("node:path");

// Derived from the root barrelsby.json — the single source of truth for
// which directories have generated barrels — so this rule cannot drift
// from barrel generation again.
const barrelsbyConfig = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "..", "..", "barrelsby.json"),
    "utf8",
  ),
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
