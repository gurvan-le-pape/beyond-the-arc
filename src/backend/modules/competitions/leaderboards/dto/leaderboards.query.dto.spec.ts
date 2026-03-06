// src/backend/modules/competitions/leaderboards/dto/leaderboards.query.dto.spec.ts
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { GetLeaderboardsQueryDto } from "./leaderboards.query.dto";

describe("GetLeaderboardsQueryDto", () => {
  describe("poolId", () => {
    it("should pass validation for valid numeric poolId", async () => {
      const dto = plainToInstance(GetLeaderboardsQueryDto, { poolId: 1 });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should transform string poolId to number", async () => {
      const dto = plainToInstance(GetLeaderboardsQueryDto, { poolId: "42" });
      expect(dto.poolId).toBe(42);
    });

    it("should fail validation when poolId is missing", async () => {
      const dto = plainToInstance(GetLeaderboardsQueryDto, {});
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "poolId")).toBe(true);
    });

    it("should fail validation when poolId is not a number", async () => {
      const dto = plainToInstance(GetLeaderboardsQueryDto, { poolId: "abc" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "poolId")).toBe(true);
    });
  });
});
