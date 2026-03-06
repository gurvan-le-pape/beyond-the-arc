// src/backend/modules/competitions/pools/dto/pools.query.dto.spec.ts
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { GetPoolsByChampionshipIdQueryDto } from "./pools.query.dto";

describe("GetPoolsByChampionshipIdQueryDto", () => {
  describe("championshipId", () => {
    it("should pass validation for valid numeric championshipId", async () => {
      const dto = plainToInstance(GetPoolsByChampionshipIdQueryDto, {
        championshipId: 1,
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should transform string championshipId to number", async () => {
      const dto = plainToInstance(GetPoolsByChampionshipIdQueryDto, {
        championshipId: "42",
      });
      expect(dto.championshipId).toBe(42);
    });

    it("should fail validation when championshipId is missing", async () => {
      const dto = plainToInstance(GetPoolsByChampionshipIdQueryDto, {});
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "championshipId")).toBe(true);
    });

    it("should fail validation when championshipId is not a number", async () => {
      const dto = plainToInstance(GetPoolsByChampionshipIdQueryDto, {
        championshipId: "abc",
      });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "championshipId")).toBe(true);
    });
  });
});
