// src/frontend/features/teams/hooks/useTeamMatchHistoryColumns.tsx
import { useMatchHistoryColumns } from "@/features/matches/hooks";
import type { TableColumn } from "@/shared/components/table";

import type { Team } from "../types/Team";
import type { TeamMatchHistory } from "../types/TeamMatchHistory";

/**
 * Column definitions for a team's match-history table: date, opponent, and the
 * result from this team's side. Fixtures not yet played pass
 * `{ withResult: false }`, since they have no result to show.
 *
 * `team` is read only for its id, which the opponent column uses to render each
 * fixture from this team's side. Unlike the player equivalent there is no
 * fallback id — a team always has one.
 *
 * @param team - the team the table belongs to; supplies the opponent's perspective
 * @param options - `withResult: false` drops the result column, for fixtures
 * @returns column definitions, stable between renders
 */
export function useTeamMatchHistoryColumns(
  team: Team,
  { withResult = true }: { withResult?: boolean } = {},
): TableColumn<TeamMatchHistory>[] {
  // A fixture's start time is still worth knowing; a result's is not.
  return useMatchHistoryColumns<TeamMatchHistory>(team.id, {
    withTime: !withResult,
    withResult,
  });
}
