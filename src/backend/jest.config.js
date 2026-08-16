module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/*.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
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
