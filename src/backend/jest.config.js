module.exports = {
  preset: "ts-jest",
  // Replaces the preset's own `^.+\.tsx?$` entry so the ts-jest options below
  // can be passed. TS151002 ("hybrid module kind (Node16/18/Next) is only
  // supported in isolatedModules: true") is advisory and does not apply here:
  // with no ESM setup, ts-jest's fixupCompilerOptionsForModuleKind pins the
  // spec transform to CommonJS + Node10 regardless of what tsconfig says, so
  // tsconfig's `nodenext` never reaches the emit. Acting on the message by
  // setting `isolatedModules: true` would switch ts-jest to transpile-only and
  // silently stop type-checking the 49 spec files — the opposite of what is
  // wanted. `npm run typecheck` checks them under the real config.
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { diagnostics: { ignoreCodes: [151002] } }],
  },
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/*.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/test/integration/"],
  rootDir: ".",
  globalSetup: "<rootDir>/jest.globalSetup.js",
  moduleNameMapper: {
    "^@modules/(.*)$": "<rootDir>/modules/$1",
    "^@common/(.*)$": "<rootDir>/common/$1",
    // Exact keys, not `^prisma/(.*)$`. `prisma` is also a real npm package
    // with subpath exports — `prisma.config.ts` imports `prisma/config` — so a
    // wildcard here claims the package's entire namespace for the local
    // directory. It resolves today only because no `prisma/config.ts` exists;
    // adding one would silently shadow the package. Mirrors `paths` in
    // tsconfig.json and tsconfig.build.json, which must be kept in step.
    "^prisma/prisma\\.module$": "<rootDir>/prisma/prisma.module",
    "^prisma/prisma\\.service$": "<rootDir>/prisma/prisma.service",
  },
};
