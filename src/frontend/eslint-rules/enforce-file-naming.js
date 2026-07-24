const HOOK_FILE = /^use[A-Z][A-Za-z0-9]*\.tsx?$/;
const CAMEL_CASE = /^[a-z][a-zA-Z0-9]*\.tsx?$/;
const CAMEL_CASE_TS_ONLY = /^[a-z][a-zA-Z0-9]*\.ts$/;
const PASCAL_CASE_TS = /^[A-Z][A-Za-z0-9]*\.ts$/;

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce file naming in feature-level layer directories (docs/frontend-conventions.md)",
    },
    messages: {
      hookNotCamelCase:
        'Hook file "{{ file }}" must be camelCase useX (e.g. "useTeams.ts", not "use-teams.ts").',
      hooksDirNaming:
        'File "{{ file }}" in a hooks/ directory must be a camelCase useX.ts(x) hook.',
      constantsNaming:
        'File "{{ file }}" in a constants/ directory must be camelCase .ts.',
      utilsNaming:
        'File "{{ file }}" in a utils/ directory must be camelCase .ts(x).',
      typesNaming:
        'File "{{ file }}" in a types/ directory must be PascalCase .ts.',
    },
  },
  create(context) {
    const filename = context.getFilename().replaceAll("\\", "/");
    if (
      !filename.includes("src/frontend") ||
      !filename.includes("/features/") ||
      filename.includes("/components/")
    ) {
      return {};
    }

    const segments = filename.split("/");
    const basename = segments[segments.length - 1];
    // Evaluate test files against the rules of the file they test
    const effectiveName = basename.replace(/\.(test|spec)(?=\.tsx?$)/, "");
    if (effectiveName === "index.ts") return {};

    const layer = ["api", "hooks", "constants", "utils", "types"].find((dir) =>
      segments.includes(dir),
    );
    if (!layer) return {};

    const report = (messageId) => ({
      Program(node) {
        context.report({ node, messageId, data: { file: basename } });
      },
    });

    switch (layer) {
      case "api":
        if (effectiveName.startsWith("use") && !HOOK_FILE.test(effectiveName)) {
          return report("hookNotCamelCase");
        }
        return {};
      case "hooks":
        if (!HOOK_FILE.test(effectiveName)) {
          return report("hooksDirNaming");
        }
        return {};
      case "constants":
        if (!CAMEL_CASE_TS_ONLY.test(effectiveName)) {
          return report("constantsNaming");
        }
        return {};
      case "utils":
        if (!CAMEL_CASE.test(effectiveName)) {
          return report("utilsNaming");
        }
        return {};
      case "types":
        if (!PASCAL_CASE_TS.test(effectiveName)) {
          return report("typesNaming");
        }
        return {};
      default:
        return {};
    }
  },
};
