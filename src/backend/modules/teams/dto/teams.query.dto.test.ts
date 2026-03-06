// src/backend/modules/teams/dto/teams.query.dto.test.ts
import { CompetitionLevel } from "@common/constants/competition-levels";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { GetTeamsQueryDto } from "./teams.query.dto";

describe("GetTeamsQueryDto", () => {
  it("should pass validation with no fields (all optional)", async () => {
    const dto = plainToInstance(GetTeamsQueryDto, {});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it("should pass validation with all valid fields", async () => {
    const dto = plainToInstance(GetTeamsQueryDto, {
      clubId: 1,
      level: CompetitionLevel.REGIONAL,
      division: 1,
      committeeId: 1,
      leagueId: 1,
      number: 1,
      category: "U18",
      gender: "male",
      clubName: "Paris",
      poolLetter: "A",
      page: 1,
      limit: 50,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  describe("level", () => {
    it("should pass for valid competition level", async () => {
      for (const level of Object.values(CompetitionLevel)) {
        const dto = plainToInstance(GetTeamsQueryDto, { level });
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === "level")).toBe(false);
      }
    });

    it("should fail for invalid level", async () => {
      const dto = plainToInstance(GetTeamsQueryDto, { level: "invalid_level" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "level")).toBe(true);
    });
  });

  describe("numeric fields", () => {
    const numericFields = [
      "clubId",
      "division",
      "committeeId",
      "leagueId",
      "number",
      "page",
      "limit",
    ];

    it("should transform string values to numbers", async () => {
      const dto = plainToInstance(GetTeamsQueryDto, {
        clubId: "1",
        division: "2",
        committeeId: "3",
        leagueId: "4",
        number: "5",
        page: "2",
        limit: "25",
      });
      expect(dto.clubId).toBe(1);
      expect(dto.division).toBe(2);
      expect(dto.committeeId).toBe(3);
      expect(dto.leagueId).toBe(4);
      expect(dto.number).toBe(5);
      expect(dto.page).toBe(2);
      expect(dto.limit).toBe(25);
    });

    it.each(numericFields)(
      "should fail validation when %s is not a number",
      async (field) => {
        const dto = plainToInstance(GetTeamsQueryDto, { [field]: "abc" });
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === field)).toBe(true);
      },
    );
  });

  describe("string fields", () => {
    it("should pass for valid category string", async () => {
      const dto = plainToInstance(GetTeamsQueryDto, { category: "U18" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "category")).toBe(false);
    });

    it("should pass for valid gender string", async () => {
      const dto = plainToInstance(GetTeamsQueryDto, { gender: "male" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "gender")).toBe(false);
    });

    it("should pass for valid clubName string", async () => {
      const dto = plainToInstance(GetTeamsQueryDto, { clubName: "Paris" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "clubName")).toBe(false);
    });

    it("should pass for valid poolLetter string", async () => {
      const dto = plainToInstance(GetTeamsQueryDto, { poolLetter: "A" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "poolLetter")).toBe(false);
    });
  });
});
