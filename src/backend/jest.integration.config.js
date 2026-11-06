const base = require("./jest.config");

// Suites under test/integration need a migrated PostgreSQL behind DATABASE_URL;
// see "Integration tests" in docs/ci-cd.md. The unit run excludes them.
module.exports = {
  ...base,
  testMatch: ["<rootDir>/test/integration/**/*.integration.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
