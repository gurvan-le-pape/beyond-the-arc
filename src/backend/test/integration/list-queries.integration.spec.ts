// src/backend/test/integration/list-queries.integration.spec.ts
import { Category, CompetitionLevel, Gender } from "@common/constants";
import { LeaderboardsService } from "@modules/competitions/leaderboards/leaderboards.service";
import { MatchesService } from "@modules/matches/matches.service";
import { ClubsService } from "@modules/organizations/clubs/clubs.service";
import { PlayersService } from "@modules/players/players.service";
import { TeamsService } from "@modules/teams/teams.service";
import type { Client } from "pg";
import { PrismaService } from "prisma/prisma.service";

import {
  completeMatch,
  connect,
  createPool,
  insertScheduledMatch,
  type PoolFixture,
} from "./harness";

/**
 * Runs the list queries through real Prisma, so they exercise the generated
 * where clauses and selects against the schema rather than mocks of them.
 */
describe("list queries", () => {
  let client: Client;
  let prisma: PrismaService;
  let regional: PoolFixture;
  let departmental: PoolFixture;
  let clubName: string;
  const matches: Record<string, number> = {};
  const fixturePools: PoolFixture[] = [];

  const ids = (result: { items: { id: number }[] }) =>
    result.items.map((item) => item.id).sort((a, b) => a - b);

  beforeAll(async () => {
    client = await connect();
    prisma = new PrismaService();
    await prisma.onModuleInit();

    regional = await createPool(client, {
      level: "regional",
      category: "U18",
      gender: "male",
      division: 1,
      letter: "A",
      teamCount: 3,
    });
    departmental = await createPool(client, {
      level: "departmental",
      category: "U15",
      gender: "female",
      division: 2,
      letter: "B",
    });
    fixturePools.push(regional, departmental);

    const [first, second, third] = regional.teamIds;
    // 23:30 UTC on 28 March 2026 is already 29 March in Paris, where the
    // clocks change that night: 22:00 UTC on the 29th is midnight on the 30th.
    matches.earlyOn29 = await insertScheduledMatch(
      client,
      regional.poolId,
      first,
      second,
      "2026-03-28T23:30:00Z",
    );
    matches.lateOn29 = await insertScheduledMatch(
      client,
      regional.poolId,
      second,
      third,
      "2026-03-29T21:59:00Z",
    );
    matches.on30 = await insertScheduledMatch(
      client,
      regional.poolId,
      third,
      first,
      "2026-03-29T22:00:00Z",
    );
    matches.departmental = await insertScheduledMatch(
      client,
      departmental.poolId,
      departmental.teamIds[0],
      departmental.teamIds[1],
      "2026-04-01T12:00:00Z",
    );
    await completeMatch(client, matches.earlyOn29, 80, 70);
    await completeMatch(client, matches.lateOn29, 60, 75);

    const { rows } = await client.query<{ name: string }>(
      "SELECT name FROM clubs WHERE id = $1",
      [regional.clubIds[2]],
    );
    clubName = rows[0].name;

    await client.query(
      `INSERT INTO players (name, number, position, height_cm, weight_kg, birthdate, team_id)
       VALUES ('Zéphyrine Fixture', 7, 'PG', 180, 70, '2008-01-01', $1),
              ('Other Person', 8, 'C', 200, 95, '2008-01-01', $2)`,
      [first, departmental.teamIds[0]],
    );
  });

  afterAll(async () => {
    const pools = fixturePools.flatMap((pool) => pool.teamIds);
    const championships = fixturePools.map((pool) => pool.championshipId);
    await client.query("DELETE FROM championships WHERE id = ANY($1)", [
      championships,
    ]);
    await client.query("DELETE FROM teams WHERE id = ANY($1)", [pools]);
    await prisma.onModuleDestroy();
    await client.end();
  });

  describe("MatchesService.findAllMatches", () => {
    const service = () => new MatchesService(prisma);

    it("returns the relations the match cards read", async () => {
      const { items } = await service().findAllMatches({
        poolId: regional.poolId,
      });

      for (const match of items) {
        expect(match.pool.championship.level).toBe(CompetitionLevel.REGIONAL);
        expect(match.homeTeam.club.name).toEqual(expect.any(String));
        expect(match.awayTeam.club.name).toEqual(expect.any(String));
      }
    });

    it("reads a date as a day in Paris, across the clock change", async () => {
      const on29 = await service().findAllMatches({ date: "2026-03-29" });
      const on28 = await service().findAllMatches({ date: "2026-03-28" });
      const on30 = await service().findAllMatches({ date: "2026-03-30" });

      expect(ids(on29)).toEqual([matches.earlyOn29, matches.lateOn29]);
      expect(ids(on28)).toEqual([]);
      expect(ids(on30)).toEqual([matches.on30]);
    });

    it("filters through the pool's championship", async () => {
      const result = await service().findAllMatches({
        level: CompetitionLevel.DEPARTMENTAL,
        gender: Gender.FEMALE,
        category: Category.U15,
        division: 2,
      });

      expect(ids(result)).toEqual([matches.departmental]);
    });

    it("lets a pool id take over from the championship filters", async () => {
      const result = await service().findAllMatches({
        poolId: departmental.poolId,
        level: CompetitionLevel.REGIONAL,
      });

      expect(ids(result)).toEqual([matches.departmental]);
    });

    it("combines a club name search with an organization filter", async () => {
      const search = clubName.toLowerCase();

      const inLeague = await service().findAllMatches({
        search,
        leagueId: regional.leagueId,
        championshipId: regional.championshipId,
      });
      const elsewhere = await service().findAllMatches({
        search,
        committeeId: 999999,
      });

      expect(ids(inLeague)).toEqual([matches.lateOn29, matches.on30]);
      expect(ids(elsewhere)).toEqual([]);
    });
  });

  describe("TeamsService.findAllTeams", () => {
    const service = () => new TeamsService(prisma);

    it("filters on the team's own columns and its pool's", async () => {
      const byCategory = await service().findAllTeams({
        category: Category.U15,
        gender: Gender.FEMALE,
      });
      const byLetter = await service().findAllTeams({ poolLetter: "A" });
      const byLevel = await service().findAllTeams({
        level: CompetitionLevel.DEPARTMENTAL,
        division: 2,
      });

      expect(ids(byCategory)).toEqual(departmental.teamIds);
      expect(ids(byLetter)).toEqual(regional.teamIds);
      expect(ids(byLevel)).toEqual(departmental.teamIds);
    });

    it("returns the relations the team cards read", async () => {
      const { items } = await service().findAllTeams({ poolLetter: "A" });

      for (const team of items) {
        expect(team.club.name).toEqual(expect.any(String));
        expect(team.club.committee).toBeDefined();
        expect(team.pool?.championship.level).toBe(CompetitionLevel.REGIONAL);
      }
    });
  });

  describe("PlayersService.findAllPlayers", () => {
    const service = () => new PlayersService(prisma);

    it("searches names regardless of case", async () => {
      const { items } = await service().findAllPlayers({ search: "ZÉPHYRINE" });

      expect(items.map((player) => player.name)).toEqual(["Zéphyrine Fixture"]);
    });

    it("filters through the team and its pool", async () => {
      const { items } = await service().findAllPlayers({
        level: CompetitionLevel.DEPARTMENTAL,
      });

      expect(items.map((player) => player.name)).toEqual(["Other Person"]);
      expect(items[0].team.club.name).toEqual(expect.any(String));
    });
  });

  describe("ClubsService.findClubsByFilters", () => {
    it("keeps the clubs with a matching team", async () => {
      const service = new ClubsService(prisma);

      const { items } = await service.findClubsByFilters({
        level: CompetitionLevel.DEPARTMENTAL,
        gender: Gender.FEMALE,
      });

      expect(ids({ items })).toEqual(departmental.clubIds);
    });
  });

  describe("LeaderboardsService.findLeaderboardsByPoolId", () => {
    it("ranks the pool's teams from its matches, with each team's form", async () => {
      const service = new LeaderboardsService(prisma);
      const [first, second, third] = regional.teamIds;

      const entries = await service.findLeaderboardsByPoolId(regional.poolId);

      expect(
        entries.map(({ teamId, rank, points }) => ({ teamId, rank, points })),
      ).toEqual([
        { teamId: third, rank: 1, points: 2 },
        { teamId: first, rank: 2, points: 2 },
        { teamId: second, rank: 3, points: 2 },
      ]);
      const firstEntry = entries.find((entry) => entry.teamId === first);
      expect(firstEntry?.form.map((game) => game.result)).toEqual(["W"]);
    });

    it("counts only completed matches, and a forfeit as the loser's", async () => {
      const service = new LeaderboardsService(prisma);
      const standings = await createPool(client, {
        level: "regional",
        category: "U13",
        gender: "female",
        division: 3,
        letter: "C",
        teamCount: 3,
      });
      fixturePools.push(standings);
      const [first, second, third] = standings.teamIds;
      const insert = (home: number, away: number) =>
        insertScheduledMatch(client, standings.poolId, home, away);

      await insert(first, second);
      for (const status of ["generating", "failed"]) {
        const match = await insert(first, third);
        await client.query("UPDATE matches SET status = $1 WHERE id = $2", [
          status,
          match,
        ]);
      }
      await completeMatch(client, await insert(second, first), 0, 20, true);

      const entries = await service.findLeaderboardsByPoolId(standings.poolId);

      expect(
        entries.map(({ teamId, gamesPlayed, gamesForfeited, points }) => ({
          teamId,
          gamesPlayed,
          gamesForfeited,
          points,
        })),
      ).toEqual([
        { teamId: first, gamesPlayed: 1, gamesForfeited: 0, points: 2 },
        { teamId: third, gamesPlayed: 0, gamesForfeited: 0, points: 0 },
        { teamId: second, gamesPlayed: 1, gamesForfeited: 1, points: 0 },
      ]);
    });
  });
});
