// src/backend/modules/organizations/clubs/clubs.service.ts
import { Category } from "@common/constants/categories";
import { CompetitionLevel } from "@common/constants/competition-levels";
import { Gender } from "@common/constants/genders";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

import {
  ClubBasicResponseDto,
  ClubDetailedResponseDto,
  ClubStatsByDepartmentDto,
  ClubStatsByRegionDto,
} from "./dto/clubs.response.dto";

/**
 * Type representing a basic club select result.
 * Note: latitude and longitude are Decimal types from Prisma (Prisma.Decimal)
 */
type ClubBasicSelectResult = {
  id: number;
  name: string;
  city: string | null;
  zipCode: string | null;
  latitude: Prisma.Decimal | null;
  longitude: Prisma.Decimal | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  committeeId: number;
  committee: { leagueId: number };
};

/**
 * Type representing a detailed club select result with teams.
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
          leaderboards: {
            select: { teamId: true, points: true },
            orderBy: { points: "desc" },
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
      },
    },
    orderBy: { number: "asc" },
  },
} as const;

type ClubDetailedSelectResult = Prisma.ClubsGetPayload<{
  select: typeof CLUB_DETAILED_SELECT;
}>;

/**
 * Type representing grouped club counts by committee.
 */
type ClubCountsByCommittee = {
  committeeId: number | null;
  _count: {
    id: number;
  };
};

/**
 * Service handling business logic for clubs.
 * Encapsulates database access and domain logic.
 */
@Injectable()
export class ClubsService {
  private readonly logger = new Logger(ClubsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves club statistics grouped by region (league).
   * Aggregates club counts from committees up to leagues.
   *
   * @returns Array of club statistics by region
   */
  async getClubCountsByRegion(): Promise<ClubStatsByRegionDto[]> {
    this.logger.log("Fetching club counts by region");

    try {
      // Get club counts grouped by committee
      const ClubCountsByCommittee = await this.prisma.clubs.groupBy({
        by: ["committeeId"],
        _count: {
          id: true,
        },
      });

      // Get committee to league mapping
      const committees = await this.prisma.committees.findMany({
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
      for (const item of ClubCountsByCommittee) {
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
      const leagues = await this.prisma.leagues.findMany({
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

      this.logger.log(`Found ${leagues.length} regions with club counts`);

      return leagues.map((league) => ({
        id: league.id,
        code: league.region?.code ?? null,
        name: league.name,
        clubCount: leaguesCounts.get(league.id) || 0,
      }));
    } catch (error) {
      this.logger.error("Failed to fetch club counts by region", error);
      throw new InternalServerErrorException(
        "Failed to fetch club statistics by region",
      );
    }
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
    const logMsg = leagueId
      ? `Fetching club counts by department for league ID: ${leagueId}`
      : "Fetching club counts by department for all leagues";
    this.logger.log(logMsg);

    try {
      const where: Prisma.CommitteesWhereInput = leagueId ? { leagueId } : {};

      const committees = await this.prisma.committees.findMany({
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

      this.logger.log(`Found ${committees.length} committees with club counts`);

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
    } catch (error) {
      this.logger.error("Failed to fetch club counts by department", error);
      throw new InternalServerErrorException(
        "Failed to fetch club statistics by department",
      );
    }
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
  }): Promise<ClubBasicResponseDto[]> {
    this.logger.log(`Fetching clubs with filters: ${JSON.stringify(filters)}`);

    try {
      // Build where clause for clubs
      const where: Prisma.ClubsWhereInput = {};

      // Filter by committee ID
      if (filters.committeeId) {
        where.committeeId = filters.committeeId;
      }

      // Filter by league ID (via committee relation)
      if (filters.leagueId) {
        where.committee = { leagueId: filters.leagueId };
      }

      // Build teams filter if category or gender specified
      const teamsWhere: Prisma.TeamsWhereInput = {};
      if (filters.category) teamsWhere.category = filters.category;
      if (filters.gender) teamsWhere.gender = filters.gender;

      const hasTeamsFilter = Object.keys(teamsWhere).length > 0;

      const clubs = await this.prisma.clubs.findMany({
        where,
        select: {
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
          committee: {
            select: { leagueId: true },
          },
          ...(hasTeamsFilter && {
            teams: {
              where: teamsWhere,
              select: { id: true },
            },
          }),
        },
        orderBy: {
          name: "asc",
        },
      });

      this.logger.log(`Found ${clubs.length} clubs matching filters`);

      return clubs.map((club) => this.mapToBasicDto(club));
    } catch (error) {
      this.logger.error("Failed to fetch clubs by filters", error);
      throw new InternalServerErrorException("Failed to fetch clubs");
    }
  }

  /**
   * Finds a club by its ID with detailed information including teams.
   *
   * @param clubId - The club ID
   * @returns Detailed club information
   * @throws NotFoundException if club doesn't exist
   */
  async findClubById(clubId: number): Promise<ClubDetailedResponseDto> {
    this.logger.log(`Fetching club with ID: ${clubId}`);

    try {
      const club = await this.prisma.clubs.findUnique({
        where: { id: clubId },
        select: {
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
                  leaderboards: {
                    select: {
                      teamId: true,
                      points: true,
                    },
                    orderBy: {
                      points: "desc",
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
              },
            },
            orderBy: {
              number: "asc",
            },
          },
        },
      });

      if (!club) {
        this.logger.warn(`Club with ID ${clubId} not found`);
        throw new NotFoundException(`Club with ID ${clubId} not found`);
      }

      return this.mapToDetailedDto(club);
    } catch (error) {
      this.logger.error(`Failed to fetch club with ID ${clubId}`, error);

      // Re-throw if it's already a NestJS exception
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      // Wrap unknown errors
      throw new InternalServerErrorException("Failed to fetch club");
    }
  }

  /**
   * Retrieves all departments (committees) with their basic information.
   * Used for loading all departments at once for the map view.
   *
   * @returns Array of all departments with region information
   */
  async getAllDepartments(): Promise<ClubStatsByDepartmentDto[]> {
    this.logger.log("Fetching all departments");

    try {
      const committees = await this.prisma.committees.findMany({
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
          league: {
            select: {
              id: true,
              regionId: true,
            },
          },
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

      this.logger.log(`Found ${committees.length} departments`);

      return committees.map((committee) => ({
        id: committee.id,
        name: committee.name,
        department: {
          id: committee.department.id,
          name: committee.department.name,
          code: committee.department.code,
        },
        leagueId: committee.leagueId,
        region: { id: committee.league.regionId },
        clubCount: committee._count.clubs,
      }));
    } catch (error) {
      this.logger.error("Failed to fetch all departments", error);
      throw new InternalServerErrorException("Failed to fetch all departments");
    }
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
      email: club.email,
      phone: club.phone,
      website: club.website,
      committeeId: club.committeeId,
      leagueId: club.committee.leagueId,
    };
  }

  /**
   * Maps a detailed club entity to a response DTO.
   * Handles complex nested relations.
   *
   * @param club - Prisma club select result with teams
   * @returns ClubDetailedResponseDto
   */
  private mapToDetailedDto(
    club: ClubDetailedSelectResult,
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
              leaderboards: team.pool.leaderboards.map((lb) => ({
                teamId: lb.teamId,
                points: lb.points,
              })),
            }
          : null,
        leaderboards: team.leaderboards.map((lb) => ({
          points: lb.points,
          gamesPlayed: lb.gamesPlayed,
          gamesWon: lb.gamesWon,
          gamesLost: lb.gamesLost,
          pointDifference: lb.pointDifference,
          poolId: lb.poolId,
        })),
      })),
    };
  }
}
