// src/frontend/shared/utils/toSafeExternalUrl.ts

/**
 * The only schemes an externally-sourced link may use.
 *
 * `javascript:` is the one that matters: a `javascript:` value in an `href`
 * executes in this origin when clicked. React warns about it in development
 * but does not reliably block it, so the warning is not a control. `data:`
 * and `vbscript:` are here for the same reason.
 */
const SAFE_PROTOCOLS = new Set(["http:", "https:"]);

/**
 * Returns `url` if it is an absolute http(s) URL, otherwise `undefined`.
 *
 * Use this for any URL the application did not construct itself. Today that
 * means `club.website`, a `VarChar(255)` filled by the FFBB scraper — every
 * club is `null` in production because the scraper does not populate it yet,
 * which is exactly why the check belongs here *before* a scrape refresh starts
 * filling the column rather than after.
 *
 * A value with no scheme (`www.example.com`) is rejected rather than repaired.
 * Prefixing `https://` would be guessing at what a scraped string meant, and
 * such a value is already broken today: without a scheme the browser resolves
 * it relative to this origin, producing a link to a path on our own site.
 * Rejecting it loses nothing and keeps this function a check rather than a
 * transformation.
 *
 * Hrefs the application builds itself — `mailto:`, `tel:` — do not go through
 * here. They are not untrusted input; their scheme is written in the code.
 *
 * @param url - an externally-sourced value, possibly absent
 * @returns the URL unchanged when it is absolute http(s), otherwise `undefined` — never a repaired one
 */
export function toSafeExternalUrl(
  url: string | null | undefined,
): string | undefined {
  if (!url) return undefined;

  try {
    // Absolute-only: no base argument, so a relative or scheme-less value
    // throws rather than being resolved against the current page.
    return SAFE_PROTOCOLS.has(new URL(url).protocol) ? url : undefined;
  } catch {
    return undefined;
  }
}
