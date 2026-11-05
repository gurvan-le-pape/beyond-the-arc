const createNextIntlPlugin = require("next-intl/plugin");
const { withSentryConfig } = require("@sentry/nextjs");

const { FRONTEND_BARREL_DIRS } = require("./barrels.js");

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server (server.js + traced node_modules subset) so
  // the production image ships without the build toolchain.
  output: "standalone",
  // No `X-Powered-By: Next.js` on every response: a hint about the stack for
  // anyone probing it, and no use to a visitor.
  poweredByHeader: false,
  eslint: {
    // `next build` runs ESLint without reading eslint-suppressions.json, so it
    // would report every baselined violation as an error. `frontend-lint` is
    // the lint gate, and `deploy` waits on it.
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Keep the Data Cache and ISR pages in memory only. With the default
    // `true`, every cached fetch and every ISR render is also written under
    // `.next/` and nothing ever deletes it: ~340 KB per player page per
    // locale, across hundreds of thousands of players, in a container layer
    // with no size limit. Memory is the in-process LRU capped by
    // `cacheMaxMemorySize` (50 MB default), so eviction is by size instead
    // of by redeploy. See docs/frontend.md, "Where the server cache lives".
    isrFlushToDisk: false,
    // Rewrite `import { Grid } from "@/shared/components/primitives"` to the
    // file that defines `Grid`, for every generated barrel. Without it, a
    // server component importing a barrel makes every "use client" module the
    // barrel re-exports a client reference of that page, used or not: /contact
    // shipped Tabs and MultiSelect for one server-rendered Grid, and every
    // page with shared components carried 7–26 kB of client code it never
    // runs. Safe because barrelsby barrels are pure `export *` lists and
    // `sideEffects` in package.json declares that importing a module does
    // nothing — the same promise that lets the client bundle drop unused
    // exports.
    optimizePackageImports: FRONTEND_BARREL_DIRS,
  },
};

module.exports = withSentryConfig(withNextIntl(nextConfig), {
  org: "gurvan-le-pape",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
});
