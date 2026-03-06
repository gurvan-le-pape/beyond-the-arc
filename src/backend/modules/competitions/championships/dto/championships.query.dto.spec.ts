// src/backend/modules/competitions/championships/dto/championships.query.dto.spec.ts
import { CompetitionLevel } from "@common/constants/competition-levels";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { GetChampionshipsQueryDto } from "./championships.query.dto";

describe("GetChampionshipsQueryDto", () => {
  const validDto = {
    level: CompetitionLevel.REGIONAL,
    id: 1,
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

    it("should fail validation when level is missing", async () => {
      const dto = plainToInstance(GetChampionshipsQueryDto, { id: 1 });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "level")).toBe(true);
    });
  });

  describe("id", () => {
    it("should pass validation for valid numeric id", async () => {
      const dto = plainToInstance(GetChampionshipsQueryDto, validDto);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should transform string id to number", async () => {
      const dto = plainToInstance(GetChampionshipsQueryDto, {
        ...validDto,
        id: "42",
      });
      expect(dto.id).toBe(42);
    });

    it("should fail validation when id is missing", async () => {
      const dto = plainToInstance(GetChampionshipsQueryDto, {
        level: CompetitionLevel.REGIONAL,
      });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "id")).toBe(true);
    });

    it("should fail validation when id is not a number", async () => {
      const dto = plainToInstance(GetChampionshipsQueryDto, {
        ...validDto,
        id: "abc",
      });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "id")).toBe(true);
    });
  });
});
