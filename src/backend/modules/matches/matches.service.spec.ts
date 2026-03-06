// src/backend/modules/matches/matches.service.spec.ts
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { Decimal } from "@prisma/client/runtime/library";
import { PrismaService } from "prisma/prisma.service";

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
      club: { name: "Club Home" },
    },
    awayTeam: {
      id: 2,
      number: 1,
      club: { name: "Club Away" },
    },
  };

  // Reusable mock shape matching MATCH_EVENT_SELECT
  const mockMatchEventResult = {
    id: 1,
    eventType: "shot_made",
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
      x: new Decimal("5.50"),
      y: new Decimal("3.20"),
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
      club: { name: "Club Home" },
    },
    awayTeam: {
      id: 2,
      number: 1,
      club: { name: "Club Away" },
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
        eventType: "shot_made",
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
          x: new Decimal("5.50"),
          y: new Decimal("3.20"),
        },
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe("findAllMatches", () => {
    it("should return paginated matches and pagination info", async () => {
      mockPrismaService.matches.findMany.mockResolvedValue([
        mockMatchListResult,
      ]);
      mockPrismaService.matches.count.mockResolvedValue(1);

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
      mockPrismaService.matches.findMany.mockResolvedValue([]);
      mockPrismaService.matches.count.mockResolvedValue(150);

      const result = await service.findAllMatches({ page: 2, limit: 20 });

      expect(result.total).toBe(150);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(8);

      expect(mockPrismaService.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 20,
        }),
      );
    });

    it("should use default page and limit when not provided", async () => {
      mockPrismaService.matches.findMany.mockResolvedValue([]);
      mockPrismaService.matches.count.mockResolvedValue(0);

      const result = await service.findAllMatches({});

      expect(result.page).toBe(1);
      expect(result.limit).toBe(50);
    });

    it("should cap limit at 100", async () => {
      mockPrismaService.matches.findMany.mockResolvedValue([]);
      mockPrismaService.matches.count.mockResolvedValue(0);

      await service.findAllMatches({ limit: 999 });

      expect(mockPrismaService.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 100 }),
      );
    });

    it("should propagate database errors", async () => {
      const dbError = new Error("DB error");
      mockPrismaService.matches.findMany.mockRejectedValue(dbError);

      await expect(service.findAllMatches({})).rejects.toThrow("DB error");
    });
  });

  describe("findMatchById", () => {
    it("should return mapped match with events and Decimal coordinates converted", async () => {
      mockPrismaService.matches.findUnique.mockResolvedValue(
        mockMatchDetailResult,
      );

      const result = await service.findMatchById(1);

      expect(result.id).toBe(1);
      expect(result.homeTeam.number).toBe(1);
      expect(result.matchEvents).toHaveLength(1);
      expect(result.matchEvents[0].shotLocation?.x).toBe(5.5);
      expect(result.matchEvents[0].shotLocation?.y).toBe(3.2);
    });

    it("should return null pool when pool is null", async () => {
      mockPrismaService.matches.findUnique.mockResolvedValue({
        ...mockMatchDetailResult,
        pool: null,
        matchEvents: [],
      });

      const result = await service.findMatchById(1);

      expect(result.pool).toBeNull();
    });

    it("should throw NotFoundException when match not found", async () => {
      mockPrismaService.matches.findUnique.mockResolvedValue(null);

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
      mockPrismaService.matches.findMany.mockResolvedValue([
        mockMatchListResult,
      ]);

      const result = await service.findMatchesByPoolId(1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(mockPrismaService.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { poolId: 1 } }),
      );
    });
  });

  describe("findMatchesByChampionshipId", () => {
    it("should return matches for a given championship", async () => {
      mockPrismaService.matches.findMany.mockResolvedValue([
        mockMatchListResult,
      ]);

      const result = await service.findMatchesByChampionshipId(1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(mockPrismaService.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { pool: { championshipId: 1 } },
        }),
      );
    });
  });

  describe("findPlayerMatchStatsByMatchId", () => {
    it("should return player stats with home and away team ids", async () => {
      mockPrismaService.matches.findUnique.mockResolvedValue({
        homeTeamId: 1,
        awayTeamId: 2,
      });
      mockPrismaService.playerMatchStats.findMany.mockResolvedValue([
        {
          player: {
            id: 1,
            name: "Player One",
            number: 10,
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
      expect(result.stats[0].stats.points).toBe(20);
      expect(result.stats[0].stats.rebounds.total).toBe(5);
      expect(result.stats[0].stats.rebounds.offensive).toBe(2);
      expect(result.stats[0].stats.rebounds.defensive).toBe(3);
      expect(result.stats[0].stats.playtime).toBe(20);
    });

    it("should throw NotFoundException if match not found", async () => {
      mockPrismaService.matches.findUnique.mockResolvedValue(null);

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
      mockPrismaService.matchEvents.findMany.mockResolvedValue([
        mockMatchEventResult,
      ]);

      const result = await service.findMatchEventsByMatchId(1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].eventType).toBe("shot_made");
      expect(result[0].shotLocation?.x).toBe(5.5);
      expect(result[0].shotLocation?.y).toBe(3.2);
      expect(result[0].players[0].role).toBe("shooter");
    });

    it("should handle events with no shot location", async () => {
      mockPrismaService.matchEvents.findMany.mockResolvedValue([
        { ...mockMatchEventResult, shotLocation: null },
      ]);

      const result = await service.findMatchEventsByMatchId(1);

      expect(result[0].shotLocation).toBeNull();
    });
  });

  describe("findMatchEventsByTeamId", () => {
    it("should return mapped match events for a team", async () => {
      mockPrismaService.matches.findMany.mockResolvedValue([{ id: 1 }]);
      mockPrismaService.matchEvents.findMany.mockResolvedValue([
        { ...mockMatchEventResult, matchId: 1 },
      ]);

      const result = await service.findMatchEventsByTeamId(1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].matchId).toBe(1);
      expect(result[0].shotLocation?.x).toBe(5.5);
    });

    it("should return empty array if no matches found for team", async () => {
      mockPrismaService.matches.findMany.mockResolvedValue([]);

      const result = await service.findMatchEventsByTeamId(999);

      expect(result).toEqual([]);
      expect(mockPrismaService.matchEvents.findMany).not.toHaveBeenCalled();
    });
  });

  describe("findMatchEventsByPlayerId", () => {
    it("should return mapped match events for a player", async () => {
      mockPrismaService.matchEvents.findMany.mockResolvedValue([
        { ...mockMatchEventResult, matchId: 1 },
      ]);

      const result = await service.findMatchEventsByPlayerId(1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].matchId).toBe(1);
      expect(result[0].shotLocation?.x).toBe(5.5);
    });
  });

  describe("validatePage", () => {
    it("should return 1 when page is 0", async () => {
      mockPrismaService.matches.findMany.mockResolvedValue([]);
      mockPrismaService.matches.count.mockResolvedValue(0);

      const result = await service.findAllMatches({ page: 0 });
      expect(result.page).toBe(1);
    });

    it("should return 1 when page is negative", async () => {
      mockPrismaService.matches.findMany.mockResolvedValue([]);
      mockPrismaService.matches.count.mockResolvedValue(0);

      const result = await service.findAllMatches({ page: -1 });
      expect(result.page).toBe(1);
    });
  });

  describe("validateLimit", () => {
    it("should return 50 when limit is 0", async () => {
      mockPrismaService.matches.findMany.mockResolvedValue([]);
      mockPrismaService.matches.count.mockResolvedValue(0);

      const result = await service.findAllMatches({ limit: 0 });
      expect(result.limit).toBe(50);
    });

    it("should return 50 when limit is negative", async () => {
      mockPrismaService.matches.findMany.mockResolvedValue([]);
      mockPrismaService.matches.count.mockResolvedValue(0);

      const result = await service.findAllMatches({ limit: -1 });
      expect(result.limit).toBe(50);
    });
  });

  describe("calculatePlaytime", () => {
    it("should return 0 when playtimeIntervals is null", async () => {
      mockPrismaService.matches.findUnique.mockResolvedValue({
        homeTeamId: 1,
        awayTeamId: 2,
      });
      mockPrismaService.playerMatchStats.findMany.mockResolvedValue([
        {
          player: {
            id: 1,
            name: "Player One",
            number: 10,
            teamId: 1,
            team: { id: 1, number: 1, club: { id: 1, name: "Club A" } },
          },
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
        },
      ]);

      const result = await service.findPlayerMatchStatsByMatchId(1);
      expect(result.stats[0].stats.playtime).toBe(0);
      expect(result.stats[0].stats.playtimeIntervals).toBeNull();
    });

    it("should return 0 when playtimeIntervals is empty array", async () => {
      mockPrismaService.matches.findUnique.mockResolvedValue({
        homeTeamId: 1,
        awayTeamId: 2,
      });
      mockPrismaService.playerMatchStats.findMany.mockResolvedValue([
        {
          player: {
            id: 1,
            name: "Player One",
            number: 10,
            teamId: 1,
            team: { id: 1, number: 1, club: { id: 1, name: "Club A" } },
          },
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
          playtimeIntervals: [],
        },
      ]);

      const result = await service.findPlayerMatchStatsByMatchId(1);
      expect(result.stats[0].stats.playtime).toBe(0);
    });
  });

  describe("buildWhereClause", () => {
    beforeEach(() => {
      mockPrismaService.matches.findMany.mockResolvedValue([]);
      mockPrismaService.matches.count.mockResolvedValue(0);
    });

    it("should apply poolId filter", async () => {
      await service.findAllMatches({ poolId: 5 });

      expect(mockPrismaService.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ poolId: 5 }),
        }),
      );
    });

    it("should apply championshipId filter", async () => {
      await service.findAllMatches({ championshipId: 3 });

      expect(mockPrismaService.matches.findMany).toHaveBeenCalledWith(
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

      expect(mockPrismaService.matches.findMany).toHaveBeenCalledWith(
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

      expect(mockPrismaService.matches.findMany).toHaveBeenCalledWith(
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

      expect(mockPrismaService.matches.findMany).toHaveBeenCalledWith(
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

      expect(mockPrismaService.matches.findMany).toHaveBeenCalledWith(
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

      expect(mockPrismaService.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ matchday: 3 }),
        }),
      );
    });

    it("should apply date filter as range", async () => {
      await service.findAllMatches({ date: "2024-02-05" });

      expect(mockPrismaService.matches.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            date: {
              gte: new Date("2024-02-05T00:00:00.000Z"),
              lt: new Date("2024-02-05T23:59:59.999Z"),
            },
          }),
        }),
      );
    });

    it("should apply search filter as OR across home and away team", async () => {
      await service.findAllMatches({ search: "Paris" });

      expect(mockPrismaService.matches.findMany).toHaveBeenCalledWith(
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
  });
});
