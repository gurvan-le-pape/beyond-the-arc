// src/backend/common/utils/request-log.util.ts
import { inspect } from "node:util";

/**
 * The only request headers that reach the logs.
 *
 * pino-http's default `req` serializer emits the **entire** header block plus
 * `remoteAddress`/`remotePort`. On this deployment the app sits behind
 * Cloudflare and then Nginx, so the visitor's real IP arrives in the headers —
 * `cf-connecting-ip`, `x-forwarded-for`, `x-real-ip` — and the default would
 * put all three on every request line in Loki, for the 31-day retention set in
 * `docker/config/loki.yml`. That is the exact thing `instrument.ts` refuses to
 * send to Sentry ("Never send default PII (visitor IP addresses)"), and one
 * policy honoured by one sink and contradicted by the other is not a policy.
 *
 * This is an allowlist rather than an extension of pino's `redact` paths on
 * purpose. A redact list is an allow-everything list with named exceptions, so
 * it cannot cover a header Cloudflare or a future proxy adds — the leak arrives
 * by default and nothing fails. An allowlist fails closed: a new header is
 * simply not logged until someone adds it here and says why.
 *
 * `authorization` and `cookie` are absent from this list, so they cannot be
 * emitted at all; the spec asserts it rather than leaving it to be re-derived.
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

export interface SerializedResponseLog {
  statusCode: number;
}

/**
 * Builds the `res` object on every completion line: the status, nothing else.
 *
 * pino-http's default `res` serializer adds every response header — `vary`,
 * `access-control-expose-headers`, `x-request-id`, `content-type`,
 * `content-length`, `etag` — about half of each line. None earns its place:
 * `x-request-id` repeats `req.id` on the same line, `vary` and the CORS header
 * are the same on every response, and an etag or a content type answers no
 * question asked of these logs. Response time is already `responseTime`.
 *
 * @param res - the finished response
 * @returns the `res` object for the log line
 */
export function serializeResponseLog(res: {
  statusCode: number;
}): SerializedResponseLog {
  return { statusCode: res.statusCode };
}

/**
 * Where an exception filter leaves what it knows about a failed request, for
 * the request's own completion line to carry.
 *
 * A failed request gets **one** log line: pino-http's completion line, which
 * already holds the method, url, status, response time and request id. The
 * filters do not log; they attach. A filter's own line would record each
 * failure twice, and for a 5xx pino-http — finding no `res.err` — would put an
 * invented `failed with status code 500` error on its line in place of the
 * real one, so counting error lines would count every failure twice.
 */
const FAILURE_LOG_KEY = "failureLog";

interface FailureCarrier {
  locals?: Record<string, unknown>;
  err?: unknown;
}

function toError(thrown: unknown): Error {
  if (thrown instanceof Error) return thrown;
  return new Error(typeof thrown === "string" ? thrown : inspect(thrown));
}

/**
 * Attaches a failure's fields — and, for a server error, the exception itself —
 * to the response, for {@link failureLogProps} and pino-http to log.
 *
 * `err` goes on `res.err`, which pino-http reads in place of the synthetic
 * error it otherwise builds for a 5xx, so the line carries the real type,
 * message and stack. A non-Error throw is wrapped, because pino's `err`
 * serializer expects an Error; an object is inspected, so its contents are kept.
 *
 * @param res - the response the failure is being written to
 * @param fields - the fields the completion line should gain
 * @param err - the exception, for 5xx failures only
 */
export function attachFailureLog(
  res: FailureCarrier,
  fields: Record<string, unknown>,
  err?: unknown,
): void {
  res.locals ??= {};
  res.locals[FAILURE_LOG_KEY] = fields;
  if (err !== undefined) {
    res.err = toError(err);
  }
}

/**
 * pino-http's `customProps`: the fields a filter attached, or none.
 *
 * pino-http calls it twice per request — when the request arrives, before any
 * filter has run, and when the response finishes. Only the second call finds
 * anything, so only the completion line gains the fields.
 *
 * @param _req - unused; required by pino-http's signature
 * @param res - the response, possibly carrying a filter's fields
 * @returns the fields to merge into the log line
 */
export function failureLogProps(
  _req: unknown,
  res: FailureCarrier,
): Record<string, unknown> {
  const fields = res.locals?.[FAILURE_LOG_KEY];
  return typeof fields === "object" && fields !== null
    ? (fields as Record<string, unknown>)
    : {};
}

/**
 * pino-http's `customLogLevel`: `error` for a 5xx or an errored response,
 * `warn` for a 4xx, `info` otherwise.
 *
 * pino-http's default logs a 4xx at `info`, indistinguishable by level from a
 * 200. The completion line is the only line a 4xx produces, so it has to carry
 * the `warn` that marks it as a failure.
 *
 * @param _req - unused; required by pino-http's signature
 * @param res - the finished response
 * @param err - an error pino-http observed on the response, if any
 * @returns the pino level for the completion line
 */
export function requestLogLevel(
  _req: unknown,
  res: { statusCode: number },
  err?: unknown,
): "error" | "warn" | "info" {
  if (err !== undefined || res.statusCode >= 500) return "error";
  if (res.statusCode >= 400) return "warn";
  return "info";
}
