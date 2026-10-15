// src/backend/modules/matches/matches.service.ts
import {
  Category,
  COMPETITION_TIME_ZONE,
  CompetitionLevel,
  EventType,
  Gender,
  Role,
} from "@common/constants";
import { PaginatedResponseDto } from "@common/dto";
import {
  andWhere,
  buildClubOrganizationWhere,
  mapPlayerMatchStats,
  mapPlayerSummary,
  PLAYER_MATCH_STAT_FIELDS_SELECT,
  resolvePagination,
} from "@common/utils";
import { Injectable, NotFoundException } from "@nestjs/common";
import { fromZonedTime } from "date-fns-tz";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../prisma/generated/prisma/client";
import { aggregateTeamMatchStats } from "./aggregate-team-match-stats";
import type {
  MatchDetailResponseDto,
  MatchEventDto,
  MatchPlayerStatsResponseDto,
  MatchResponseDto,
  PlayerWithStatsDto,
} from "./dto/matches.response.dto";

export interface MatchFilters {
  level?: CompetitionLevel;
  division?: number;
  committeeId?: number;
  leagueId?: number;
  category?: Category;
  gender?: Gender;
  poolId?: number;
  championshipId?: number;
  matchday?: number;
  date?: string;
  search?: string;
  page?: number;
  limit?: number;
}

const MATCH_LIST_SELECT = {
  id: true,
  startsAt: true,
  matchday: true,
  pool: {
    select: {
      id: true,
      name: true,
      letter: true,
      championship: {
        select: {
          id: true,
          category: true,
          gender: true,
          level: true,
          division: true,
        },
      },
    },
  },
  homeTeam: {
    select: {
      id: true,
      number: true,
      club: {
        select: {
          id: true,
          name: true,
          committeeId: true,
          committee: {
            select: { leagueId: true },
          },
        },
      },
    },
  },
  awayTeam: {
    select: {
      id: true,
      number: true,
      club: {
        select: {
          id: true,
          name: true,
          committeeId: true,
          committee: {
            select: { leagueId: true },
          },
        },
      },
    },
  },
  homeTeamScore: true,
  awayTeamScore: true,
  forfeit: true,
  overtime: true,
} as const;

