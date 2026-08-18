// src/frontend/instrumentation.ts
import * as Sentry from "@sentry/nextjs";

/**
 * Next's instrumentation hook: initialises Sentry once per server runtime.
 *
 * **The imports are dynamic on purpose.** `NEXT_RUNTIME` decides which config
 * loads, and only that one is ever evaluated — a static import would pull the
 * Node config into the edge bundle, where its dependencies do not exist.
 *
 * This covers the server and edge runtimes only. Browser initialisation is a
 * separate file, `instrumentation-client.ts`, which Next loads on its own; there
 * is no browser branch to add here.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
