// src/backend/modules/organizations/clubs/clubs.service.ts
import { Category, CompetitionLevel, Gender } from "@common/constants";
import { PaginatedResponseDto } from "@common/dto";
import {
  assignRankByCount,
  buildClubOrganizationWhere,
  ffbbClubUrl,
  nameContains,
  PRESIDENT_SELECT,
  resolvePagination,
} from "@common/utils";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../../prisma/generated/prisma/client";
import {
  ClubBasicResponseDto,
  ClubDetailedResponseDto,
  ClubStatsByDepartmentDto,
  ClubStatsByRegionDto,
} from "./dto/clubs.response.dto";

/**
 * Fields to select from the clubs table for basic view.
 * Used for map initialization and paginated list endpoints.
 * Note: latitude and longitude are inferred as Prisma.Decimal by Prisma.
 */
const CLUB_BASIC_SELECT = {
  id: true,
  name: true,
  city: true,
  zipCode: true,
  latitude: true,
  longitude: true,
  email: true,
  phone: true,
  website: true,
  committeeId: true,
  committee: { select: { leagueId: true } },
} satisfies Prisma.ClubsDefaultArgs["select"];

type ClubBasicSelectResult = Prisma.ClubsGetPayload<{
  select: typeof CLUB_BASIC_SELECT;
}>;

/**
 * Fields to select from the clubs table for detailed view: the club and its
 * teams with their pool and championship. Standings are read separately, a
 * whole pool at a time, since a rank depends on the pool's other teams.
 */
const CLUB_DETAILED_SELECT = {
  id: true,
  name: true,
  city: true,
  zipCode: true,
  address: true,
  phone: true,
  email: true,
  website: true,
  code: true,
  teams: {
    select: {
      id: true,
      number: true,
      category: true,
      gender: true,
      poolId: true,
      pool: {
        select: {
          id: true,
          name: true,
          letter: true,
          championship: {
            select: {
              id: true,
              name: true,
              level: true,
              division: true,
              committeeId: true,
              leagueId: true,
            },
          },
        },
      },
    },
    orderBy: { number: "asc" },
  },
  president: PRESIDENT_SELECT,
} satisfies Prisma.ClubsDefaultArgs["select"];

type ClubDetailedSelectResult = Prisma.ClubsGetPayload<{
  select: typeof CLUB_DETAILED_SELECT;
}>;

/** A team's standings row, as the club page shows it. */
const STANDING_SELECT = {
  teamId: true,
  poolId: true,
  points: true,
  gamesPlayed: true,
  gamesWon: true,
  gamesLost: true,
  pointDifference: true,
} satisfies Prisma.LeaderboardsDefaultArgs["select"];

type Standing = Prisma.LeaderboardsGetPayload<{
  select: typeof STANDING_SELECT;
}>;

/** A standings row with its rank in the pool and the pool's size. */
type RankedStanding = Standing & { rank: number; poolSize: number };

/**
 * Service handling business logic for clubs.
 * Encapsulates database access and domain logic.
 */