const MATCH_EVENT_SELECT = {
  id: true,
  eventType: true,
  occurredAt: true,
  description: true,
  players: {
    select: {
      role: true,
      player: {
        select: {
          id: true,
          name: true,
          number: true,
          team: {
            select: {
              id: true,
              club: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  },
  shotLocation: {
    select: {
      id: true,
      x: true,
      y: true,
    },
  },
} as const;

/**
 * Extended select for match detail — includes events.
 */
const MATCH_DETAIL_SELECT = {
  ...MATCH_LIST_SELECT,
  matchEvents: {
    select: MATCH_EVENT_SELECT,
    orderBy: { occurredAt: "asc" as const },
  },
} as const;

const PLAYER_MATCH_STATS_SELECT = {
  player: {
    select: {
      id: true,
      name: true,
      number: true,
      position: true,
      teamId: true,
      team: {
        select: {
          id: true,
          number: true,
          club: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
  ...PLAYER_MATCH_STAT_FIELDS_SELECT,
} as const;

/**
 * The roles of the player who took a shot: `shooter` on a made or missed shot,
 * `blocked` on a blocked one. Every other role on a shot event (assister,
 * blocker, fouler) belongs to someone who did not shoot.
 */
const SHOT_TAKER_ROLES: Role[] = [Role.SHOOTER, Role.BLOCKED];

type MatchListResult = Prisma.MatchesGetPayload<{
  select: typeof MATCH_LIST_SELECT;
}>;

type MatchDetailResult = Prisma.MatchesGetPayload<{
  select: typeof MATCH_DETAIL_SELECT;
}>;

type MatchEventResult = Prisma.MatchEventsGetPayload<{
  select: typeof MATCH_EVENT_SELECT;
}>;

type PlayerMatchStatsResult = Prisma.PlayerMatchStatsGetPayload<{
  select: typeof PLAYER_MATCH_STATS_SELECT;
}>;

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllMatches(
    filters?: MatchFilters,
  ): Promise<PaginatedResponseDto<MatchResponseDto>> {
    const { page, limit, skip } = resolvePagination(filters ?? {});
    const where = this.buildWhereClause(filters);

    const [matches, total] = await Promise.all([
      this.prisma.client.matches.findMany({
        where,
        select: MATCH_LIST_SELECT,
        orderBy: { startsAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.client.matches.count({ where }),
    ]);

    return {
      items: matches.map((m) => this.mapMatchToDto(m)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findMatchById(matchId: number): Promise<MatchDetailResponseDto> {
    const match = await this.prisma.client.matches.findUnique({
      where: { id: matchId },
      select: MATCH_DETAIL_SELECT,
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    return this.mapMatchDetailToDto(match);
  }

  async findMatchesByPoolId(poolId: number): Promise<MatchResponseDto[]> {
    const matches = await this.prisma.client.matches.findMany({
      where: { poolId },
      select: MATCH_LIST_SELECT,
      orderBy: { startsAt: "asc" },
    });

    return matches.map((m) => this.mapMatchToDto(m));
  }

  async findPlayerMatchStatsByMatchId(
    matchId: number,
  ): Promise<MatchPlayerStatsResponseDto> {
    const match = await this.prisma.client.matches.findUnique({
      where: { id: matchId },
      select: { homeTeamId: true, awayTeamId: true },
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    const stats = await this.prisma.client.playerMatchStats.findMany({
      where: { matchId },
      select: PLAYER_MATCH_STATS_SELECT,
    });

    const mappedStats = this.mapToPlayerStats(stats);
    const homeRows = mappedStats.filter(
      (s) => s.player.teamId === match.homeTeamId,
    );
    const awayRows = mappedStats.filter(
      (s) => s.player.teamId === match.awayTeamId,
    );

    return {
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      stats: mappedStats,
      homeTeamStats: aggregateTeamMatchStats(homeRows.map((s) => s.stats)),
      awayTeamStats: aggregateTeamMatchStats(awayRows.map((s) => s.stats)),
    };
  }

  async findMatchEventsByMatchId(matchId: number): Promise<MatchEventDto[]> {
    const events = await this.prisma.client.matchEvents.findMany({
      where: { matchId },
      select: MATCH_EVENT_SELECT,
      orderBy: { occurredAt: "asc" },
    });

    return events.map((e) => this.mapEventToDto(e));
  }

  /**
   * Every shot a team took, across its season.
   *
   * The match filter is a relation, not an `IN` list. Fetching the team's match
   * ids, materialising them in Node and sending them back as
   * `matchId: { in: [...] }` is a round trip and a hand-rolled join for
   * something the database does in one statement — and the id list is
   * caller-visible growth, bounded only because `Teams` is season-scoped
   * (22 matches for a team, measured on production).
   *
   * Only the team's own attempts count: one of its players must have taken the
   * shot (see `SHOT_TAKER_ROLES`). Matching any role would also pull in the
   * opponent's shots this team's defenders blocked or fouled.
   *
   * The match filter is kept rather than dropped. `players: { some: … }` already
   * restricts to events a player of this team took part in, and since a player
   * belongs to exactly one team, every such event is in a match that team
   * played — so the match clause is provably redundant *today*. It stays
   * because it is the clause that states the intent, and it costs nothing.
   */
  async findMatchEventsByTeamId(teamId: number): Promise<MatchEventDto[]> {
    const events = await this.prisma.client.matchEvents.findMany({
      where: {
        match: { OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }] },
        shotLocation: { isNot: null },
        players: {
          some: { player: { teamId }, role: { in: SHOT_TAKER_ROLES } },
        },
      },
      select: { ...MATCH_EVENT_SELECT, matchId: true },
      orderBy: { occurredAt: "asc" },
    });

    return events.map((e) => this.mapEventToDto(e));
  }

  /**
   * Every shot a player took, across their season.
   *
   * The player must have taken the shot (see `SHOT_TAKER_ROLES`). A made shot
   * also carries an `assister`, so matching the player in any role would put
   * the shots they assisted on their own chart, as made baskets.
   */
  async findMatchEventsByPlayerId(playerId: number): Promise<MatchEventDto[]> {
    const events = await this.prisma.client.matchEvents.findMany({
      where: {
        shotLocation: { isNot: null },
        players: { some: { playerId, role: { in: SHOT_TAKER_ROLES } } },
      },
      select: { ...MATCH_EVENT_SELECT, matchId: true },
      orderBy: { occurredAt: "asc" },
    });

    return events.map((e) => this.mapEventToDto(e));
  }

  /**
   * Maps a list query result to MatchResponseDto (no events).
   */
  private mapMatchToDto(match: MatchListResult): MatchResponseDto {
    return {
      id: match.id,
      startsAt: match.startsAt,
      matchday: match.matchday,
      homeTeamScore: match.homeTeamScore,
      awayTeamScore: match.awayTeamScore,
      forfeit: match.forfeit,
      overtime: match.overtime,
      pool: {
        id: match.pool.id,
        name: match.pool.name,
        letter: match.pool.letter,
        championship: {
          id: match.pool.championship.id,
          category: match.pool.championship.category as Category,
          gender: match.pool.championship.gender as Gender,
          level: match.pool.championship.level as CompetitionLevel,
          division: match.pool.championship.division,
        },
      },
      homeTeam: {
        id: match.homeTeam.id,
        number: match.homeTeam.number,
        club: {
          id: match.homeTeam.club.id,
          name: match.homeTeam.club.name,
          committeeId: match.homeTeam.club.committeeId,
          leagueId: match.homeTeam.club.committee.leagueId,
        },
      },
      awayTeam: {
        id: match.awayTeam.id,
        number: match.awayTeam.number,
        club: {
          id: match.awayTeam.club.id,
          name: match.awayTeam.club.name,
          committeeId: match.awayTeam.club.committeeId,
          leagueId: match.awayTeam.club.committee.leagueId,
        },
      },
    };
  }

  /**
   * Maps a detail query result to MatchDetailResponseDto (with events).
   */
  private mapMatchDetailToDto(
    match: MatchDetailResult,
  ): MatchDetailResponseDto {
    return {
      ...this.mapMatchToDto(match),
      matchEvents: match.matchEvents.map((e) => this.mapEventToDto(e)),
    };
  }

  private mapEventToDto(
    event: MatchEventResult & { matchId?: number },
  ): MatchEventDto {
    return {
      id: event.id,
      matchId: event.matchId,
      eventType: event.eventType as EventType,
      occurredAt: event.occurredAt,
      description: event.description,
      players: event.players.map((p) => ({
        role: p.role as Role,
        player: {
          id: p.player.id,
          name: p.player.name,
          number: p.player.number,
          team: {
            id: p.player.team.id,
            club: { name: p.player.team.club.name },
          },
        },
      })),
      shotLocation: event.shotLocation
        ? {
            id: event.shotLocation.id,
            x: event.shotLocation.x.toNumber(),
            y: event.shotLocation.y.toNumber(),
          }
        : null,
    };
  }

  private mapToPlayerStats(
    stats: PlayerMatchStatsResult[],
  ): PlayerWithStatsDto[] {
    return stats.map((stat) => ({
      player: {
        ...mapPlayerSummary(stat.player),
        team: stat.player.team,
      },
      stats: {
        ...mapPlayerMatchStats(stat),
        playtimeSeconds: this.calculatePlaytime(
          stat.playtimeIntervals as number[][] | null,
        ),
      },
    }));
  }

  private calculatePlaytime(intervals: number[][] | null): number {
    if (!intervals || intervals.length === 0) return 0;
    return intervals.reduce(
      (total, interval) => total + (interval[1] - interval[0]),
      0,
    );
  }

  private buildPoolFilter(
    filters?: MatchFilters,
  ): Prisma.PoolsWhereInput | undefined {
    if (filters?.poolId) return undefined;
    if (
      !filters?.level &&
      !filters?.division &&
      !filters?.category &&
      !filters?.gender
    )
      return undefined;

    const championship: Prisma.ChampionshipsWhereInput = {};
    if (filters?.level) championship.level = filters.level;
    if (filters?.division) championship.division = filters.division;
    if (filters?.category) championship.category = filters.category;
    if (filters?.gender) championship.gender = filters.gender;

    return { championship };
  }

  private buildOrganizationFilter(
    filters?: MatchFilters,
  ): Prisma.MatchesWhereInput[] | undefined {
    const club = buildClubOrganizationWhere(filters);
    if (!club) return undefined;

    return [{ homeTeam: { club } }, { awayTeam: { club } }];
  }

  private buildSearchFilter(search: string): Prisma.MatchesWhereInput[] {
    return [
      {
        homeTeam: { club: { name: { contains: search, mode: "insensitive" } } },
      },
      {
        awayTeam: { club: { name: { contains: search, mode: "insensitive" } } },
      },
    ];
  }

  /**
   * Builds the Prisma where clause from filters.
   *
   * @param filters - Match filters
   * @returns Prisma where clause
   */
  private buildWhereClause(filters?: MatchFilters): Prisma.MatchesWhereInput {
    const where: Prisma.MatchesWhereInput = {};

    if (filters?.poolId) where.poolId = filters.poolId;

    const poolFilter = this.buildPoolFilter(filters);
    if (filters?.championshipId && poolFilter) {
      where.pool = { championshipId: filters.championshipId, ...poolFilter };
    } else if (filters?.championshipId) {
      where.pool = { championshipId: filters.championshipId };
    } else if (poolFilter) {
      where.pool = poolFilter;
    }

    const orgFilter = this.buildOrganizationFilter(filters);
    const searchFilter = filters?.search
      ? this.buildSearchFilter(filters.search)
      : undefined;

    // Both are OR-groups over home/away team — andWhere AND-composes them
    // instead of letting one overwrite the other on a shared OR key.
    Object.assign(
      where,
      andWhere<Prisma.MatchesWhereInput>(
        orgFilter ? { OR: orgFilter } : undefined,
        searchFilter ? { OR: searchFilter } : undefined,
      ),
    );

    if (filters?.matchday) where.matchday = filters.matchday;

    if (filters?.date) {
      // Half-open [start of day, start of next day), and both bounds are built
      // from the *string* overload of `fromZonedTime`.
      //
      // Two things were wrong with the previous form, and neither could fail a
      // test that recomputed it (see `matches.service.spec.ts`).
      //
      // `new Date("2024-02-05T00:00:00")` — no zone designator — is parsed as
      // *ambient* local time, so the wall clock handed to `fromZonedTime` came
      // from whatever TZ the process happened to run in. Swept across all 418
      // IANA zones x 366 days of 2024, the two forms disagree on 7 (zone, day)
      // pairs: the days those zones spring forward at midnight, where 00:00
      // does not exist locally and the parse slides an hour. `TZ=UTC` is pinned
      // in every image and in Jest, so this was unreachable — but it was
      // unreachable by configuration, not by construction. The string overload
      // never consults the ambient zone at all.
      //
      // The upper bound closed on `23:59:59.999`, which is a millisecond short
      // of the day: `lt` excludes its own bound, so a match tipping off at
      // exactly 23:59:59.999 Paris time was invisible to a filter naming its
      // date. Next-day midnight closes that, and stays correct across DST
      // because the bound is a wall-clock instant rather than `start + 24h` —
      // a Paris day is 23 hours on the last Sunday in March and 25 on the last
      // in October.
      const nextDay = new Date(`${filters.date}T00:00:00Z`);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);

      where.startsAt = {
        gte: fromZonedTime(`${filters.date}T00:00:00`, COMPETITION_TIME_ZONE),
        lt: fromZonedTime(
          `${nextDay.toISOString().slice(0, 10)}T00:00:00`,
          COMPETITION_TIME_ZONE,
        ),
      };
    }

    return where;
  }
}
