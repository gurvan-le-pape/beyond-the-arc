import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importSort from "eslint-plugin-simple-import-sort";
import sonarjs from "eslint-plugin-sonarjs";
import pathComment from "./eslint-rules/enforce-file-path-comment.js";

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
      "local-rules": { rules: { "enforce-file-path-comment": pathComment } },
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
      "@typescript-eslint/consistent-type-imports": "warn",
      "promise/prefer-top-level-await": "off",
      eqeqeq: ["error", "always"],
      "no-console": "warn",

      // SonarJS rules
      "sonarjs/cognitive-complexity": ["error", 15],
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-small-switch": "warn",
      "sonarjs/prefer-immediate-return": "warn",

      // Custom rule to enforce file path comments
      "local-rules/enforce-file-path-comment": "warn",
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
    ignores: ["dist", "node_modules", "*.config.js"],
  },
];
