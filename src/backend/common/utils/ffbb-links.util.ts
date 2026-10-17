// src/backend/common/utils/ffbb-links.util.ts

/** The FFBB competitions site, where every league, committee and club has a page. */
const FFBB_COMPETITIONS_URL = "https://competitions.ffbb.com";

/**
 * An FFBB club code: the league's three-letter code, the committee's four
 * digits, then the club's own number — `SUD0013011` is club 011 of committee
 * 0013 in league SUD. Merged committees keep one code for every department
 * they cover (Aveyron and Lozère are both `OCC1248`), which is why a
 * committee's page is read off one of its clubs rather than off its department.
 */
const CLUB_CODE = /^([A-Z]{3})\d{7}$/;

/**
 * The page of a league on the FFBB competitions site.
 *
 * Read off a club code rather than the league's region code: the two agree
 * for every league but one — the region is `PCA`, FFBB's league is `SUD`.
 *
 * @param clubCode - the FFBB code of any club of the league
 * @returns the page URL, or null when the code is missing or malformed
 */
export function ffbbLeagueUrl(clubCode: string | null): string | null {
  const match = clubCode ? CLUB_CODE.exec(clubCode) : null;
  if (!match) return null;
  return `${FFBB_COMPETITIONS_URL}/ligues/${match[1].toLowerCase()}`;
}

/**
 * The page of a committee on the FFBB competitions site.
 *
 * @param clubCode - the FFBB code of any club of the committee
 * @returns the page URL, or null when the code is missing or malformed
 */
export function ffbbCommitteeUrl(clubCode: string | null): string | null {
  const leagueUrl = ffbbLeagueUrl(clubCode);
  if (!leagueUrl || !clubCode) return null;
  return `${leagueUrl}/comites/${clubCode.slice(3, 7)}`;
}

/**
 * The page of a club on the FFBB competitions site.
 *
 * @param clubCode - the club's FFBB code, e.g. `SUD0013011`
 * @returns the page URL, or null when the code is missing or malformed
 */
export function ffbbClubUrl(clubCode: string | null): string | null {
  const committeeUrl = ffbbCommitteeUrl(clubCode);
  if (!committeeUrl || !clubCode) return null;
  return `${committeeUrl}/clubs/${clubCode.toLowerCase()}`;
}
