import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import a11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import importSort from "eslint-plugin-simple-import-sort";
import sonarjs from "eslint-plugin-sonarjs";
import pathComment from "./eslint-rules/enforce-file-path-comment.js";
import barrelImport from "./eslint-rules/enforce-barrel-import.js";
import componentFolderStructure from "./eslint-rules/enforce-component-folder-structure.js";
import fileNaming from "./eslint-rules/enforce-file-naming.js";
import noCrossCompositeImport from "./eslint-rules/no-cross-composite-import.js";
import noMixedTypeFile from "./eslint-rules/no-mixed-type-file.js";

// Migration ratchet for docs/frontend-conventions.md: features not yet
// restructured to the component conventions. Each migration PR restructures
// one feature and removes its entry here. Never add entries.
const LEGACY_FEATURES = [];

export default [
  // Config for all TS files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "simple-import-sort": importSort,
      sonarjs: sonarjs,
      "jsx-a11y": a11y,
      "react-hooks": reactHooks,
      "local-rules": {
        rules: {
          "enforce-file-path-comment": pathComment,
          "enforce-barrel-import": barrelImport,
          "enforce-component-folder-structure": componentFolderStructure,
          "enforce-file-naming": fileNaming,
          "no-cross-composite-import": noCrossCompositeImport,
          "no-mixed-type-file": noMixedTypeFile,
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
      "@typescript-eslint/consistent-type-imports": "warn",
      "promise/prefer-top-level-await": "off",
      eqeqeq: ["error", "always"],
      "no-console": "warn",
      "no-void": ["error", { allowAsStatement: false }],

      // SonarJS rules
      "sonarjs/cognitive-complexity": ["error", 15],
      "sonarjs/no-duplicate-string": "warn", // ← Enable for source code
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-small-switch": "warn",
      "sonarjs/prefer-immediate-return": "warn",

      // Accessibility. The recommended set (34 rules, all "error") reports zero
      // findings on the current tree, so it costs nothing today and only ever
      // fires on newly written markup.
      ...a11y.configs.recommended.rules,

      // React hooks. These two rules are named deliberately: as of v7 the
      // plugin's own `recommended` preset is the React Compiler ruleset (16
      // rules), which flags the ordinary mounted-flag and sync-from-prop
      // effects and the accumulator in match-events as errors. Spreading it
      // is not the same thing as enabling the classic pair.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",

      // Custom rules
      "local-rules/enforce-file-path-comment": "error",
      "local-rules/enforce-barrel-import": "error",
      "local-rules/enforce-component-folder-structure": "error",
      "local-rules/enforce-file-naming": "error",
      "local-rules/no-cross-composite-import": "error",
      "local-rules/no-mixed-type-file": "error",
    },
  },
  // Migration ratchet: legacy features keep the old structure until their
  // migration PR lands (see docs/frontend-conventions.md).
  ...(LEGACY_FEATURES.length > 0
    ? [
        {
          files: LEGACY_FEATURES,
          rules: {
            "local-rules/enforce-component-folder-structure": "off",
            "local-rules/enforce-file-naming": "off",
            "local-rules/no-mixed-type-file": "off",
          },
        },
      ]
    : []),
  // Override for test files
  {
    files: ["**/*.spec.ts", "**/*.test.ts", "**/*.spec.tsx", "**/*.test.tsx"],
    rules: {
      "sonarjs/no-duplicate-string": "off", // ← Disable for tests
    },
  },
  {
    ignores: [
      ".next",
      "node_modules",
      "*.config.js",
      "next-env.d.ts",
      "shared/types/api.generated.ts",
    ],
  },
];
