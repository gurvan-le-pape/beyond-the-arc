const path = require("node:path");
const createNextIntlPlugin = require("next-intl/plugin");
const { withSentryConfig } = require("@sentry/nextjs");

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      features: path.resolve(__dirname, "features"),
      lib: path.resolve(__dirname, "lib"),
      styles: path.resolve(__dirname, "styles"),
      shared: path.resolve(__dirname, "shared"),
    };
    return config;
  },
};

module.exports = withSentryConfig(withNextIntl(nextConfig), {
  org: "gurvan-le-pape",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
});
