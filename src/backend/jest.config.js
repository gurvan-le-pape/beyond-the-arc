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
    "^prisma/(.*)$": "<rootDir>/prisma/$1",
    "^modules$": "<rootDir>/modules",
    "^common$": "<rootDir>/common",
  },
};
