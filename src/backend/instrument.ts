// src/backend/instrument.ts
import * as Sentry from "@sentry/nestjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Send structured logs to Sentry
  enableLogs: true,
  // Never send default PII (visitor IP addresses) to Sentry: this is a
  // public site with an EU audience and error tracking needs no personal
  // data.
  sendDefaultPii: false,
});
