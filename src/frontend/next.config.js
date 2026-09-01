const createNextIntlPlugin = require("next-intl/plugin");
const { withSentryConfig } = require("@sentry/nextjs");

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server (server.js + traced node_modules subset) so
  // the production image ships without the build toolchain.
  output: "standalone",
  reactStrictMode: false,
};

module.exports = withSentryConfig(withNextIntl(nextConfig), {
  org: "gurvan-le-pape",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
});
