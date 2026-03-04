const path = require("path");
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Add this line
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

module.exports = withNextIntl(nextConfig);
