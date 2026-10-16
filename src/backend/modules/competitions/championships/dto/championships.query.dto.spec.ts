// src/backend/modules/competitions/championships/dto/championships.query.dto.spec.ts
import { CompetitionLevel } from "@common/constants";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { GetChampionshipsQueryDto } from "./championships.query.dto";

describe("GetChampionshipsQueryDto", () => {
  const validDto = {
    level: CompetitionLevel.REGIONAL,
    leagueId: 1,
  };

  describe("level", () => {
    it("should pass validation for regional level", async () => {
      const dto = plainToInstance(GetChampionshipsQueryDto, validDto);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should pass validation for departmental level", async () => {
      const dto = plainToInstance(GetChampionshipsQueryDto, {
        ...validDto,
        level: CompetitionLevel.DEPARTMENTAL,
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should fail validation for invalid level", async () => {
      const dto = plainToInstance(GetChampionshipsQueryDto, {
        ...validDto,
        level: "invalid_level",
      });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "level")).toBe(true);
    });

    it("should pass validation when level is omitted", async () => {
      const dto = plainToInstance(GetChampionshipsQueryDto, { leagueId: 1 });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe("leagueId", () => {
    it("should pass validation for valid numeric leagueId", async () => {
      const dto = plainToInstance(GetChampionshipsQueryDto, validDto);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should transform string leagueId to number", async () => {
      const dto = plainToInstance(GetChampionshipsQueryDto, {
        ...validDto,
        leagueId: "42",
      });
      expect(dto.leagueId).toBe(42);
    });

    it("should pass validation when leagueId is omitted", async () => {
      const dto = plainToInstance(GetChampionshipsQueryDto, {
        level: CompetitionLevel.REGIONAL,
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should fail validation when leagueId is not a number", async () => {
      const dto = plainToInstance(GetChampionshipsQueryDto, {
        ...validDto,
        leagueId: "abc",
      });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "leagueId")).toBe(true);
    });
  });

  describe("empty query", () => {
    it("should pass validation with no parameters", async () => {
      const dto = plainToInstance(GetChampionshipsQueryDto, {});
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});
