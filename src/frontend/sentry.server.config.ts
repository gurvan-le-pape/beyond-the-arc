// src/frontend/sentry.server.config.ts
// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // `SENTRY_DSN` is declared in `.env` and consumed by `withSentryConfig` at
  // build time; the literal here is the fallback so local runs without the
  // variable still report. Server-side the environment variable wins.
  dsn:
    process.env.SENTRY_DSN ??
    "https://174ddf843e686ddcc585076640c1e384@o4511179148230656.ingest.de.sentry.io/4511179315937360",

  // @sentry/core defaults `environment` to the literal string "production", so
  // leaving it unset files local development errors into the production project
  // indistinguishably from real ones. Set it explicitly. Matches the backend.
  environment: process.env.NODE_ENV,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Never send default PII (visitor IP addresses, cookies, request and
  // response headers and bodies) to Sentry: this is a public site with an EU
  // audience and error tracking needs no personal data. Matches the backend.
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,
});
