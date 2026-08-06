// src/frontend/sentry.edge.config.ts
// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
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
