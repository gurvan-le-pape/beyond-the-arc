// src/backend/modules/competitions/leaderboards/leaderboards.service.ts
import { assignRankByCount, buildRankCountWhere } from "@common/utils";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../../prisma/generated/prisma/client";
import { LeaderboardResponseDto } from "./dto/leaderboards.response.dto";
import { buildRecentForm, FORM_LENGTH, type FormResult } from "./recent-form";

/**
 * Fields to select from the leaderboards table.
 * Single source of truth for consistent queries.
 */
const LEADERBOARD_SELECT = {
  id: true,
  teamId: true,
  poolId: true,
  points: true,
  gamesPlayed: true,
  gamesWon: true,
  gamesLost: true,
  gamesForfeited: true,
  pointsFor: true,
  pointsAgainst: true,
  pointDifference: true,
  team: {
    select: {
      number: true,
      club: {
        select: {
          name: true,
        },
      },
    },
  },
} as const;

/**
 * Type representing the Prisma leaderboard select result.
 * This matches exactly what Prisma returns from the select query.
 */
type LeaderboardSelectResult = Prisma.LeaderboardsGetPayload<{
  select: typeof LEADERBOARD_SELECT;
}>;

/** The fields of a match that decide its result, for each team's form. */
const FORM_MATCH_SELECT = {
  homeTeamId: true,
  awayTeamId: true,
  homeTeamScore: true,
  awayTeamScore: true,
} as const;

/**
 * Service handling business logic for leaderboards.
 * Encapsulates database access and domain logic.
 */
@Injectable()
export class LeaderboardsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds all leaderboard entries for a specific pool.
   * Results are sorted by points (descending) and point difference (descending).
   *
   * @param poolId - The pool ID
   * @returns Array of leaderboard entry DTOs
   */
  async findLeaderboardsByPoolId(
    poolId: number,
  ): Promise<LeaderboardResponseDto[]> {
    const [leaderboards, completedMatches] = await Promise.all([
      this.prisma.client.leaderboards.findMany({
        where: { poolId },
        select: LEADERBOARD_SELECT,
        orderBy: [{ points: "desc" }, { pointDifference: "desc" }],
      }),
      this.prisma.client.matches.findMany({
        where: { poolId, status: "completed" },
        select: FORM_MATCH_SELECT,
        orderBy: { startsAt: "desc" },
      }),
    ]);
    const formByTeam = buildRecentForm(completedMatches);

    // Competition ranking: ties share a rank (same formula as by-id below)
    return assignRankByCount(leaderboards).map((entry) =>
      this.mapToDto(entry, entry.rank, formByTeam.get(entry.teamId) ?? []),
    );
  }

  /**
   * Finds a leaderboard entry by its ID.
   *
   * @param leaderboardId - The leaderboard entry ID
   * @returns Leaderboard entry DTO
   * @throws NotFoundException if leaderboard entry doesn't exist
   */
  async findLeaderboardById(
    leaderboardId: number,
  ): Promise<LeaderboardResponseDto> {
    const leaderboard = await this.prisma.client.leaderboards.findUnique({
      where: { id: leaderboardId },
      select: LEADERBOARD_SELECT,
    });

    if (!leaderboard) {
      throw new NotFoundException(
        `Leaderboard entry with ID ${leaderboardId} not found`,
      );
    }

    const { teamId, poolId } = leaderboard;
    const [higher, recentMatches] = await Promise.all([
      // Compute rank via count query
      this.prisma.client.leaderboards.count({
        where: buildRankCountWhere(leaderboard),
      }),
      this.prisma.client.matches.findMany({
        where: {
          poolId,
          status: "completed",
          OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
        },
        select: FORM_MATCH_SELECT,
        orderBy: { startsAt: "desc" },
        take: FORM_LENGTH,
      }),
    ]);

    return this.mapToDto(
      leaderboard,
      higher + 1,
      buildRecentForm(recentMatches).get(teamId) ?? [],
    );
  }

  /**
   * Maps a Prisma leaderboard entity to a response DTO.
   * Centralizes the mapping logic and flattens nested relations.
   * The `satisfies` operator ensures compile-time type checking.
   *
   * @param leaderboard - Prisma leaderboard select result
   * @param rank - its position in the pool
   * @param form - its last results, oldest first
   * @returns LeaderboardResponseDto
   */
  private mapToDto(
    leaderboard: LeaderboardSelectResult,
    rank: number,
    form: FormResult[],
  ): LeaderboardResponseDto {
    return {
      id: leaderboard.id,
      teamId: leaderboard.teamId,
      rank,
      teamNumber: leaderboard.team.number,
      clubName: leaderboard.team.club.name,
      points: leaderboard.points,
      gamesPlayed: leaderboard.gamesPlayed,
      gamesWon: leaderboard.gamesWon,
      gamesLost: leaderboard.gamesLost,
      gamesForfeited: leaderboard.gamesForfeited,
      pointsFor: leaderboard.pointsFor,
      pointsAgainst: leaderboard.pointsAgainst,
      pointDifference: leaderboard.pointDifference,
      form,
    } satisfies LeaderboardResponseDto; // TypeScript validates this matches
  }
}
