import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importSort from "eslint-plugin-simple-import-sort";
import sonarjs from "eslint-plugin-sonarjs";
import pathComment from "./eslint-rules/enforce-file-path-comment.js";
import barrelImport from "./eslint-rules/enforce-barrel-import.js";

export default [
  // Config for all TS files
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "simple-import-sort": importSort,
      sonarjs: sonarjs,
      "local-rules": {
        rules: {
          "enforce-file-path-comment": pathComment,
          "enforce-barrel-import": barrelImport,
        },
      },
    },
    rules: {
      // Import sorting
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // TypeScript rules
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",

      // Report unused variables
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // Recommended additional rules
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      // `error`, not `warn`: `lint:fix` runs organize-imports-cli, which rewrites
      // a value-position type import into `import type` — so at `warn` the two
      // commands disagreed and the tree could never be stably clean. `lint`
      // reported 0 errors on a file `lint:fix` then rewrote, and nothing
      // rejected either state. Asserting it here is what makes the fixer's
      // transformation visible to the gate.
      "@typescript-eslint/consistent-type-imports": "error",
      "promise/prefer-top-level-await": "off",
      eqeqeq: ["error", "always"],
      "no-console": "warn",
      "no-void": ["error", { allowAsStatement: false }],

      // SonarJS rules
      "sonarjs/cognitive-complexity": ["error", 15],
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-small-switch": "warn",
      "sonarjs/prefer-immediate-return": "warn",

      // Custom rules. `error`, matching the frontend: these are the repo's own
      // conventions, and CI runs `npm run lint` without `--max-warnings`, so a
      // warning here can never block a merge — which made CLAUDE.md's "violations
      // fail lint/CI" false on this side. Vendor rules stay `warn`.
      "local-rules/enforce-file-path-comment": "error",
      "local-rules/enforce-barrel-import": "error",
    },
  },
  // Override for test files
  {
    files: ["**/*.spec.ts", "**/*.test.ts"],
    rules: {
      "sonarjs/no-duplicate-string": "off",
    },
  },
  {
    // `prisma/generated` is the Prisma client: 26 files, written by the
    // generator, gitignored. Linting it passed only because Prisma emits a
    // `/* eslint-disable */` header — strip that one line and the backend goes
    // from 0 errors to 23, so the exit code of a deploy gate was a property of
    // someone else's code generator. ESLint 9 does not read `.gitignore`.
    ignores: ["dist", "node_modules", "*.config.js", "prisma/generated"],
  },
];
