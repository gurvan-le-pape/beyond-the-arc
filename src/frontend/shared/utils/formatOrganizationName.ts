// src/frontend/shared/utils/formatOrganizationName.ts
/**
 * Strips the boilerplate FFBB carries on league names — the `REGIONALE` prefix
 * and the ` DE BASKET-BALL` suffix — leaving the region alone.
 *
 * Display only. The stored name is the asset lookup key elsewhere (see
 * `OrganizationHeader`), so never persist or match on the shortened form.
 *
 * @param name - the league name as scraped, e.g. `LIGUE REGIONALE DE BRETAGNE DE BASKET-BALL`
 * @returns the same name with the boilerplate removed and trimmed
 */
export function formatLeagueName(name: string): string {
  return name
    .replace(/REGIONALE /i, "")
    .replace(/ DE BASKET-BALL$/i, "")
    .trim();
}

/**
 * The committee counterpart of {@link formatLeagueName}. Committee names carry
 * only the ` DE BASKET-BALL` suffix, never the `REGIONALE` prefix, so the two
 * are not interchangeable.
 *
 * @param name - the committee name as scraped
 * @returns the same name with the suffix removed
 */
export function formatCommitteeName(name: string): string {
  return name.replace(/ DE BASKET-BALL$/i, "");
}
