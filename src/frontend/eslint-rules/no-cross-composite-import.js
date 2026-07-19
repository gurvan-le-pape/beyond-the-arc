const fs = require("node:fs");
const path = require("node:path");

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
        "Composite component folders (containing index.tsx) may only be imported via their folder path, never reached into (docs/frontend-conventions.md)",
    },
    messages: {
      noReachingIn:
        'Import reaches inside the composite folder "{{ composite }}". Import the composite itself ("{{ compositePath }}") or move the shared code to the feature level.',
    },
  },
  create(context) {
    const filename = context.getFilename().replace(/\\/g, "/");
    if (!filename.includes("src/frontend")) return {};

    const frontendRoot = filename.slice(
      0,
      filename.indexOf("src/frontend") + "src/frontend".length,
    );

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        let resolved;
        if (importPath.startsWith("@/")) {
          resolved = path.join(frontendRoot, importPath.slice(2));
        } else if (importPath.startsWith(".")) {
          resolved = path.join(path.dirname(filename), importPath);
        } else {
          return;
        }
        // Importing a composite's explicit /index is importing the composite.
        resolved = resolved.replace(/\\/g, "/").replace(/\/index$/, "");

        const componentsIdx = resolved.indexOf("/components/");
        if (!resolved.includes("/features/") || componentsIdx === -1) return;

        const componentsDir = resolved.slice(
          0,
          componentsIdx + "/components".length,
        );
        const innerSegments = resolved
          .slice(componentsIdx + "/components/".length)
          .split("/");

        // Walk every directory the import path passes *through*; if any of
        // them is a composite (has index.tsx), the import reaches inside it.
        let dir = componentsDir;
        for (let i = 0; i < innerSegments.length - 1; i++) {
          dir = `${dir}/${innerSegments[i]}`;
          if (!isCompositeDir(dir)) continue;
          // Importing from inside the same composite is fine.
          if ((path.dirname(filename) + "/").startsWith(dir + "/")) return;
          context.report({
            node: node.source,
            messageId: "noReachingIn",
            data: {
              composite: innerSegments[i],
              compositePath: importPath
                .split("/")
                .slice(
                  0,
                  importPath.split("/").length - (innerSegments.length - 1 - i),
                )
                .join("/"),
            },
          });
          return;
        }
      },
    };
  },
};
