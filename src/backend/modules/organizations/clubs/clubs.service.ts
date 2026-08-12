// src/backend/modules/organizations/clubs/clubs.service.ts
import { Category, CompetitionLevel, Gender } from "@common/constants";
import { PaginatedResponseDto } from "@common/index";
import {
  buildClubOrganizationWhere,
  buildRankCountWhere,
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
 * Fields to select from the clubs table for detailed view.
 * Includes teams with their current pool, championship, and leaderboard.
 * Leaderboard is limited to 1 entry (current season) per team.
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
      leaderboards: {
        select: {
          points: true,
          gamesPlayed: true,
          gamesWon: true,
          gamesLost: true,
          pointDifference: true,
          poolId: true,
        },
        orderBy: { poolId: "desc" },
        take: 1, // current season only — one entry per pool per team
      },
    },
    orderBy: { number: "asc" },
  },
  president: PRESIDENT_SELECT,
} satisfies Prisma.ClubsDefaultArgs["select"];

type ClubDetailedSelectResult = Prisma.ClubsGetPayload<{
  select: typeof CLUB_DETAILED_SELECT;
}>;

type TeamWithRankAndPoolSize = ClubDetailedSelectResult["teams"][number] & {
  rank: number | null;
  poolSize: number | null;
};

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
      where.name = { contains: filters.search, mode: "insensitive" };
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
   * Finds a club by its ID with detailed information including teams.
   * Computes rank and pool size for each team via parallel count queries.
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

    // Compute rank and pool size for each team via parallel count queries
    const teamsWithRanks: TeamWithRankAndPoolSize[] = await Promise.all(
      club.teams.map(async (team) => {
        const lb = team.leaderboards[0];

        if (!lb || !team.pool) {
          return { ...team, rank: null, poolSize: null };
        }

        const [rank, poolSize] = await Promise.all([
          this.prisma.client.leaderboards.count({
            where: buildRankCountWhere(lb),
          }),
          this.prisma.client.leaderboards.count({
            where: { poolId: lb.poolId },
          }),
        ]);

        return { ...team, rank: rank + 1, poolSize };
      }),
    );

    return this.mapToDetailedDto({ ...club, teams: teamsWithRanks });
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
   * Maps a detailed club entity to a response DTO.
   * Handles nested relations and maps computed rank/poolSize
   * from TeamWithRankAndPoolSize into the singular leaderboard entry.
   *
   * @param club - Prisma club select result with teams enriched with rank and poolSize
   * @returns ClubDetailedResponseDto
   */
  private mapToDetailedDto(
    club: Omit<ClubDetailedSelectResult, "teams"> & {
      teams: TeamWithRankAndPoolSize[];
    },
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
      teams: club.teams.map((team) => ({
        id: team.id,
        number: team.number,
        category: team.category as Category,
        gender: team.gender as Gender,
        pool: team.pool
          ? {
              id: team.pool.id,
              name: team.pool.name,
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
        // singular leaderboard — one entry per team per pool
        leaderboard: team.leaderboards[0]
          ? {
              rank: team.rank,
              poolSize: team.poolSize,
              points: team.leaderboards[0].points,
              gamesPlayed: team.leaderboards[0].gamesPlayed,
              gamesWon: team.leaderboards[0].gamesWon,
              gamesLost: team.leaderboards[0].gamesLost,
              pointDifference: team.leaderboards[0].pointDifference,
              poolId: team.leaderboards[0].poolId,
            }
          : null,
      })),
      president: club.president,
    };
  }
}
