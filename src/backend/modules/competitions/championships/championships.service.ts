// src/backend/modules/competitions/championships/championships.service.ts
import { Category, CompetitionLevel, Gender } from "@common/constants";
import { PaginatedResponseDto } from "@common/dto";
import {
  andWhere,
  buildChampionshipWhere,
  buildClubOrganizationWhere,
  resolvePagination,
} from "@common/utils";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../../prisma/generated/prisma/client";
import type { GetChampionshipsQueryDto } from "./dto/championships.query.dto";
import { ChampionshipResponseDto } from "./dto/championships.response.dto";

/**
 * Fields to select from the championships table.
 * Single source of truth for consistent queries.
 */
const CHAMPIONSHIP_SELECT = {
  id: true,
  category: true,
  gender: true,
  seasonYear: true,
  level: true,
  division: true,
  pools: {
    orderBy: { letter: "asc" },
    select: {
      id: true,
      letter: true,
      // One team gives the organiser: every team in a departmental
      // championship belongs to the same committee, and in a regional one to
      // the same league. The matchday counts come from `countMatchdaysByPool`.
      teams: {
        take: 1,
        select: {
          club: {
            select: {
              committee: {
                select: {
                  id: true,
                  name: true,
                  departmentName: true,
                  league: {
                    select: { id: true, name: true, regionName: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

/**
 * Type representing the Prisma championship select result.
 * This matches exactly what Prisma returns from the select query.
 */
type ChampionshipSelectResult = Prisma.ChampionshipsGetPayload<{
  select: typeof CHAMPIONSHIP_SELECT;
}>;

/** The organising committee of a team's club, with its league. */
type TeamCommittee =
  ChampionshipSelectResult["pools"][number]["teams"][number]["club"]["committee"];

/**
 * Who organises a championship, read off one of its teams. A league organises
 * a regional championship, and a committee, within its league, a departmental
 * one. A national championship has no organiser.
 *
 * @param level - the championship's level
 * @param committee - the committee of one of its teams, if it has any
 * @returns the organiser fields of the response, null where they do not apply
 */
function resolveOrganiser(
  level: string,
  committee: TeamCommittee | undefined,
): Pick<
  ChampionshipResponseDto,
  | "leagueId"
  | "committeeId"
  | "leagueName"
  | "committeeName"
  | "regionName"
  | "departmentName"
> {
  const noCommittee = {
    committeeId: null,
    committeeName: null,
    departmentName: null,
  };
  if (!committee || level === CompetitionLevel.NATIONAL) {
    return {
      ...noCommittee,
      leagueId: null,
      leagueName: null,
      regionName: null,
    };
  }

  const league = {
    leagueId: committee.league.id,
    leagueName: committee.league.name,
    regionName: committee.league.regionName,
  };
  if (level === CompetitionLevel.REGIONAL) return { ...noCommittee, ...league };

  return {
    ...league,
    committeeId: committee.id,
    committeeName: committee.name,
    departmentName: committee.departmentName,
  };
}

/**
 * Service handling business logic for championships.
 * Encapsulates database access and domain logic.
 */
@Injectable()
export class ChampionshipsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds championships with optional filters and pagination.
   *
   * @param filters - Optional filter and pagination criteria
   * @returns Paginated list of championship DTOs
   */
  async findChampionships(
    filters: GetChampionshipsQueryDto = {},
  ): Promise<PaginatedResponseDto<ChampionshipResponseDto>> {
    const { page, limit, skip } = resolvePagination(filters);
    const where = this.buildWhereClause(filters);

    const [championships, total] = await Promise.all([
      this.prisma.client.championships.findMany({
        where,
        select: CHAMPIONSHIP_SELECT,
        orderBy: [{ division: "asc" }, { category: "asc" }, { id: "asc" }],
        skip,
        take: limit,
      }),
      this.prisma.client.championships.count({ where }),
    ]);

    const matchdays = await this.countMatchdaysByPool(championships);

    return {
      items: championships.map((c) => this.mapToDto(c, matchdays)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Finds a championship by its ID.
   *
   * @param championshipId - The championship ID
   * @returns Championship DTO
   * @throws NotFoundException if championship doesn't exist
   */
  async findChampionshipById(
    championshipId: number,
  ): Promise<ChampionshipResponseDto> {
    const championship = await this.prisma.client.championships.findUnique({
      where: { id: championshipId },
      select: CHAMPIONSHIP_SELECT,
    });

    if (!championship) {
      throw new NotFoundException(
        `Championship with ID ${championshipId} not found`,
      );
    }

    const matchdays = await this.countMatchdaysByPool([championship]);

    return this.mapToDto(championship, matchdays);
  }

  /**
   * Counts each pool's matchdays in one grouped query. Every match has exactly
   * one home team, and a team plays in one pool, so a pool's matches are those
   * its teams host.
   *
   * @param championships - the championships whose pools to count
   * @returns the number of distinct matchdays by pool id; a pool with no
   *   schedule is absent
   */
  private async countMatchdaysByPool(
    championships: readonly ChampionshipSelectResult[],
  ): Promise<Map<number, number>> {
    const poolIds = championships.flatMap((c) => c.pools.map((p) => p.id));
    if (poolIds.length === 0) return new Map();

    const rows = await this.prisma.client.$queryRaw<
      { poolId: number; matchdays: number }[]
    >`
      SELECT t.pool_id AS "poolId", COUNT(DISTINCT m.matchday)::int AS matchdays
      FROM matches m
      JOIN teams t ON t.id = m.home_team_id
      WHERE t.pool_id = ANY(${poolIds})
      GROUP BY t.pool_id
    `;
    return new Map(rows.map((row) => [row.poolId, row.matchdays]));
  }

  /**
   * Builds the Prisma where clause from filters. `leagueId` and `committeeId`
   * name the organiser, which is found through the championship's teams.
   *
   * A regional championship has teams from several committees without being
   * organised by any of them, so `committeeId` also keeps to the departmental
   * level. A national one has teams from several leagues, so `leagueId` leaves
   * it out.
   *
   * @param filters - Championship filters
   * @returns Prisma where clause
   */
  private buildWhereClause(
    filters: GetChampionshipsQueryDto,
  ): Prisma.ChampionshipsWhereInput {
    const scope: Prisma.ChampionshipsWhereInput = {
      ...buildChampionshipWhere(filters),
    };
    const club = buildClubOrganizationWhere(filters);
    if (!club) return scope;

    return (
      andWhere<Prisma.ChampionshipsWhereInput>(
        scope,
        filters.committeeId
          ? { level: CompetitionLevel.DEPARTMENTAL }
          : { level: { not: CompetitionLevel.NATIONAL } },
        { pools: { some: { teams: { some: { club } } } } },
      ) ?? {}
    );
  }

  /**
   * Maps a Prisma championship entity to a response DTO.
   * Centralizes the mapping logic and handles null values.
   * The `satisfies` operator ensures compile-time type checking.
   *
   * @param entity - Prisma championship select result
   * @param matchdays - each pool's matchday count, by pool id
   * @returns ChampionshipResponseDto
   */
  private mapToDto(
    entity: ChampionshipSelectResult,
    matchdays: ReadonlyMap<number, number>,
  ): ChampionshipResponseDto {
    return {
      id: entity.id,
      category: entity.category as Category,
      gender: entity.gender as Gender,
      seasonYear: entity.seasonYear,
      level: entity.level as CompetitionLevel,
      division: entity.division,
      ...resolveOrganiser(
        entity.level,
        entity.pools.flatMap((pool) => pool.teams).at(0)?.club.committee,
      ),
      pools: entity.pools.map((p) => ({
        id: p.id,
        letter: p.letter,
        nbMatchdays: matchdays.get(p.id) ?? 0,
      })),
    } satisfies ChampionshipResponseDto; // TypeScript validates this matches
  }
}
