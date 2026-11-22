// src/frontend/features/organizations/utils/distinctOfficialName.ts
import { namesMatch } from "./namesMatch";

/**
 * The federation's name for an organisation, when it says something its
 * place name does not. Leagues and committees are headed by their region or
 * department, so `"BRETAGNE"` under "Bretagne" adds nothing, while `"SUD"`
 * under "Provence-Alpes-Côte d'Azur" does.
 *
 * @param officialName - the formatted federation name (`formatLeagueName`, `formatCommitteeName`)
 * @param placeName - the region or department name the page is headed by
 * @returns `officialName`, or `null` when it only repeats `placeName`
 */
export function distinctOfficialName(
  officialName: string,
  placeName: string,
): string | null {
  return namesMatch(officialName, placeName) ? null : officialName;
}
