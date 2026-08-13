// src/backend/common/utils/request-log.util.ts

/**
 * The only request headers that reach the logs.
 *
 * pino-http's default `req` serializer emits the **entire** header block plus
 * `remoteAddress`/`remotePort`. On this deployment the app sits behind
 * Cloudflare and then Nginx, so the visitor's real IP arrives in the headers —
 * `cf-connecting-ip`, `x-forwarded-for`, `x-real-ip` — and every request line
 * carried all three into Loki, where they sat for the 31-day retention set in
 * `docker/config/loki.yml`. That is the exact thing `instrument.ts` refuses to
 * send to Sentry ("Never send default PII (visitor IP addresses)"): the written
 * policy was honoured by one sink and contradicted by the other.
 *
 * This is an allowlist rather than an extension of pino's `redact` paths on
 * purpose. A redact list is an allow-everything list with named exceptions, so
 * it cannot cover a header Cloudflare or a future proxy adds — the leak arrives
 * by default and nothing fails. An allowlist fails closed: a new header is
 * simply not logged until someone adds it here and says why.
 *
 * `authorization` and `cookie` used to be the two redacted paths. They are
 * absent from this list, so they can no longer be emitted at all; the spec
 * asserts it rather than leaving it to be re-derived.
 */
export const LOGGED_REQUEST_HEADERS = [
  "host",
  "user-agent",
  "content-type",
  "accept",
] as const;

interface LoggableRequest {
  id?: unknown;
  method?: string;
  url?: string;
  headers?: Record<string, unknown>;
}

export interface SerializedRequestLog {
  id: unknown;
  method?: string;
  url?: string;
  headers: Record<string, unknown>;
}

/**
 * Builds the `req` object that appears on every request log line.
 *
 * `url` keeps its query string, so search terms a visitor typed are still in
 * the logs. That is deliberate: the URL is what makes a log line diagnosable,
 * the dataset being searched is public, and once the IP is gone a search term
 * is not attached to anyone. Redacting the URL would gut the logs to remove a
 * far weaker signal than the one this function exists to remove.
 *
 * `query` and `params` are dropped because they are a second copy of what the
 * URL already contains, and `remoteAddress`/`remotePort` because behind two
 * proxies they only ever hold the proxy's address — see
 * `AllExceptionsFilter`, which stopped logging `ip` for the same reason.
 */
export function serializeRequestLog(
  req: LoggableRequest,
): SerializedRequestLog {
  const headers: Record<string, unknown> = {};

  for (const name of LOGGED_REQUEST_HEADERS) {
    const value = req.headers?.[name];
    if (value !== undefined) headers[name] = value;
  }

  return { id: req.id, method: req.method, url: req.url, headers };
}
