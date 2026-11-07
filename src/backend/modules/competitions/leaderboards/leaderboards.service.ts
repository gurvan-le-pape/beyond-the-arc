// src/backend/modules/competitions/leaderboards/leaderboards.service.ts
import { computeStandings, STANDING_MATCH_SELECT } from "@common/utils";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import { LeaderboardResponseDto } from "./dto/leaderboards.response.dto";
import { buildRecentForm } from "./recent-form";

/** The fields of a team that a standings row shows. */
const TEAM_SELECT = {
  id: true,
  number: true,
  club: { select: { name: true } },
} as const;

/**
 * Service computing a pool's standings from its teams and completed matches.
 */
@Injectable()
export class LeaderboardsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds the standings of a pool, best first: by points, then point
   * difference. Every team in the pool has a row, played or not.
   *
   * @param poolId - The pool ID
   * @returns Array of leaderboard entry DTOs, empty for an unknown pool
   */
  async findLeaderboardsByPoolId(
    poolId: number,
  ): Promise<LeaderboardResponseDto[]> {
    const [teams, completedMatches] = await Promise.all([
      this.prisma.client.teams.findMany({
        where: { poolId },
        select: TEAM_SELECT,
      }),
      this.prisma.client.matches.findMany({
        where: { poolId, status: "completed" },
        select: { id: true, ...STANDING_MATCH_SELECT },
        orderBy: { startsAt: "desc" },
      }),
    ]);
    const teamById = new Map(teams.map((team) => [team.id, team]));
    const formByTeam = buildRecentForm(completedMatches);

    return computeStandings([...teamById.keys()], completedMatches).map(
      (standing) => {
        // Every row comes from a key of this map.
        const team = teamById.get(standing.teamId)!;
        return {
          ...standing,
          teamNumber: team.number,
          clubName: team.club.name,
          form: formByTeam.get(standing.teamId) ?? [],
        } satisfies LeaderboardResponseDto;
      },
    );
  }
}
