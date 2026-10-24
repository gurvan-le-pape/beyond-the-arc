const path = require("node:path");

// Resolves an import to a path relative to src/frontend, or null when it is a
// package import.
const resolveImport = (importPath, filename, frontendRoot) => {
  let resolved;
  if (importPath.startsWith("@/")) {
    resolved = importPath.slice(2);
  } else if (importPath.startsWith(".")) {
    resolved = path
      .relative(frontendRoot, path.join(path.dirname(filename), importPath))
      .replaceAll("\\", "/");
  } else {
    return null;
  }
  return resolved;
};

// The top-level feature a src/frontend-relative path belongs to, or null.
// Sub-features (competitions/championships, organizations/clubs) belong to
// their parent: importing between them stays inside one feature.
const featureOf = (relativePath) => {
  const match = /^features\/([^/]+)/.exec(relativePath);
  return match ? match[1] : null;
};

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Features import only from features in lower layers, and shared/ imports no feature (docs/frontend-conventions.md#feature-layers)",
    },
    schema: [
      {
        type: "object",
        properties: {
          layers: {
            type: "object",
            additionalProperties: { type: "integer", minimum: 0 },
          },
        },
        required: ["layers"],
        additionalProperties: false,
      },
    ],
    messages: {
      upward:
        'Feature "{{ from }}" (layer {{ fromLayer }}) imports from "{{ to }}" (layer {{ toLayer }}). A feature may only import from lower layers: move the code to the feature whose data it draws, or compose both in the page.',
      sameLayer:
        'Feature "{{ from }}" imports from "{{ to }}", which shares its layer ({{ fromLayer }}). Features on one layer stay independent: compose both in the page.',
      sharedImportsFeature:
        'shared/ imports from feature "{{ to }}". shared/ sits below every feature and imports none of them.',
      unknownFeature:
        'Feature "{{ feature }}" has no layer. Add it to FEATURE_LAYERS in eslint.config.mjs.',
    },
  },
  create(context) {
    const filename = context.getFilename().replaceAll("\\", "/");
    const rootIdx = filename.indexOf("src/frontend/");
    if (rootIdx === -1) return {};

    const frontendRoot = filename.slice(0, rootIdx + "src/frontend".length);
    const relativeFile = filename.slice(rootIdx + "src/frontend/".length);
    const { layers } = context.options[0];

    const fromFeature = featureOf(relativeFile);
    const inShared = relativeFile.startsWith("shared/");
    if (!fromFeature && !inShared) return {};

    return {
      ImportDeclaration(node) {
        const resolved = resolveImport(
          node.source.value,
          filename,
          frontendRoot,
        );
        const toFeature = resolved && featureOf(resolved);
        if (!toFeature || toFeature === fromFeature) return;

        if (inShared) {
          context.report({
            node: node.source,
            messageId: "sharedImportsFeature",
            data: { to: toFeature },
          });
          return;
        }

        for (const feature of [fromFeature, toFeature]) {
          if (!(feature in layers)) {
            context.report({
              node: node.source,
              messageId: "unknownFeature",
              data: { feature },
            });
            return;
          }
        }

        const fromLayer = layers[fromFeature];
        const toLayer = layers[toFeature];
        if (toLayer < fromLayer) return;

        context.report({
          node: node.source,
          messageId: toLayer === fromLayer ? "sameLayer" : "upward",
          data: { from: fromFeature, to: toFeature, fromLayer, toLayer },
        });
      },
    };
  },
};
