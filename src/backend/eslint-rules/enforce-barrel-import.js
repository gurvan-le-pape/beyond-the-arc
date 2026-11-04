const fs = require("node:fs");
const path = require("node:path");

// Derived from the barrels that actually exist on disk.
//
// This was a hand-maintained array of 22 entries and it had drifted: five of
// them named directories with no barrel behind them — `@common/middleware`
// (emptied when RequestIdMiddleware was removed), `@common/types` (holds only
// `express.d.ts`, which barrelsby excludes, so it can never acquire one), and
// three `@modules/geography/*` paths for a module that does not exist. A stale
// entry is not inert here: the rule is `fixable`, so `eslint --fix` would
// rewrite a resolvable specifier to an unresolvable one.
//
// Scanning the tree rather than reading the root `barrelsby.json` — which is
// what the frontend rule does — is deliberate. The backend dev container
// mounts only `src/backend`, so reaching up to the repo root would fail there
// exactly as the frontend equivalent already does. Disk is also the better
// authority for this rule: it enforces "import through the barrel that
// exists", and it cannot disagree with itself.
const BACKEND_ROOT = path.join(__dirname, "..");

// Directory -> path alias, from tsconfig.json's `paths`.
const ALIASED_ROOTS = [["common", "@common"]];

/**
 * Every directory below `root` that holds an `index.ts`, as an aliased path.
 * The aliased root itself is skipped: treating `@common` as a barrel would
 * rewrite every `@common/x/y` import to `"@common"`.
 */
function barrelDirsUnder(root, alias) {
  const found = [];

  const walk = (absolute, relative) => {
    let entries;
    try {
      entries = fs.readdirSync(absolute, { withFileTypes: true });
    } catch {
      return;
    }
    if (relative && entries.some((e) => e.isFile() && e.name === "index.ts")) {
      found.push(`${alias}/${relative}`);
    }
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== "node_modules") {
        walk(
          path.join(absolute, entry.name),
          relative ? `${relative}/${entry.name}` : entry.name,
        );
      }
    }
  };

  walk(path.join(BACKEND_ROOT, root), "");
  return found;
}

const BARREL_DIRS = ALIASED_ROOTS.flatMap(([root, alias]) =>
  barrelDirsUnder(root, alias),
);

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

        const matchingBarrel = BARREL_DIRS.find((barrel) =>
          importPath.startsWith(barrel + "/"),
        );

        if (!matchingBarrel) return;

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
