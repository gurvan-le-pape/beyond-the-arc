// src/frontend/vitest.config.ts
import path from "node:path";

import { defineConfig } from "vitest/config";

/**
 * Two kinds of test, told apart by extension so a spec never has to say which
 * it is:
 *
 * - `*.spec.ts` — pure TypeScript (derivations, geometry, the contrast check),
 *   in the `node` environment. Nothing there needs a DOM, and node starts in a
 *   fraction of jsdom's time.
 * - `*.spec.tsx` — components and hooks, in `jsdom`, with Testing Library's
 *   matchers and an unmount after every test (`vitest.setup.ts`).
 *
 * Both need `@/` to resolve the way the app's tsconfig `paths` do. JSX is
 * compiled with the automatic runtime: the app's tsconfig says `preserve`
 * because Next compiles it, and a test has no Next.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  oxc: {
    jsx: { runtime: "automatic" },
  },
  test: {
    coverage: {
      provider: "v8",
      // lcov for the sonarcloud job, with paths from the repository root
      // (`src/frontend/app/…`): Sonar resolves them from there, and a path
      // relative to this directory matches no file. text-summary for a person.
      reporter: [
        ["lcov", { projectRoot: path.resolve(__dirname, "../..") }],
        "text-summary",
      ],
      include: ["app/**", "features/**", "lib/**", "shared/**"],
      exclude: ["**/*.spec.*", "**/index.ts", "**/types/**", "**/*.d.ts"],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          include: ["**/*.spec.ts"],
          environment: "node",
        },
      },
      {
        extends: true,
        test: {
          name: "dom",
          include: ["**/*.spec.tsx"],
          environment: "jsdom",
          setupFiles: ["./vitest.setup.ts"],
          // next-intl's ESM build imports `next/navigation` with no extension,
          // which Node cannot resolve: `next` publishes no `exports` map.
          // Inlined, it goes through Vite's resolver, which can.
          server: { deps: { inline: ["next-intl"] } },
        },
      },
    ],
  },
});
