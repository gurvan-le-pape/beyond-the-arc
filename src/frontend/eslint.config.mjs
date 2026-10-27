import nextPlugin from "@next/eslint-plugin-next";
import jsdoc from "eslint-plugin-jsdoc";
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
import noTranslatorProp from "./eslint-rules/no-translator-prop.js";
import enforceNamedProps from "./eslint-rules/enforce-named-props.js";
import featureLayers from "./eslint-rules/enforce-feature-layers.js";

// Migration ratchet for docs/frontend-conventions.md: features not yet
// restructured to the component conventions. Each migration PR restructures
// one feature and removes its entry here. Never add entries.
const LEGACY_FEATURES = [];

// The feature layers of docs/frontend-conventions.md#feature-layers. A feature
// imports only from features on a lower layer; shared/ sits below all of them.
const FEATURE_LAYERS = {
  geography: 1,
  stats: 1,
  "shot-chart": 1,
  organizations: 2,
  competitions: 3,
  matches: 4,
  teams: 5,
  players: 5,
  search: 6,
  site: 6,
};

export default [
  // Config for all TS files
  {
    files: ["**/*.ts", "**/*.mts", "**/*.tsx"],
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
      "@next/next": nextPlugin,
      jsdoc,
      "local-rules": {
        rules: {
          "enforce-file-path-comment": pathComment,
          "enforce-barrel-import": barrelImport,
          "enforce-component-folder-structure": componentFolderStructure,
          "enforce-file-naming": fileNaming,
          "no-cross-composite-import": noCrossCompositeImport,
          "no-mixed-type-file": noMixedTypeFile,
          "no-translator-prop": noTranslatorProp,
          "enforce-named-props": enforceNamedProps,
          "enforce-feature-layers": featureLayers,
        },
      },
    },
    settings: {
      jsdoc: {
        mode: "typescript",
        // TSDoc's spelling wins: the plugin defaults to JSDoc's `@template`.
        tagNamePreference: { template: "typeParam" },
      },
    },
    rules: {
      // Doc comments: that one exists, and that what it claims matches the code.
      "jsdoc/require-jsdoc": [
        "error",
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
        },
      ],
      // Names and order must match the signature. Destructured members are not
      // required — props are documented on their interface, not as `props.x`.
      "jsdoc/check-param-names": ["error", { checkDestructured: false }],
      "jsdoc/check-tag-names": "error",
      "jsdoc/no-types": "error",

      // Import sorting
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // TypeScript rules
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      // TS handbook: "use `interface` until you need to use features from
      // `type`". Interfaces also extend more cheaply than intersections.
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],

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
      "sonarjs/no-duplicate-string": "warn", // ← Enable for source code
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-small-switch": "warn",
      // Props are readonly — a component that mutates its own props is a bug
      // the type system can rule out. See docs/frontend-conventions.md#props.
      "sonarjs/prefer-read-only-props": "error",
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

      // Next.js. The plugin is used directly rather than via
      // eslint-config-next, whose bundled eslint-plugin-react preset reports
      // 1250 findings here that are all obsolete under the React 17+ JSX
      // transform and TypeScript. The recommended set ships at "warn", but CI
      // runs eslint without --max-warnings so a warning can never block a
      // merge — promoting everything to "error" subsumes the core-web-vitals
      // variant, which only raises no-html-link-for-pages and no-sync-scripts.
      ...Object.fromEntries(
        Object.keys(nextPlugin.configs.recommended.rules).map((rule) => [
          rule,
          "error",
        ]),
      ),

      // Custom rules
      "local-rules/enforce-file-path-comment": "error",
      "local-rules/enforce-barrel-import": "error",
      "local-rules/enforce-component-folder-structure": "error",
      "local-rules/enforce-file-naming": "error",
      "local-rules/no-cross-composite-import": "error",
      "local-rules/no-mixed-type-file": "error",
      "local-rules/no-translator-prop": "error",
      "local-rules/enforce-named-props": "error",
      "local-rules/enforce-feature-layers": [
        "error",
        { layers: FEATURE_LAYERS },
      ],
    },
  },
  // `@param`/`@returns` are required for ordinary functions but not for
  // components: a component takes one destructured props object (which the
  // plugin names `root0`) and returns JSX, so both tags would be noise. Props
  // are documented on their interface members instead — see
  // docs/frontend-conventions.md#docstrings. `.tsx` is therefore excluded, at
  // the cost of missing the few JSX-returning hooks that live there.
  {
    files: ["**/*.ts", "**/*.mts"],
    ignores: ["**/*.spec.ts", "**/*.test.ts"],
    rules: {
      "jsdoc/require-param": ["error", { checkDestructured: false }],
      "jsdoc/require-param-description": "error",
      "jsdoc/require-returns": "error",
      "jsdoc/require-returns-description": "error",
    },
  },
  // One way to put a number on screen: next-intl's formatter, or
  // `createStatFormat` over it for per-game averages and percentages.
  // `toFixed` ignores the locale; `toLocaleString` and `Intl.NumberFormat`
  // bypass the one the request already resolved. See docs/frontend.md.
  {
    files: ["app/**", "features/**", "shared/**"],
    ignores: ["**/*.spec.ts", "**/*.test.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.property.name='toFixed']",
          message:
            "Format through createStatFormat(useFormatter()).perGame or useFormatter().number — toFixed ignores the locale.",
        },
        {
          selector: "CallExpression[callee.property.name='toLocaleString']",
          message:
            "Format through useFormatter()/getFormatter() — it already knows the request's locale.",
        },
        {
          selector:
            "NewExpression[callee.object.name='Intl'][callee.property.name='NumberFormat']",
          message:
            "Format through useFormatter()/getFormatter() — it already knows the request's locale.",
        },
      ],
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
  // Override for build scripts — they are CLIs, stdout is their output
  {
    files: ["scripts/**"],
    rules: {
      "no-console": "off",
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
