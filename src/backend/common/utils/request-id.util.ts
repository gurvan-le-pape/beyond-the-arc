// src/backend/common/utils/request-id.util.ts
import { randomUUID } from "node:crypto";

import { REQUEST_ID_HEADER } from "@common/constants";

/**
 * What a caller-supplied request id has to look like to be reused: word
 * characters, dots and dashes, 128 at most.
 *
 * It admits every form that could realistically arrive — an RFC 4122 UUID,
 * Nginx's `$request_id` (32 hex characters), Cloudflare's `cf-ray` — and
 * nothing else. No caller sends one today.
 *
 * The reason for the check is not a crash. Measured on Node 24.15.0, a
 * hostile inbound value is simply echoed: `res.setHeader` threw for none of
 * `foo bar;drop`, a tab, a high byte, an empty string or 9,000 `a`s, and a
 * CR-LF never reaches userland because the HTTP parser truncates the value
 * first (no response splitting). What is left is still worth refusing —
 * without a bound, anything a caller sends is bound to that request's logger
 * and lands in every Loki line for 31 days, and is reflected back in a
 * response header of the caller's chosen size.
 *
 * The empty string is the case that matters most in practice: it is not
 * nullish, so it survives a null check. A request sending `x-request-id:`
 * would otherwise take an empty `req.id` and correlate to nothing.
 */
const SAFE_REQUEST_ID = /^[\w.-]{1,128}$/;

interface RequestWithHeaders {
  headers?: Record<string, unknown>;
}

interface ResponseWithHeaders {
  setHeader(name: string, value: string): unknown;
}

/**
 * Resolves the correlation id for a request and puts it on the response.
 *
 * Wired into pino-http's `genReqId`, which is called once per request before
 * anything else runs — including the `autoLogging.ignore` check — so every
 * response carries the header, and it carries the same value nestjs-pino
 * binds to that request's logger as `req.id`. That is the whole point: the
 * id a caller reads off a response is the id that reconstructs the request in
 * Loki (`{service="backend"} | json | req_id="…"`).
 *
 * `genReqId` rather than an interceptor firstly because this is where the id
 * is derived, and a second place that has to agree about what `req.id` is is
 * a second correlation mechanism. But also because an interceptor cannot
 * cover every response: interceptors are bound to a route handler, so a
 * request matching no route never reaches one — measured, `/api/no-such-thing`
 * gets a 404 that the global `HttpMetricsInterceptor` records no metric for —
 * and `TransformInterceptor` in particular is skipped wholesale by
 * `@SkipTransform` (`/metrics`) and never reaches its `map` when the handler
 * throws, which is the exception path, where the id is worth most.
 *
 * An inbound id is reused so a future edge (Nginx generating `$request_id`)
 * can propagate one end to end; anything that fails {@link SAFE_REQUEST_ID}
 * is replaced rather than rejected, since a malformed correlation id is not
 * worth failing a request over.
 */
export function resolveRequestId(
  req: RequestWithHeaders,
  res: ResponseWithHeaders,
): string {
  const inbound = req.headers?.[REQUEST_ID_HEADER];
  const id =
    typeof inbound === "string" && SAFE_REQUEST_ID.test(inbound)
      ? inbound
      : randomUUID();

  res.setHeader(REQUEST_ID_HEADER, id);

  return id;
}
