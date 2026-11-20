// src/frontend/features/competitions/championships/utils/championshipFixtures.ts
import type { Championship } from "../types";

/**
 * A regional U18 men's division 1 championship, with whatever a test
 * overrides. Test-only: excluded from the barrel by its `Fixtures` suffix.
 *
 * @param id - the championship id, which the builders put in each `href`
 * @param overrides - the fields the test is about
 * @returns a complete championship
 */
export function championship(
  id: number,
  overrides: Partial<Championship> = {},
): Championship {
  return {
    id,
    category: "U18",
    gender: "male",
    seasonYear: "2026-2027",
    level: "regional",
    division: 1,
    leagueId: 10,
    committeeId: null,
    committeeName: null,
    leagueName: "Ligue de Bretagne",
    regionName: "Bretagne",
    departmentName: null,
    pools: [],
    ...overrides,
  };
}
