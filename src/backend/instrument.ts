// src/backend/instrument.ts
import * as Sentry from "@sentry/nestjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // @sentry/core defaults `environment` to the literal string "production"
  // (constants.js: DEFAULT_ENVIRONMENT). Leaving it unset therefore does not
  // mean "untagged" — it means every `make up-dev` error is filed into the
  // production project indistinguishably from a real one, because the dev
  // compose file inherits SENTRY_DSN from the base service definition. Set it
  // explicitly, and default to development: the prod image hardcodes
  // NODE_ENV=production, so an absent value can only be a local run.
  // SENTRY_ENVIRONMENT comes first: it names a deployment that runs the
  // production image but is not production (the k3s lab, the rehearsal host).
  environment:
    process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? "development",

  // Identifies which build produced an event. Supplied as the deploy's image
  // tag (the commit SHA), so a release always names an image that exists and a
  // rollback re-tags correctly. Sourcemaps ship next to dist/*.js in the same
  // image, which is what lets a stack trace resolve to TypeScript rather than
  // to compiled output.
  release: process.env.SENTRY_RELEASE,

  // Send structured logs to Sentry
  enableLogs: true,
  // Never send default PII (visitor IP addresses) to Sentry: this is a
  // public site with an EU audience and error tracking needs no personal
  // data.
  sendDefaultPii: false,
});
