// src/backend/common/constants/request-id-header.ts

/**
 * The header carrying the request correlation id, in and out.
 *
 * Named once because three places have to agree on it: `resolveRequestId`
 * reads it off the request and writes it back on the response, and
 * `main.ts`'s CORS `exposedHeaders` decides whether a cross-origin browser is
 * allowed to read it at all. A mismatch between those is silent — the header
 * is still sent, the browser just never sees it.
 *
 * Lower case is the value Node hands back from `req.headers`, and header
 * names are case-insensitive on the wire, so the same constant serves both
 * directions.
 */
export const REQUEST_ID_HEADER = "x-request-id";
