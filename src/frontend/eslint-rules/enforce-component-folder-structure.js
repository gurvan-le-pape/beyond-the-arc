const fs = require("node:fs");
const path = require("node:path");

const MAX_DEPTH = 3;
const FORBIDDEN_DIR_NAMES = new Set(["utils", "types", "hooks"]);
const KEBAB_CASE = /^[a-z][a-z0-9-]*$/;
const PASCAL_CASE_TSX = /^[A-Z][A-Za-z0-9]*\.tsx$/;
const HOOK_FILE = /^use[A-Z][A-Za-z0-9]*\.tsx?$/;
const CAMEL_CASE_TS = /^[a-z][a-zA-Z0-9]*\.tsx?$/;

const compositeDirCache = new Map();
const isCompositeDir = (dir) => {
  if (!compositeDirCache.has(dir)) {
    compositeDirCache.set(dir, fs.existsSync(path.join(dir, "index.tsx")));
  }
  return compositeDirCache.get(dir);
};

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce component folder structure inside features/*/components (docs/frontend-conventions.md)",
    },
    messages: {
      noUnderscorePrefix:
        "Underscore-prefixed component files are not allowed. A composite folder's root component is its index.tsx.",
      folderNotKebab:
        'Folder "{{ folder }}" under components/ must be kebab-case.',
      noLayerDirInComponents:
        'No "{{ folder }}/" directories inside components/. Component-private files live directly in their composite folder; shared ones in the feature-level directory.',
      depthExceeded:
        "Maximum folder depth below components/ is {{ maxDepth }} (found {{ depth }}). Flatten into siblings and express ownership with name prefixes.",
      barrelOnlyAtRoot:
        "index.ts barrels only exist at the components/ root. A composite folder's root is index.tsx.",
      colocatedOutsideComposite:
        'Colocated file "{{ file }}" is only allowed inside a composite folder (one containing an index.tsx). Move it into the composite it belongs to, or to the feature-level directory if shared.',
      invalidFileName:
        'File "{{ file }}" does not match any allowed component-folder file kind: index.tsx, PascalCase.tsx, types.ts, useX.ts(x), or a camelCase helper.',
    },
  },
  create(context) {
    const filename = context.getFilename().replaceAll("\\", "/");
    const marker = "/features/";
    if (
      !filename.includes("src/frontend") ||
      !filename.includes(marker) ||
      !filename.includes("/components/")
    ) {
      return {};
    }

    const afterComponents = filename.slice(
      filename.indexOf("/components/") + "/components/".length,
    );
    const segments = afterComponents.split("/");
    const basename = segments[segments.length - 1];
    const dirs = segments.slice(0, -1);
    // Evaluate test files against the rules of the file they test
    const effectiveName = basename.replace(/\.(test|spec)(?=\.tsx?$)/, "");

    return {
      Program(node) {
        if (effectiveName.startsWith("_")) {
          context.report({ node, messageId: "noUnderscorePrefix" });
        }

        for (const dir of dirs) {
          if (FORBIDDEN_DIR_NAMES.has(dir)) {
            context.report({
              node,
              messageId: "noLayerDirInComponents",
              data: { folder: dir },
            });
          } else if (!KEBAB_CASE.test(dir)) {
            context.report({
              node,
              messageId: "folderNotKebab",
              data: { folder: dir },
            });
          }
        }

        if (dirs.length > MAX_DEPTH) {
          context.report({
            node,
            messageId: "depthExceeded",
            data: { maxDepth: String(MAX_DEPTH), depth: String(dirs.length) },
          });
        }

        if (effectiveName === "index.ts") {
          if (dirs.length > 0) {
            context.report({ node, messageId: "barrelOnlyAtRoot" });
          }
          return;
        }
        if (
          effectiveName === "index.tsx" ||
          PASCAL_CASE_TSX.test(effectiveName)
        ) {
          return;
        }

        // Everything else (types.ts, useX.ts(x), camelCase helpers) is a
        // colocated file: only valid inside a composite folder.
        if (!isCompositeDir(path.dirname(filename))) {
          context.report({
            node,
            messageId: "colocatedOutsideComposite",
            data: { file: basename },
          });
          return;
        }
        if (
          effectiveName !== "types.ts" &&
          !HOOK_FILE.test(effectiveName) &&
          !CAMEL_CASE_TS.test(effectiveName)
        ) {
          context.report({
            node,
            messageId: "invalidFileName",
            data: { file: basename },
          });
        }
      },
    };
  },
};
