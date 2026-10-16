// src/backend/common/utils/cors-origins.util.ts

/**
 * The Next.js dev server's origin. Dev is the only genuinely cross-origin
 * configuration in this project — the browser calls the backend on :4000 from
 * a page served on :3000 — so it needs a CORS allowance. In production Nginx
 * serves both under one origin and this must not be trusted.
 */
export const DEV_ORIGIN = "http://localhost:3000";

/**
 * The CORS origin allowlist, derived from the environment.
 *
 * Production trusts exactly one origin: FRONTEND_URL. Anything else — a dev
 * origin, a wildcard, a silent fallback — is a page on some other host being
 * allowed to read this API from a visitor's browser. There is no auth here, so
 * that costs nothing today; it costs everything the day there is.
 *
 * A missing FRONTEND_URL in production throws rather than degrading. Falling
 * back to an empty string would put an origin in the list that matches no
 * Origin header, so the real frontend would silently lose its CORS while
 * `http://localhost:3000` kept working. Failing at boot is the loud version of
 * that, and the deploy surfaces it instead of the users.
 */
export function resolveCorsOrigins(
  env: Record<string, string | undefined> = process.env,
): string[] {
  const frontendUrl = env.FRONTEND_URL?.trim();

  if (env.NODE_ENV === "production") {
    if (!frontendUrl) {
      throw new Error(
        "FRONTEND_URL must be set in production: it is the only allowed CORS origin. " +
          "Set it to the public origin of the frontend, e.g. https://example.com",
      );
    }
    return [frontendUrl];
  }

  // Outside production the dev origin always stays, so no local workflow
  // depends on FRONTEND_URL being set — and setting it to the dev origin
  // (which the local .env does) must not list it twice.
  return frontendUrl && frontendUrl !== DEV_ORIGIN
    ? [frontendUrl, DEV_ORIGIN]
    : [DEV_ORIGIN];
}
