// src/backend/common/constants/metrics-path.ts

/**
 * The path Prometheus scrapes.
 *
 * Named once because three places have to agree on it and two of them exist
 * to *exclude* it: `PrometheusModule.register({ path })` serves it,
 * `HttpMetricsInterceptor` skips it so self-scrapes stay out of the request
 * series, and pino's `autoLogging.ignore` skips it so they stay out of Loki.
 * If those fall out of step the exclusions silently stop matching and the
 * noise comes back looking like traffic.
 */
export const METRICS_PATH = "/metrics";
