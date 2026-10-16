const createNextIntlPlugin = require("next-intl/plugin");
const { withSentryConfig } = require("@sentry/nextjs");

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server (server.js + traced node_modules subset) so
  // the production image ships without the build toolchain.
  output: "standalone",
  reactStrictMode: false,
  // No `X-Powered-By: Next.js` on every response: a hint about the stack for
  // anyone probing it, and no use to a visitor.
  poweredByHeader: false,
  experimental: {
    // Keep the Data Cache and ISR pages in memory only. With the default
    // `true`, every cached fetch and every ISR render is also written under
    // `.next/` and nothing ever deletes it: ~340 KB per player page per
    // locale, across hundreds of thousands of players, in a container layer
    // with no size limit. Memory is the in-process LRU capped by
    // `cacheMaxMemorySize` (50 MB default), so eviction is by size instead
    // of by redeploy. See docs/frontend.md, "Where the server cache lives".
    isrFlushToDisk: false,
  },
};

module.exports = withSentryConfig(withNextIntl(nextConfig), {
  org: "gurvan-le-pape",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
});
