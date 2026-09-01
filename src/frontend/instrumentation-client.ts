// src/frontend/instrumentation-client.ts
// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // In the browser bundle `SENTRY_DSN` is not inlined (it is not a
  // `NEXT_PUBLIC_` variable), so the client always uses the public literal
  // below; the `??` keeps the intent explicit and lets a future public
  // variable replace it without touching this file.
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

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
