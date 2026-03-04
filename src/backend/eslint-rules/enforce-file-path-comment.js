module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      description: "Enforce file path comment at the top of every file",
    },
    messages: {
      missingPathComment:
        "Missing file path comment. Expected: // {{ expectedPath }}",
      incorrectPathComment:
        "Incorrect file path comment. Expected: // {{ expectedPath }}, found: // {{ foundPath }}",
    },
  },
  create(context) {
    const filename = context.getFilename();

    if (!filename.includes("src/backend")) return {};

    const match = filename.match(/src\/backend\/(.*)/);
    if (!match) return {};
    const expectedPath = `src/backend/${match[1]}`;

    const isPathComment = (text) =>
      text.trim().startsWith("src/backend/") ||
      text.trim().startsWith("modules/") ||
      text.trim().startsWith("common/") ||
      text.trim().startsWith("config/") ||
      text.trim().startsWith("prisma/");

    return {
      Program(node) {
        const sourceCode = context.getSourceCode();
        const comments = sourceCode.getAllComments();
        const firstComment = comments[0];
        const isFirst = firstComment?.loc.start.line === 1;

        if (!isFirst || !isPathComment(firstComment.value)) {
          context.report({
            node,
            messageId: "missingPathComment",
            data: { expectedPath },
            fix(fixer) {
              return fixer.insertTextBeforeRange(
                [0, 0],
                `// ${expectedPath}\n`,
              );
            },
          });
          return;
        }

        const foundPath = firstComment.value.trim();
        if (foundPath !== expectedPath) {
          context.report({
            node: firstComment,
            messageId: "incorrectPathComment",
            data: { expectedPath, foundPath },
            fix(fixer) {
              return fixer.replaceText(firstComment, `// ${expectedPath}`);
            },
          });
        }
      },
    };
  },
};
