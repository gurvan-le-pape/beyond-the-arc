// src/backend/modules/matches/matches.service.spec.ts
import { Role } from "@common/constants";
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../prisma/generated/prisma/client";
import { MatchesService } from "./matches.service";

/**
 * Unit tests for MatchesService.
 *
 * Tests cover:
 * - Happy path scenarios
 * - Error handling
 * - Edge cases (pagination, filters)
 * - Data transformation
 */
describe("MatchesService", () => {
  let service: MatchesService;
  let prismaService: PrismaService;

  // Mock Prisma service
  const mockPrismaService = {
    client: {
      matches: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
      },
      playerMatchStats: {
        findMany: jest.fn(),
      },
      matchEvents: {
        findMany: jest.fn(),
      },
      clubs: {
        findMany: jest.fn(),
      },
    },
  };

  // Reusable mock player shape
  const mockPlayer = {
    id: 1,
    name: "Player One",
    number: 10,
    position: "PG",
    teamId: 1,
    team: {
      id: 1,
      number: 1,
      club: { id: 1, name: "Club A" },
    },
  };

  // Reusable mock player stats shape
  const mockPlayerStats = {
    points: 0,
    fouls: 0,
    threePointsMade: 0,
    threePointsAttempted: 0,
    twoPointsIntMade: 0,
    twoPointsIntAttempted: 0,
    twoPointsExtMade: 0,
    twoPointsExtAttempted: 0,
    freeThrowsMade: 0,
    freeThrowsAttempted: 0,
    assists: 0,
    turnovers: 0,
    reboundsOffensive: 0,
    reboundsDefensive: 0,
    steals: 0,
    blocks: 0,
    playtimeIntervals: null,
  };

  // Reusable mock shapes matching MATCH_LIST_SELECT
  const mockMatchListResult = {
    id: 1,
    date: new Date("2024-01-01"),
    matchday: 1,
    status: "completed",
    homeTeamScore: 85,
    awayTeamScore: 72,
    forfeit: false,
    pool: {
      id: 1,
      letter: "A",
      championship: {
        id: 1,
        category: "Senior",
        gender: "M",
        level: "regional",
        division: "Régionale 1",
      },
    },
    homeTeam: {
      id: 1,
      number: 1,
      club: {
        id: 1,
        name: "Club Home",
        committeeId: 1,
        committee: { leagueId: 1 },
      },
    },
    awayTeam: {
      id: 2,
      number: 1,
      club: {
        id: 2,
        name: "Club Away",
        committeeId: 2,
        committee: { leagueId: 1 },
      },
    },
  };

  // Reusable mock shape matching MATCH_EVENT_SELECT
  const mockMatchEventResult = {
    id: 1,
    eventType: "made_layup",
    occurredAt: new Date("2024-02-05T19:02:00Z"),
    description: "3-pointer",
    players: [
      {
        role: "shooter",
        player: {
          id: 1,
          name: "Player One",
          number: 10,
          team: {
            id: 1,
            club: { name: "Club Home" },
          },
        },
      },
    ],
    shotLocation: {
      id: 1,
      x: new Prisma.Decimal("5.50"),
      y: new Prisma.Decimal("3.20"),
    },
  };

  // Reusable mock shape matching MATCH_DETAIL_SELECT
  const mockMatchDetailResult = {
    id: 1,
    startsAt: new Date("2024-02-05T19:00:00Z"),
    matchday: 1,
    status: "completed",
    homeTeamScore: 85,
    awayTeamScore: 72,
    forfeit: false,
    homeTeam: {
      id: 1,
      number: 1,
      club: {
        id: 1,
        name: "Club Home",
        committeeId: 1,
        committee: { leagueId: 1 },
      },
    },
    awayTeam: {
      id: 2,
      number: 1,
      club: {
        id: 2,
        name: "Club Away",
        committeeId: 2,
        committee: { leagueId: 1 },
      },
    },
    pool: {
      id: 1,
      letter: "A",
      championship: {
        id: 1,
        category: "Senior",
        gender: "M",
        level: "regional",
        division: "Régionale 1",
      },
    },
    matchEvents: [
      {
        id: 1,
        eventType: "made_layup",
        occurredAt: new Date("2024-02-05T19:02:00Z"),
        description: "3-pointer",
        players: [
          {
            role: "shooter",
            player: {
              id: 1,
              name: "Player One",
              number: 10,
              team: {
                id: 1,
                club: { name: "Club Home" },
              },
            },
          },
        ],
        shotLocation: {
          id: 1,
          x: new Prisma.Decimal("5.50"),
          y: new Prisma.Decimal("3.20"),
        },
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [
        MatchesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        CacheDedupService,
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe("findAllMatches", () => {
    it("should return paginated matches and pagination info", async () => {
      mockPrismaService.client.matches.findMany.mockResolvedValue([
        mockMatchListResult,
      ]);
      mockPrismaService.client.matches.count.mockResolvedValue(1);

      const result = await service.findAllMatches({ page: 1, limit: 1 });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe(1);
      expect(result.items[0].status).toBe("completed");
      expect(result.items[0].homeTeam.number).toBe(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it("should handle pagination correctly", async () => {
      mockPrismaService.client.matches.findMany.mockResolvedValue([]);
      mockPrismaService.client.matches.count.mockResolvedValue(150);

      const result = await service.findAllMatches({ page: 2, limit: 20 });

      expect(result.total).toBe(150);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(8);

      expect(mockPrismaService.client.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ startsAt: "desc" }, { id: "asc" }],
          skip: 20,
          take: 20,
        }),
      );
    });

    it("should use default page and limit when not provided", async () => {
      mockPrismaService.client.matches.findMany.mockResolvedValue([]);
      mockPrismaService.client.matches.count.mockResolvedValue(0);

      const result = await service.findAllMatches({});

      expect(result.page).toBe(1);
      expect(result.limit).toBe(50);
    });

    it("should propagate database errors", async () => {
      const dbError = new Error("DB error");
      mockPrismaService.client.matches.findMany.mockRejectedValue(dbError);

      await expect(service.findAllMatches({})).rejects.toThrow("DB error");
    });
  });

  describe("findMatchById", () => {
    it("should return mapped match with events and Decimal coordinates converted", async () => {
      mockPrismaService.client.matches.findUnique.mockResolvedValue(
        mockMatchDetailResult,
      );

      const result = await service.findMatchById(1);

      expect(result.id).toBe(1);
      expect(result.homeTeam.number).toBe(1);
      expect(result.matchEvents).toHaveLength(1);
      expect(result.matchEvents[0].shotLocation?.x).toBe(5.5);
      expect(result.matchEvents[0].shotLocation?.y).toBe(3.2);
      expect(result.matchEvents[0].period).toBe(1);
    });

    it("should throw NotFoundException when match not found", async () => {
      mockPrismaService.client.matches.findUnique.mockResolvedValue(null);

      await expect(service.findMatchById(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findMatchById(999)).rejects.toThrow(
        "Match with ID 999 not found",
      );
    });
  });

  describe("findMatchesByPoolId", () => {
    it("should return matches for a given pool", async () => {
      mockPrismaService.client.matches.findMany.mockResolvedValue([
        mockMatchListResult,
      ]);

      const result = await service.findMatchesByPoolId(1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(mockPrismaService.client.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { poolId: 1 } }),
      );
    });
  });

  describe("findPlayerMatchStatsByMatchId", () => {
    it("should return player stats with home and away team ids", async () => {
      mockPrismaService.client.matches.findUnique.mockResolvedValue({
        homeTeamId: 1,
        awayTeamId: 2,
      });
      mockPrismaService.client.playerMatchStats.findMany.mockResolvedValue([
        {
          player: {
            ...mockPlayer,
            teamId: 1,
            team: {
              id: 100,
              number: 5,
              club: { id: 200, name: "Club A" },
            },
          },
          points: 20,
          fouls: 2,
          threePointsMade: 1,
          threePointsAttempted: 2,
          twoPointsIntMade: 3,
          twoPointsIntAttempted: 4,
          twoPointsExtMade: 0,
          twoPointsExtAttempted: 1,
          freeThrowsMade: 2,
          freeThrowsAttempted: 2,
          assists: 5,
          turnovers: 1,
          reboundsOffensive: 2,
          reboundsDefensive: 3,
          steals: 1,
          blocks: 0,
          playtimeIntervals: [
            [0, 10],
            [15, 25],
          ],
        },
      ]);

      const result = await service.findPlayerMatchStatsByMatchId(1);

      expect(result.homeTeamId).toBe(1);
      expect(result.awayTeamId).toBe(2);
      expect(result.stats[0].player.name).toBe("Player One");
      expect(result.stats[0].player.position).toBe("PG");
      expect(result.stats[0].stats.points).toBe(20);
      expect(result.stats[0].stats.rebounds.total).toBe(5);
      expect(result.stats[0].stats.rebounds.offensive).toBe(2);
      expect(result.stats[0].stats.rebounds.defensive).toBe(3);
      expect(result.stats[0].stats.playtimeSeconds).toBe(20);
    });

    it("aggregates team totals partitioned by the player's team id", async () => {
      mockPrismaService.client.matches.findUnique.mockResolvedValue({
        homeTeamId: 1,
        awayTeamId: 2,
      });
      mockPrismaService.client.playerMatchStats.findMany.mockResolvedValue([
        {
          player: {
            ...mockPlayer,
            teamId: 1,
            team: { id: 100, number: 5, club: { id: 200, name: "Club A" } },
          },
          points: 20,
          fouls: 2,
          threePointsMade: 1,
          threePointsAttempted: 2,
          twoPointsIntMade: 3,
          twoPointsIntAttempted: 4,
          twoPointsExtMade: 0,
          twoPointsExtAttempted: 1,
          freeThrowsMade: 2,
          freeThrowsAttempted: 2,
          assists: 5,
          turnovers: 1,
          reboundsOffensive: 2,
          reboundsDefensive: 3,
          steals: 1,
          blocks: 0,
          playtimeIntervals: [],
        },
      ]);

      const result = await service.findPlayerMatchStatsByMatchId(1);

      // Only the single home-team player contributes to the home totals.
      expect(result.homeTeamStats.assists).toBe(5);
      expect(result.homeTeamStats.fieldGoals).toBe("4/7");
      expect(result.homeTeamStats.pointsInPaint).toBe(6);
      // No away-team rows -> zeroed totals.
      expect(result.awayTeamStats.assists).toBe(0);
      expect(result.awayTeamStats.fieldGoalPercentage).toBeNull();
    });

    it("should throw NotFoundException if match not found", async () => {
      mockPrismaService.client.matches.findUnique.mockResolvedValue(null);

      await expect(service.findPlayerMatchStatsByMatchId(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findPlayerMatchStatsByMatchId(999)).rejects.toThrow(
        "Match with ID 999 not found",
      );
    });
  });

  describe("findMatchEventsByMatchId", () => {
    beforeEach(() => {
      mockPrismaService.client.matches.findUnique.mockResolvedValue({
        startsAt: new Date("2024-02-05T19:00:00Z"),
      });
    });

    it("should return mapped match events with Decimal coordinates converted", async () => {
      mockPrismaService.client.matchEvents.findMany.mockResolvedValue([
        mockMatchEventResult,
      ]);

      const result = await service.findMatchEventsByMatchId(1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].eventType).toBe("made_layup");
      expect(result[0].shotLocation?.x).toBe(5.5);
      expect(result[0].shotLocation?.y).toBe(3.2);
      expect(result[0].players[0].role).toBe("shooter");
    });

    it("should handle events with no shot location", async () => {
      mockPrismaService.client.matchEvents.findMany.mockResolvedValue([
        { ...mockMatchEventResult, shotLocation: null },
      ]);

      const result = await service.findMatchEventsByMatchId(1);

      expect(result[0].shotLocation).toBeNull();
    });

    it("gives each event its period, counted from the match's tip-off", async () => {
      mockPrismaService.client.matchEvents.findMany.mockResolvedValue([
        {
          ...mockMatchEventResult,
          occurredAt: new Date("2024-02-05T19:10:01Z"),
        },
        {
          ...mockMatchEventResult,
          occurredAt: new Date("2024-02-05T19:40:01Z"),
        },
      ]);

      const result = await service.findMatchEventsByMatchId(1);

      expect(result.map((e) => e.period)).toEqual([2, 5]);
    });

    it("returns an empty list for an unknown match", async () => {
      mockPrismaService.client.matches.findUnique.mockResolvedValue(null);
      mockPrismaService.client.matchEvents.findMany.mockResolvedValue([]);

      await expect(service.findMatchEventsByMatchId(999)).resolves.toEqual([]);
    });
  });

  // What the shot queries' select returns: type and location only.
  const mockShotResult = {
    eventType: "made_layup",
    shotLocation: { x: new Prisma.Decimal(5.5), y: new Prisma.Decimal(3.2) },
  };

  describe("findShotsByTeamId", () => {
    it("should return each shot as its location and type, nothing else", async () => {
      mockPrismaService.client.matchEvents.findMany.mockResolvedValue([
        mockShotResult,
      ]);

      const result = await service.findShotsByTeamId(1);

      expect(result).toEqual([{ x: 5.5, y: 3.2, eventType: "made_layup" }]);
    });

    it("should scope the query to the team's own matches", async () => {
      mockPrismaService.client.matchEvents.findMany.mockResolvedValue([]);

      await service.findShotsByTeamId(7);

      // The match clause is what states the intent, so it is asserted rather
      // than left to `players: { some: … }` to imply. One query, not two.
      expect(
        mockPrismaService.client.matchEvents.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            match: { OR: [{ homeTeamId: 7 }, { awayTeamId: 7 }] },
            players: {
              some: {
                player: { teamId: 7 },
                role: { in: [Role.SHOOTER, Role.BLOCKED] },
              },
            },
          }),
        }),
      );
      expect(mockPrismaService.client.matches.findMany).not.toHaveBeenCalled();
    });

    it("should return empty array when the team has no shots", async () => {
      mockPrismaService.client.matchEvents.findMany.mockResolvedValue([]);

      const result = await service.findShotsByTeamId(999);

      expect(result).toEqual([]);
    });
  });

  describe("findShotsByPlayerId", () => {
    it("should return each shot as its location and type, nothing else", async () => {
      mockPrismaService.client.matchEvents.findMany.mockResolvedValue([
        mockShotResult,
      ]);

      const result = await service.findShotsByPlayerId(1);

      expect(result).toEqual([{ x: 5.5, y: 3.2, eventType: "made_layup" }]);
    });

    it("should only match events where the player took the shot", async () => {
      mockPrismaService.client.matchEvents.findMany.mockResolvedValue([]);

      await service.findShotsByPlayerId(7);

      expect(
        mockPrismaService.client.matchEvents.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            players: {
              some: {
                playerId: 7,
                role: { in: [Role.SHOOTER, Role.BLOCKED] },
              },
            },
          }),
        }),
      );
    });
  });

  describe("calculatePlaytime", () => {
    it("should return 0 when playtimeIntervals is null", async () => {
      mockPrismaService.client.matches.findUnique.mockResolvedValue({
        homeTeamId: 1,
        awayTeamId: 2,
      });
      mockPrismaService.client.playerMatchStats.findMany.mockResolvedValue([
        {
          player: mockPlayer,
          ...mockPlayerStats,
          playtimeIntervals: null,
        },
      ]);

      const result = await service.findPlayerMatchStatsByMatchId(1);
      expect(result.stats[0].stats.playtimeSeconds).toBe(0);
      expect(result.stats[0].stats.playtimeIntervals).toBeNull();
    });

    it("should return 0 when playtimeIntervals is empty array", async () => {
      mockPrismaService.client.matches.findUnique.mockResolvedValue({
        homeTeamId: 1,
        awayTeamId: 2,
      });
      mockPrismaService.client.playerMatchStats.findMany.mockResolvedValue([
        {
          player: mockPlayer,
          ...mockPlayerStats,
          playtimeIntervals: [],
        },
      ]);

      const result = await service.findPlayerMatchStatsByMatchId(1);
      expect(result.stats[0].stats.playtimeSeconds).toBe(0);
    });
  });

  describe("buildWhereClause", () => {
    beforeEach(() => {
      mockPrismaService.client.matches.findMany.mockResolvedValue([]);
      mockPrismaService.client.matches.count.mockResolvedValue(0);
    });

    it("should apply poolId filter", async () => {
      await service.findAllMatches({ poolId: 5 });

      expect(mockPrismaService.client.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ poolId: 5 }),
        }),
      );
    });

    it("should apply championshipId filter", async () => {
      await service.findAllMatches({ championshipId: 3 });

      expect(mockPrismaService.client.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            pool: expect.objectContaining({ championshipId: 3 }),
          }),
        }),
      );
    });

    it("should apply championshipId and pool filters together", async () => {
      await service.findAllMatches({
        championshipId: 3,
        level: "regional",
        division: 1,
      });

      expect(mockPrismaService.client.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            pool: expect.objectContaining({
              championshipId: 3,
              championship: expect.objectContaining({ level: "regional" }),
            }),
          }),
        }),
      );
    });

    it("should apply pool filter without championshipId", async () => {
      await service.findAllMatches({ level: "regional", division: 1 });

      expect(mockPrismaService.client.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            pool: expect.objectContaining({
              championship: expect.objectContaining({ level: "regional" }),
            }),
          }),
        }),
      );
    });

    it("should apply committeeId organization filter", async () => {
      await service.findAllMatches({ committeeId: 2 });

      expect(mockPrismaService.client.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ homeTeam: expect.any(Object) }),
            ]),
          }),
        }),
      );
    });

    it("should apply leagueId organization filter", async () => {
      await service.findAllMatches({ leagueId: 4 });

      expect(mockPrismaService.client.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ homeTeam: expect.any(Object) }),
            ]),
          }),
        }),
      );
    });

    it("should apply matchday filter", async () => {
      await service.findAllMatches({ matchday: 3 });

      expect(mockPrismaService.client.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ matchday: 3 }),
        }),
      );
    });

    // The expected instants below are written out in UTC, deliberately, and
    // must stay that way.
    //
    // The previous version of this test called `fromZonedTime(new Date(day +
    // "T00:00:00"), "Europe/Paris")` — the implementation's own expression,
    // recomputed. Keeping "Europe/Paris" literal pinned the *zone*, which the
    // old comment was right about, but nothing else: any defect in how the
    // wall-clock string is parsed, or in where the upper bound sits, was
    // reproduced identically on both sides and the assertion passed. A test
    // that recomputes the implementation can only fail when the implementation
    // fails to run.
    //
    // A literal instant has no such symmetry. It is also readable: 2024-02-05
    // in Paris is CET, so the day runs 23:00Z the evening before to 23:00Z that
    // evening.
    describe.each([
      {
        label: "a plain CET day",
        day: "2024-02-05",
        gte: "2024-02-04T23:00:00.000Z",
        lt: "2024-02-05T23:00:00.000Z",
      },
      {
        // Spring forward: 02:00 -> 03:00 on this date, so the Paris day is 23
        // hours long. An implementation that computed the upper bound as
        // `gte + 24h` would put it an hour into 2024-04-01 and this case is
        // what would catch it.
        label: "the spring-forward day (23 h long)",
        day: "2024-03-31",
        gte: "2024-03-30T23:00:00.000Z",
        lt: "2024-03-31T22:00:00.000Z",
      },
      {
        // Fall back: 03:00 -> 02:00, so the Paris day is 25 hours long and the
        // offset changes *inside* the range.
        label: "the fall-back day (25 h long)",
        day: "2024-10-27",
        gte: "2024-10-26T22:00:00.000Z",
        lt: "2024-10-27T23:00:00.000Z",
      },
    ])("date filter as a Paris-day range — $label", ({ day, gte, lt }) => {
      it(`bounds ${day} at ${gte} .. ${lt}`, async () => {
        await service.findAllMatches({ date: day });

        expect(mockPrismaService.client.matches.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              startsAt: { gte: new Date(gte), lt: new Date(lt) },
            }),
          }),
        );
      });
    });

    // The upper bounds are the *next day's* midnight, and `lt` excludes its own
    // bound, so the range is half-open and covers the whole Paris day with no
    // gap. They are deliberately not `gte + 24h`: 2024-03-31 is 23 hours long
    // and 2024-10-27 is 25, which is what those two cases exist to pin.

    it("should search on the ids of the clubs whose name matches, home or away", async () => {
      mockPrismaService.client.clubs.findMany.mockResolvedValue([
        { id: 7 },
        { id: 9 },
      ]);

      await service.findAllMatches({ search: "Paris" });

      expect(mockPrismaService.client.clubs.findMany).toHaveBeenCalledWith({
        where: { name: { contains: "Paris", mode: "insensitive" } },
        select: { id: true },
      });
      const { where } =
        mockPrismaService.client.matches.findMany.mock.calls[0][0];
      expect(where.OR).toEqual([
        { homeTeam: { clubId: { in: [7, 9] } } },
        { awayTeam: { clubId: { in: [7, 9] } } },
      ]);
      expect(
        mockPrismaService.client.matches.count.mock.calls[0][0].where,
      ).toEqual(where);
    });

    it("should not look clubs up when there is no search", async () => {
      await service.findAllMatches({ committeeId: 2 });

      expect(mockPrismaService.client.clubs.findMany).not.toHaveBeenCalled();
    });

    it("should combine organization and search filters with AND when both are set", async () => {
      mockPrismaService.client.clubs.findMany.mockResolvedValue([{ id: 7 }]);

      await service.findAllMatches({ committeeId: 2, search: "Paris" });

      expect(mockPrismaService.client.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: [
              {
                OR: [
                  { homeTeam: { club: { committeeId: 2 } } },
                  { awayTeam: { club: { committeeId: 2 } } },
                ],
              },
              {
                OR: [
                  { homeTeam: { clubId: { in: [7] } } },
                  { awayTeam: { clubId: { in: [7] } } },
                ],
              },
            ],
          }),
        }),
      );

      const { where } =
        mockPrismaService.client.matches.findMany.mock.calls[0][0];
      expect(where.OR).toBeUndefined();
    });

    it("should include committeeId and leagueId on club", async () => {
      mockPrismaService.client.matches.findUnique.mockResolvedValue(
        mockMatchDetailResult,
      );

      const result = await service.findMatchById(1);

      expect(result.homeTeam.club.committeeId).toBe(1);
      expect(result.homeTeam.club.leagueId).toBe(1);
      expect(result.awayTeam.club.committeeId).toBe(2);
      expect(result.awayTeam.club.leagueId).toBe(1);
    });

    it("should include committeeId and leagueId on club in list results", async () => {
      mockPrismaService.client.matches.findMany.mockResolvedValue([
        mockMatchListResult,
      ]);
      mockPrismaService.client.matches.count.mockResolvedValue(1);

      const result = await service.findAllMatches({ page: 1, limit: 1 });

      expect(result.items[0].homeTeam.club.committeeId).toBe(1);
      expect(result.items[0].homeTeam.club.leagueId).toBe(1);
      expect(result.items[0].awayTeam.club.committeeId).toBe(2);
      expect(result.items[0].awayTeam.club.leagueId).toBe(1);
    });
  });
});
