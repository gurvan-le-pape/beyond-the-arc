// src/frontend/vitest.config.ts
import path from "node:path";

import { defineConfig } from "vitest/config";

/**
 * Unit-test setup for the frontend's pure-TS modules (zone predicates, data
 * transforms).
 *
 * The one thing this must do is make `@/` resolve the way the app's tsconfig
 * `paths` do, because the modules under test import each other through it.
 * Tests live next to the code as `*.spec.ts` and run in the `node`
 * environment — nothing here needs a DOM.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
  },
});