@Injectable()
export class ClubsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves club statistics grouped by region (league).
   * Aggregates club counts from committees up to leagues.
   *
   * @returns Array of club statistics by region
   */
  async getClubCountsByRegion(): Promise<ClubStatsByRegionDto[]> {
    // Get club counts grouped by committee
    const clubCountsByCommittee = await this.prisma.client.clubs.groupBy({
      by: ["committeeId"],
      _count: {
        id: true,
      },
    });

    // Get committee to league mapping
    const committees = await this.prisma.client.committees.findMany({
      select: {
        id: true,
        leagueId: true,
      },
    });

    const committeeToLeague = new Map<number, number | null>(
      committees.map((c) => [c.id, c.leagueId]),
    );

    // Aggregate counts by league
    const leaguesCounts = new Map<number, number>();
    for (const item of clubCountsByCommittee) {
      if (typeof item.committeeId !== "number") continue;
      const leagueId = committeeToLeague.get(item.committeeId);
      if (typeof leagueId === "number") {
        leaguesCounts.set(
          leagueId,
          (leaguesCounts.get(leagueId) || 0) + item._count.id,
        );
      }
    }

    // Get league details with region codes
    const leagues = await this.prisma.client.leagues.findMany({
      select: {
        id: true,
        name: true,
        region: {
          select: {
            code: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return leagues.map((league) => ({
      id: league.id,
      code: league.region?.code ?? null,
      name: league.name,
      clubCount: leaguesCounts.get(league.id) || 0,
    }));
  }

  /**
   * Retrieves club statistics grouped by department (committee).
   * Optionally filters by league.
   *
   * @param leagueId - Optional league ID to filter by
   * @returns Array of club statistics by department
   */
  async getClubCountsByDepartment(
    leagueId?: number,
  ): Promise<ClubStatsByDepartmentDto[]> {
    const where: Prisma.CommitteesWhereInput = leagueId ? { leagueId } : {};

    const committees = await this.prisma.client.committees.findMany({
      where,
      select: {
        id: true,
        name: true,
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        leagueId: true,
        _count: {
          select: {
            clubs: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return committees.map((committee) => ({
      id: committee.id,
      name: committee.name,
      department: {
        id: committee.department.id,
        name: committee.department.name,
        code: committee.department.code,
      },
      leagueId: committee.leagueId,
      clubCount: committee._count.clubs,
    }));
  }

  /**
   * Retrieves all clubs without filtering.
   * Used for map initialization where all club coordinates are needed at once.
   *
   * @returns Flat array of all clubs
   */
  async findAllClubs(): Promise<ClubBasicResponseDto[]> {
    const clubs = await this.prisma.client.clubs.findMany({
      select: CLUB_BASIC_SELECT,
      orderBy: { name: "asc" },
    });

    return clubs.map((club) => this.mapToBasicDto(club));
  }

  /**
   * Finds clubs based on various filters.
   * Supports filtering by competition level, committee, league, category, and gender.
   *
   * @param filters - Filter criteria
   * @returns Array of clubs matching the filters
   */
  async findClubsByFilters(filters: {
    level?: CompetitionLevel;
    committeeId?: number;
    leagueId?: number;
    category?: Category;
    gender?: Gender;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponseDto<ClubBasicResponseDto>> {
    const { page, limit, skip } = resolvePagination(filters);

    // Build where clause for clubs
    const where: Prisma.ClubsWhereInput = {
      ...buildClubOrganizationWhere(filters),
    };

    if (filters.search) {
      where.name = nameContains(filters.search);
    }

    // Build teams filter if category, gender, or level specified
    const teamsWhere: Prisma.TeamsWhereInput = {};
    if (filters.category) teamsWhere.category = filters.category;
    if (filters.gender) teamsWhere.gender = filters.gender;
    if (filters.level)
      teamsWhere.pool = { championship: { level: filters.level } };

    if (Object.keys(teamsWhere).length > 0) {
      where.teams = { some: teamsWhere };
    }

    const [clubs, total] = await Promise.all([
      this.prisma.client.clubs.findMany({
        where,
        select: CLUB_BASIC_SELECT,
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
      this.prisma.client.clubs.count({ where }),
    ]);

    return {
      items: clubs.map((club) => this.mapToBasicDto(club)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Finds a club by its ID with detailed information including teams, each
   * with its rank and record in its pool.
   *
   * The standings of every pool the club plays in are read in one query and
   * ranked in memory with the same rule as the pool standings endpoint
   * (`assignRankByCount`), so a team's rank here and in its pool's table
   * cannot disagree. Pools hold about ten teams, so this is a few hundred rows
   * at most, against two count queries per team before.
   *
   * @param clubId - The club ID
   * @returns Detailed club information
   */
  async findClubById(clubId: number): Promise<ClubDetailedResponseDto> {
    const club = await this.prisma.client.clubs.findUnique({
      where: { id: clubId },
      select: CLUB_DETAILED_SELECT,
    });

    if (!club) {
      throw new NotFoundException(`Club with ID ${clubId} not found`);
    }

    const standings = await this.findRankedStandings(club.teams);

    return this.mapToDetailedDto(club, standings);
  }

  /**
   * Ranks every pool the given teams play in, and returns each of those teams'
   * ranked row, keyed by team id. A team without a pool or without a row is
   * absent from the map.
   */
  private async findRankedStandings(
    teams: { id: number; poolId: number | null }[],
  ): Promise<Map<number, RankedStanding>> {
    const poolIds = [...new Set(teams.flatMap((team) => team.poolId ?? []))];
    if (poolIds.length === 0) return new Map();

    const rows = await this.prisma.client.leaderboards.findMany({
      where: { poolId: { in: poolIds } },
      select: STANDING_SELECT,
    });

    const byPool = new Map<number, Standing[]>();
    for (const row of rows) {
      byPool.set(row.poolId, [...(byPool.get(row.poolId) ?? []), row]);
    }

    const ranked = new Map<number, RankedStanding>();
    for (const poolRows of byPool.values()) {
      for (const row of assignRankByCount(poolRows)) {
        ranked.set(row.teamId, { ...row, poolSize: poolRows.length });
      }
    }

    const teamIds = new Set(teams.map((team) => team.id));
    return new Map([...ranked].filter(([teamId]) => teamIds.has(teamId)));
  }

  /**
   * Maps a basic club entity to a response DTO.
   * Converts Prisma Decimal types to numbers.
   *
   * @param club - Prisma club select result
   * @returns ClubBasicResponseDto
   */
  private mapToBasicDto(club: ClubBasicSelectResult): ClubBasicResponseDto {
    return {
      id: club.id,
      name: club.name,
      city: club.city,
      zipCode: club.zipCode,
      latitude: club.latitude ? club.latitude.toNumber() : null,
      longitude: club.longitude ? club.longitude.toNumber() : null,
      // Presence, not value — see ClubBasicResponseDto. The columns are
      // still selected because that is what answers the question.
      hasEmail: Boolean(club.email),
      hasPhone: Boolean(club.phone),
      website: club.website,
      committeeId: club.committeeId,
      leagueId: club.committee.leagueId,
    };
  }

  /**
   * Maps a detailed club entity and its teams' ranked standings to a response
   * DTO.
   *
   * @param club - Prisma club select result
   * @param standings - each team's ranked standings row, keyed by team id
   * @returns ClubDetailedResponseDto
   */
  private mapToDetailedDto(
    club: ClubDetailedSelectResult,
    standings: Map<number, RankedStanding>,
  ): ClubDetailedResponseDto {
    return {
      id: club.id,
      name: club.name,
      city: club.city,
      zipCode: club.zipCode,
      address: club.address,
      phone: club.phone,
      email: club.email,
      website: club.website,
      ffbbUrl: ffbbClubUrl(club.code),
      teams: club.teams.map((team) => ({
        id: team.id,
        number: team.number,
        category: team.category as Category,
        gender: team.gender as Gender,
        pool: team.pool
          ? {
              id: team.pool.id,
              name: team.pool.name,
              letter: team.pool.letter,
              championship: {
                id: team.pool.championship.id,
                name: team.pool.championship.name,
                level: team.pool.championship.level as CompetitionLevel,
                division: team.pool.championship.division,
                committeeId: team.pool.championship.committeeId,
                leagueId: team.pool.championship.leagueId,
              },
            }
          : null,
        leaderboard: this.mapStanding(standings.get(team.id)),
      })),
      president: club.president,
    };
  }

  private mapStanding(standing: RankedStanding | undefined) {
    if (!standing) return null;

    return {
      rank: standing.rank,
      poolSize: standing.poolSize,
      points: standing.points,
      gamesPlayed: standing.gamesPlayed,
      gamesWon: standing.gamesWon,
      gamesLost: standing.gamesLost,
      pointDifference: standing.pointDifference,
      poolId: standing.poolId,
    };
  }
}
