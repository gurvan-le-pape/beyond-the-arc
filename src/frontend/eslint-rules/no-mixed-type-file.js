module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Files in features/*/types/ are either purely generated-API aliases or purely hand-written view types, never both (docs/frontend-conventions.md)",
    },
    messages: {
      mixedTypeFile:
        "This file imports the generated API types, so it may only contain type aliases. Move hand-written declarations to a separate view-type file.",
    },
  },
  create(context) {
    const filename = context.getFilename().replace(/\\/g, "/");
    if (
      !filename.includes("src/frontend") ||
      !/\/features\/.*\/types\/[^/]+\.ts$/.test(filename) ||
      filename.endsWith("/index.ts")
    ) {
      return {};
    }

    let importsGenerated = false;
    const handWrittenNodes = [];

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (
          source.includes("api.generated") ||
          (source === "@/shared/types" &&
            node.specifiers.some((s) => s.imported?.name === "components"))
        ) {
          importsGenerated = true;
        }
      },
      "TSInterfaceDeclaration, TSEnumDeclaration, ClassDeclaration, FunctionDeclaration, VariableDeclaration"(
        node,
      ) {
        handWrittenNodes.push(node);
      },
      "Program:exit"() {
        if (!importsGenerated) return;
        for (const node of handWrittenNodes) {
          context.report({ node, messageId: "mixedTypeFile" });
        }
      },
    };
  },
};
