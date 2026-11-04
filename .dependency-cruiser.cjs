// Module-boundary rules, run once per application (see `quality-report` in
// .gitlab-ci.yml). Every rule is `warn`: depcruise then exits 0 and the findings
// are read in the job log. Type-only imports count, so a cycle that only exists
// at the type level is reported too.
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "warn",
      from: {},
      to: { circular: true },
    },
    {
      name: "shared-utils-not-to-components",
      comment:
        "Utilities sit below the UI; a util importing a component inverts that.",
      severity: "warn",
      from: { path: "^src/frontend/shared/utils" },
      to: { path: "^src/frontend/shared/components" },
    },
    {
      name: "common-not-to-modules",
      comment:
        "common/ is shared by every feature module and depends on none of them.",
      severity: "warn",
      from: { path: "^src/backend/common" },
      to: { path: "^src/backend/modules" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: {
      path: "(\\.next|dist|prisma/generated|\\.spec\\.tsx?$|\\.test\\.tsx?$)",
    },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      extensions: [".ts", ".tsx", ".js", ".mjs", ".json"],
    },
  },
};
