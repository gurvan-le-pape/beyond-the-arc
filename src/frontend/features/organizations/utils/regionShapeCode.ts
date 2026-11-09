// src/frontend/features/organizations/utils/regionShapeCode.ts
import { FRANCE_REGIONS } from "@/features/geography/constants";

import { namesMatch } from "./namesMatch";

/**
 * The code of the region shape a league covers, matched on the region's name
 * the way `namesMatch` compares names.
 *
 * @param regionName - the league's region name, as the API spells it
 * @returns the shape's code, or `undefined` when no shape carries that name
 */
export function regionShapeCode(regionName: string): string | undefined {
  return FRANCE_REGIONS.find((shape) => namesMatch(shape.name, regionName))
    ?.code;
}
