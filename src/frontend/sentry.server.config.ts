// src/frontend/sentry.server.config.ts
// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://174ddf843e686ddcc585076640c1e384@o4511179148230656.ingest.de.sentry.io/4511179315937360",

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Never send default PII (visitor IP addresses, cookies, request and
  // response headers and bodies) to Sentry: this is a public site with an EU
  // audience and error tracking needs no personal data. Matches the backend.
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,
});
