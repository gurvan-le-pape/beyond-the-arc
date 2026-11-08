// src/backend/modules/matches/matches.service.ts
import {
  Category,
  COMPETITION_TIME_ZONE,
  CompetitionLevel,
  EVENT_PLAYER_ROLES,
  EventType,
  Gender,
  MatchStatus,
} from "@common/constants";
import { PaginatedResponseDto } from "@common/dto";
import {
  andWhere,
  type BoxScoreLine,
  buildChampionshipWhere,
  buildClubOrganizationWhere,
  mapPlayerSummary,
  nameContains,
  parseBoxScore,
  resolvePagination,
} from "@common/utils";
import { Injectable, NotFoundException } from "@nestjs/common";
import { fromZonedTime } from "date-fns-tz";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../prisma/generated/prisma/client";
import { aggregateTeamMatchStats } from "./aggregate-team-match-stats";
import type { GetMatchesQueryDto } from "./dto/matches.query.dto";
import type {
  MatchDetailResponseDto,
  MatchEventDto,
  MatchPlayerStatsResponseDto,
  MatchResponseDto,
  PlayerWithStatsDto,
  ShotDto,
} from "./dto/matches.response.dto";
import { matchClock } from "./match-period";

const MATCH_LIST_SELECT = {
  id: true,
  startsAt: true,
  matchday: true,
  homeTeam: {
    select: {
      id: true,
      number: true,
      pool: {
        select: {
          id: true,
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
  status: true,
  homeTeamScore: true,
  awayTeamScore: true,
  forfeit: true,
  overtime: true,
} as const;

/** What an event's `players` entry shows of a player. */
const EVENT_PLAYER_SELECT = {
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
} as const;

const MATCH_EVENT_SELECT = {
  id: true,
  eventType: true,
  occurredAt: true,
  shotX: true,
  shotY: true,
  player: { select: EVENT_PLAYER_SELECT },
  otherPlayer: { select: EVENT_PLAYER_SELECT },
} as const;

/**
 * Chronological, with events that share an instant (a foul, its free throws,
 * the substitutions after them) in the simulator's order, which is the order
 * they were inserted in.
 */
const EVENT_ORDER: Prisma.MatchEventsOrderByWithRelationInput[] = [
  { occurredAt: "asc" },
  { id: "asc" },
];

/**
 * Extended select for match detail — includes events.
 */
const MATCH_DETAIL_SELECT = {
  ...MATCH_LIST_SELECT,
  matchEvents: {
    select: MATCH_EVENT_SELECT,
    orderBy: EVENT_ORDER,
  },
} as const;

/** What a box score shows of each player. */
const BOX_SCORE_PLAYER_SELECT = {
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
} as const;

/** What a shot chart reads of a shot event: its type and location. */
const SHOT_SELECT = {
  eventType: true,
  shotX: true,
  shotY: true,
} as const;

type MatchListResult = Prisma.MatchesGetPayload<{
  select: typeof MATCH_LIST_SELECT;
}>;

type MatchDetailResult = Prisma.MatchesGetPayload<{
  select: typeof MATCH_DETAIL_SELECT;
}>;

type MatchEventResult = Prisma.MatchEventsGetPayload<{
  select: typeof MATCH_EVENT_SELECT;
}>;

type ShotResult = Prisma.MatchEventsGetPayload<{
  select: typeof SHOT_SELECT;
}>;

type BoxScorePlayerResult = Prisma.PlayersGetPayload<{
  select: typeof BOX_SCORE_PLAYER_SELECT;
}>;

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllMatches(
    filters: GetMatchesQueryDto = {},
  ): Promise<PaginatedResponseDto<MatchResponseDto>> {
    const { page, limit, skip } = resolvePagination(filters);
    const searchClubIds = filters.search
      ? await this.findClubIdsByName(filters.search)
      : undefined;
    const where = this.buildWhereClause(filters, searchClubIds);

    const [matches, total] = await Promise.all([
      this.prisma.client.matches.findMany({
        where,
        select: MATCH_LIST_SELECT,
        orderBy: [{ startsAt: "desc" }, { id: "asc" }],
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
      where: { homeTeam: { poolId } },
      select: MATCH_LIST_SELECT,
      orderBy: [{ startsAt: "asc" }, { id: "asc" }],
    });

    return matches.map((m) => this.mapMatchToDto(m));
  }

  async findPlayerMatchStatsByMatchId(
    matchId: number,
  ): Promise<MatchPlayerStatsResponseDto> {
    const match = await this.prisma.client.matches.findUnique({
      where: { id: matchId },
      select: { homeTeamId: true, awayTeamId: true, boxScore: true },
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    // Only a completed match has a box score.
    const lines =
      match.boxScore === null ? [] : parseBoxScore(match.boxScore, matchId);
    const players = await this.prisma.client.players.findMany({
      where: { id: { in: lines.map((line) => line.playerId) } },
      select: BOX_SCORE_PLAYER_SELECT,
    });

    const mappedStats = this.mapToPlayerStats(matchId, lines, players);
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
    const [match, events] = await Promise.all([
      this.prisma.client.matches.findUnique({
        where: { id: matchId },
        select: { startsAt: true },
      }),
      this.prisma.client.matchEvents.findMany({
        where: { matchId },
        select: MATCH_EVENT_SELECT,
        orderBy: EVENT_ORDER,
      }),
    ]);
    if (!match) return [];

    return events.map((e) => this.mapEventToDto(e, match.startsAt));
  }

  /**
   * Every shot a team took, across its season, as its chart reads it.
   *
   * The match filter is a relation, not an `IN` list. Fetching the team's match
   * ids, materialising them in Node and sending them back as
   * `matchId: { in: [...] }` is a round trip and a hand-rolled join for
   * something the database does in one statement.
   *
   * Only the team's own attempts count: one of its players must have taken the
   * shot, which makes them the event's main player (`EVENT_PLAYER_ROLES`). The
   * other player of a shot event (assister, blocker, fouler) did not shoot, so
   * matching either would also pull in the opponent's shots this team's
   * defenders blocked or fouled.
   *
   * The match filter is kept although the player filter already implies it (a
   * player belongs to exactly one team, so every such event is in a match that
   * team played): it is the clause that states the intent, and it costs
   * nothing.
   */
  async findShotsByTeamId(teamId: number): Promise<ShotDto[]> {
    const events = await this.prisma.client.matchEvents.findMany({
      where: {
        match: { OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }] },
        shotX: { not: null },
        player: { teamId },
      },
      select: SHOT_SELECT,
      orderBy: EVENT_ORDER,
    });

    return events.flatMap((e) => this.mapShotToDto(e));
  }

  /**
   * Every shot a player took, across their season, as their chart reads it.
   *
   * The player must have taken the shot, which makes them the event's main
   * player (`EVENT_PLAYER_ROLES`). A made shot's other player is its
   * `assister`, so matching either would put the shots they assisted on their
   * own chart, as made baskets.
   */
  async findShotsByPlayerId(playerId: number): Promise<ShotDto[]> {
    const events = await this.prisma.client.matchEvents.findMany({
      where: {
        shotX: { not: null },
        playerId,
      },
      select: SHOT_SELECT,
      orderBy: EVENT_ORDER,
    });

    return events.flatMap((e) => this.mapShotToDto(e));
  }

  /**
   * Maps a shot event to its chart entry. The queries filter on a non-null
   * location, so the empty branch only satisfies the type.
   */
  private mapShotToDto(event: ShotResult): ShotDto[] {
    if (event.shotX === null || event.shotY === null) return [];

    return [
      {
        x: event.shotX.toNumber(),
        y: event.shotY.toNumber(),
        eventType: event.eventType as EventType,
      },
    ];
  }

  /**
   * Maps a list query result to MatchResponseDto (no events).
   */
  private mapMatchToDto(match: MatchListResult): MatchResponseDto {
    const pool = match.homeTeam.pool;

    return {
      id: match.id,
      startsAt: match.startsAt,
      matchday: match.matchday,
      status: match.status as MatchStatus,
      homeTeamScore: match.homeTeamScore,
      awayTeamScore: match.awayTeamScore,
      forfeit: match.forfeit,
      overtime: match.overtime,
      pool: {
        id: pool.id,
        letter: pool.letter,
        championship: {
          id: pool.championship.id,
          category: pool.championship.category as Category,
          gender: pool.championship.gender as Gender,
          level: pool.championship.level as CompetitionLevel,
          division: pool.championship.division,
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
      matchEvents: match.matchEvents.map((e) =>
        this.mapEventToDto(e, match.startsAt),
      ),
    };
  }

  private mapEventToDto(
    event: MatchEventResult,
    startsAt: Date,
  ): MatchEventDto {
    const { period, secondsLeft } = matchClock(event.occurredAt, startsAt);
    const eventType = event.eventType as EventType;
    const [mainRole, otherRole] = EVENT_PLAYER_ROLES[eventType];
    const named = [
      { role: mainRole, player: event.player },
      { role: otherRole, player: event.otherPlayer },
    ];

    return {
      id: event.id,
      eventType,
      occurredAt: event.occurredAt,
      period,
      secondsLeft,
      players: named.flatMap(({ role, player }) =>
        role && player
          ? [
              {
                role,
                player: {
                  id: player.id,
                  name: player.name,
                  number: player.number,
                  team: {
                    id: player.team.id,
                    club: { name: player.team.club.name },
                  },
                },
              },
            ]
          : [],
      ),
      // A CHECK constraint sets both coordinates or neither.
      shotLocation:
        event.shotX !== null && event.shotY !== null
          ? { x: event.shotX.toNumber(), y: event.shotY.toNumber() }
          : null,
    };
  }

  /**
   * Pairs each box-score line with its player. A line naming a player who no
   * longer exists is an error: the JSON has no foreign key to prevent it.
   */
  private mapToPlayerStats(
    matchId: number,
    lines: BoxScoreLine[],
    players: BoxScorePlayerResult[],
  ): PlayerWithStatsDto[] {
    const playersById = new Map(players.map((p) => [p.id, p]));
    return lines.map(({ playerId, stats }) => {
      const player = playersById.get(playerId);
      if (!player) {
        throw new Error(
          `match ${matchId}: box score names unknown player ${playerId}`,
        );
      }
      return {
        player: {
          ...mapPlayerSummary(player),
          team: player.team,
        },
        stats: {
          ...stats,
          playtimeSeconds: stats.playtimeIntervals.reduce(
            (total, [start, end]) => total + (end - start),
            0,
          ),
        },
      };
    });
  }

  private buildPoolFilter(
    filters: GetMatchesQueryDto,
  ): Prisma.PoolsWhereInput | undefined {
    const { championshipId } = filters;
    // A pool id already fixes the championship.
    const championship = filters.poolId
      ? undefined
      : buildChampionshipWhere(filters);

    if (!championshipId && !championship) return undefined;

    return {
      ...(championshipId ? { championshipId } : {}),
      ...(championship ? { championship } : {}),
    };
  }

  /**
   * A match's pool is its home team's, so every pool or championship filter
   * goes through the home team.
   */
  private buildHomeTeamFilter(
    filters: GetMatchesQueryDto,
  ): Prisma.TeamsWhereInput | undefined {
    const pool = this.buildPoolFilter(filters);
    if (!filters.poolId && !pool) return undefined;

    return {
      ...(filters.poolId ? { poolId: filters.poolId } : {}),
      ...(pool ? { pool } : {}),
    };
  }

  private buildOrganizationFilter(
    filters: GetMatchesQueryDto,
  ): Prisma.MatchesWhereInput[] | undefined {
    const club = buildClubOrganizationWhere(filters);
    if (!club) return undefined;

    return [{ homeTeam: { club } }, { awayTeam: { club } }];
  }

  /**
   * The ids of the clubs whose name contains `search`, at most one per club in
   * the database (4,368 in production), so the list is a bounded set of bind
   * parameters however short the search.
   *
   * The match search filters on these ids rather than on `club.name` through
   * the relation. On a production-sized database, the relation form joins both
   * teams and both clubs and sorts every match before the `OR` on two names can
   * discard any: 600 ms for a 20-row page and 219 ms for its count, against
   * 1.4 ms and 111 ms filtering on club ids.
   */
  private async findClubIdsByName(search: string): Promise<number[]> {
    const clubs = await this.prisma.client.clubs.findMany({
      where: { name: nameContains(search) },
      select: { id: true },
    });

    return clubs.map((club) => club.id);
  }

  private buildSearchFilter(clubIds: number[]): Prisma.MatchesWhereInput[] {
    return [
      { homeTeam: { clubId: { in: clubIds } } },
      { awayTeam: { clubId: { in: clubIds } } },
    ];
  }

  /**
   * Builds the Prisma where clause from filters.
   *
   * @param filters - Match filters
   * @param searchClubIds - Ids of the clubs matching `filters.search`, when set
   * @returns Prisma where clause
   */
  private buildWhereClause(
    filters: GetMatchesQueryDto,
    searchClubIds?: number[],
  ): Prisma.MatchesWhereInput {
    const where: Prisma.MatchesWhereInput = {};

    const homeTeamFilter = this.buildHomeTeamFilter(filters);
    if (homeTeamFilter) where.homeTeam = homeTeamFilter;

    const orgFilter = this.buildOrganizationFilter(filters);
    const searchFilter = searchClubIds
      ? this.buildSearchFilter(searchClubIds)
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

    if (filters.matchday) where.matchday = filters.matchday;

    if (filters.date) {
      // Half-open [start of day, start of next day), both bounds built from
      // the *string* overload of `fromZonedTime`, which never consults the
      // process's ambient time zone. `new Date("2024-02-05T00:00:00")` would:
      // with no zone designator it parses as ambient local time, and across
      // all 418 IANA zones x 366 days of 2024 it slides an hour on 7 (zone,
      // day) pairs — the days those zones spring forward at midnight, where
      // 00:00 does not exist locally. `TZ=UTC` is pinned in every image and in
      // Jest, but the bound must not depend on configuration.
      //
      // The upper bound is next-day midnight under `lt`: a bound at
      // `23:59:59.999` would leave a match tipping off at exactly that instant
      // outside its own date. It is a wall-clock instant rather than
      // `start + 24h` because a Paris day is 23 hours on the last Sunday in
      // March and 25 on the last in October.
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
