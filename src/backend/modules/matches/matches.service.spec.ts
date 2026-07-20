// src/backend/modules/matches/matches.service.spec.ts
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { fromZonedTime } from "date-fns-tz";
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
    homeTeamScore: 85,
    awayTeamScore: 72,
    forfeit: false,
    pool: {
      id: 1,
      name: "Pool A",
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
    timestamp: new Date("2024-02-05T19:02:00Z"),
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
    date: new Date("2024-01-01"),
    matchday: 1,
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
      name: "Pool A",
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
        timestamp: new Date("2024-02-05T19:02:00Z"),
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
      expect(result.stats[0].stats.playtime).toBe(20);
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
      expect(result.awayTeamStats.fieldGoalPercentage).toBe("N/A");
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
  });

  describe("findMatchEventsByTeamId", () => {
    it("should return mapped match events for a team", async () => {
      mockPrismaService.client.matches.findMany.mockResolvedValue([{ id: 1 }]);
      mockPrismaService.client.matchEvents.findMany.mockResolvedValue([
        { ...mockMatchEventResult, matchId: 1 },
      ]);

      const result = await service.findMatchEventsByTeamId(1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].matchId).toBe(1);
      expect(result[0].shotLocation?.x).toBe(5.5);
    });

    it("should return empty array if no matches found for team", async () => {
      mockPrismaService.client.matches.findMany.mockResolvedValue([]);

      const result = await service.findMatchEventsByTeamId(999);

      expect(result).toEqual([]);
      expect(
        mockPrismaService.client.matchEvents.findMany,
      ).not.toHaveBeenCalled();
    });
  });

  describe("findMatchEventsByPlayerId", () => {
    it("should return mapped match events for a player", async () => {
      mockPrismaService.client.matchEvents.findMany.mockResolvedValue([
        { ...mockMatchEventResult, matchId: 1 },
      ]);

      const result = await service.findMatchEventsByPlayerId(1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].matchId).toBe(1);
      expect(result[0].shotLocation?.x).toBe(5.5);
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
      expect(result.stats[0].stats.playtime).toBe(0);
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
      expect(result.stats[0].stats.playtime).toBe(0);
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

    it("should apply date filter as range in Paris timezone", async () => {
      await service.findAllMatches({ date: "2024-02-05" });

      expect(mockPrismaService.client.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            date: {
              gte: fromZonedTime(
                new Date("2024-02-05T00:00:00"),
                "Europe/Paris",
              ),
              lt: fromZonedTime(
                new Date("2024-02-05T23:59:59.999"),
                "Europe/Paris",
              ),
            },
          }),
        }),
      );
    });

    it("should apply search filter as OR across home and away team", async () => {
      await service.findAllMatches({ search: "Paris" });

      expect(mockPrismaService.client.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ homeTeam: expect.any(Object) }),
              expect.objectContaining({ awayTeam: expect.any(Object) }),
            ]),
          }),
        }),
      );
    });

    it("should combine organization and search filters with AND when both are set", async () => {
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
                  {
                    homeTeam: {
                      club: {
                        name: { contains: "Paris", mode: "insensitive" },
                      },
                    },
                  },
                  {
                    awayTeam: {
                      club: {
                        name: { contains: "Paris", mode: "insensitive" },
                      },
                    },
                  },
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
