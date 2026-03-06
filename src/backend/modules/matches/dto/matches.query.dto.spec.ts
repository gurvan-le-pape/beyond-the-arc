// src/backend/modules/matches/dto/matches.query.dto.spec.ts
import { CompetitionLevel } from "@common/constants/competition-levels";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { GetMatchesQueryDto } from "./matches.query.dto";

describe("GetMatchesQueryDto", () => {
  it("should pass validation with no fields (all optional)", async () => {
    const dto = plainToInstance(GetMatchesQueryDto, {});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it("should pass validation with all valid fields", async () => {
    const dto = plainToInstance(GetMatchesQueryDto, {
      level: CompetitionLevel.REGIONAL,
      division: 1,
      committeeId: 1,
      leagueId: 1,
      category: "U18",
      gender: "male",
      poolId: 1,
      championshipId: 1,
      matchday: 1,
      date: "2024-02-05",
      search: "Paris",
      page: 1,
      limit: 50,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  describe("level", () => {
    it("should pass for regional level", async () => {
      const dto = plainToInstance(GetMatchesQueryDto, {
        level: CompetitionLevel.REGIONAL,
      });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "level")).toBe(false);
    });

    it("should fail for invalid level", async () => {
      const dto = plainToInstance(GetMatchesQueryDto, {
        level: "invalid_level",
      });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "level")).toBe(true);
    });
  });

  describe("numeric fields", () => {
    it("should transform string values to numbers", async () => {
      const dto = plainToInstance(GetMatchesQueryDto, {
        division: "2",
        committeeId: "5",
        leagueId: "3",
        poolId: "10",
        championshipId: "7",
        matchday: "4",
        page: "2",
        limit: "25",
      });
      expect(dto.division).toBe(2);
      expect(dto.committeeId).toBe(5);
      expect(dto.leagueId).toBe(3);
      expect(dto.poolId).toBe(10);
      expect(dto.championshipId).toBe(7);
      expect(dto.matchday).toBe(4);
      expect(dto.page).toBe(2);
      expect(dto.limit).toBe(25);
    });

    it("should fail validation when numeric field is not a number", async () => {
      const dto = plainToInstance(GetMatchesQueryDto, { division: "abc" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "division")).toBe(true);
    });
  });

  describe("date", () => {
    it("should pass for valid YYYY-MM-DD format", async () => {
      const dto = plainToInstance(GetMatchesQueryDto, { date: "2024-02-05" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "date")).toBe(false);
    });

    it("should fail for invalid date format", async () => {
      const dto = plainToInstance(GetMatchesQueryDto, { date: "05/02/2024" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "date")).toBe(true);
    });

    it("should fail for partial date", async () => {
      const dto = plainToInstance(GetMatchesQueryDto, { date: "2024-02" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "date")).toBe(true);
    });
  });

  describe("string fields", () => {
    it("should pass for valid category string", async () => {
      const dto = plainToInstance(GetMatchesQueryDto, { category: "U18" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "category")).toBe(false);
    });

    it("should pass for valid search string", async () => {
      const dto = plainToInstance(GetMatchesQueryDto, { search: "Paris" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "search")).toBe(false);
    });
  });
});
