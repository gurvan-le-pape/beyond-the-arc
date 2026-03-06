// src/backend/modules/players/dto/players.query.dto.spec.ts
import { CompetitionLevel } from "@common/constants/competition-levels";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { GetPlayersQueryDto } from "./players.query.dto";

describe("GetPlayersQueryDto", () => {
  it("should pass validation with no fields (all optional)", async () => {
    const dto = plainToInstance(GetPlayersQueryDto, {});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it("should pass validation with all valid fields", async () => {
    const dto = plainToInstance(GetPlayersQueryDto, {
      level: CompetitionLevel.REGIONAL,
      clubId: 1,
      teamId: 1,
      teamNumber: 1,
      number: 10,
      committeeId: 1,
      leagueId: 1,
      category: "U18",
      gender: "male",
      name: "John",
      page: 1,
      limit: 50,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  describe("level", () => {
    it("should pass for valid competition level", async () => {
      for (const level of Object.values(CompetitionLevel)) {
        const dto = plainToInstance(GetPlayersQueryDto, { level });
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === "level")).toBe(false);
      }
    });

    it("should fail for invalid level", async () => {
      const dto = plainToInstance(GetPlayersQueryDto, {
        level: "invalid_level",
      });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "level")).toBe(true);
    });
  });

  describe("numeric fields", () => {
    const numericFields = [
      "clubId",
      "teamId",
      "teamNumber",
      "number",
      "committeeId",
      "leagueId",
      "page",
      "limit",
    ];

    it("should transform string values to numbers", async () => {
      const dto = plainToInstance(GetPlayersQueryDto, {
        clubId: "1",
        teamId: "2",
        teamNumber: "3",
        number: "10",
        committeeId: "4",
        leagueId: "5",
        page: "2",
        limit: "25",
      });
      expect(dto.clubId).toBe(1);
      expect(dto.teamId).toBe(2);
      expect(dto.teamNumber).toBe(3);
      expect(dto.number).toBe(10);
      expect(dto.committeeId).toBe(4);
      expect(dto.leagueId).toBe(5);
      expect(dto.page).toBe(2);
      expect(dto.limit).toBe(25);
    });

    it.each(numericFields)(
      "should fail validation when %s is not a number",
      async (field) => {
        const dto = plainToInstance(GetPlayersQueryDto, { [field]: "abc" });
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === field)).toBe(true);
      },
    );
  });

  describe("string fields", () => {
    it("should pass for valid category string", async () => {
      const dto = plainToInstance(GetPlayersQueryDto, { category: "U18" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "category")).toBe(false);
    });

    it("should pass for valid gender string", async () => {
      const dto = plainToInstance(GetPlayersQueryDto, { gender: "male" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "gender")).toBe(false);
    });

    it("should pass for valid name string", async () => {
      const dto = plainToInstance(GetPlayersQueryDto, { name: "John" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "name")).toBe(false);
    });
  });
});
