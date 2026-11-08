// src/backend/modules/organizations/clubs/dto/clubs.query.dto.spec.ts
import { CompetitionLevel } from "@common/constants";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import {
  GetClubsQueryDto,
  GetClubStatsByDepartmentQueryDto,
} from "./clubs.query.dto";

describe("GetClubsQueryDto", () => {
  it("should pass validation with no fields (all optional)", async () => {
    const dto = plainToInstance(GetClubsQueryDto, {});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it("should pass validation with all valid fields", async () => {
    const dto = plainToInstance(GetClubsQueryDto, {
      level: CompetitionLevel.REGIONAL,
      committeeId: 1,
      leagueId: 1,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  describe("level", () => {
    it("should pass for valid competition level", async () => {
      for (const level of Object.values(CompetitionLevel)) {
        const dto = plainToInstance(GetClubsQueryDto, { level });
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === "level")).toBe(false);
      }
    });

    it("should fail for invalid level", async () => {
      const dto = plainToInstance(GetClubsQueryDto, { level: "invalid" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "level")).toBe(true);
    });
  });

  describe("numeric fields", () => {
    it("should transform string committeeId to number", async () => {
      const dto = plainToInstance(GetClubsQueryDto, { committeeId: "5" });
      expect(dto.committeeId).toBe(5);
    });

    it("should transform string leagueId to number", async () => {
      const dto = plainToInstance(GetClubsQueryDto, { leagueId: "3" });
      expect(dto.leagueId).toBe(3);
    });

    it("should fail validation when committeeId is not a number", async () => {
      const dto = plainToInstance(GetClubsQueryDto, { committeeId: "abc" });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "committeeId")).toBe(true);
    });
  });
});

describe("GetClubStatsByDepartmentQueryDto", () => {
  it("should pass validation with no fields (all optional)", async () => {
    const dto = plainToInstance(GetClubStatsByDepartmentQueryDto, {});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it("should transform string leagueId to number", async () => {
    const dto = plainToInstance(GetClubStatsByDepartmentQueryDto, {
      leagueId: "3",
    });
    expect(dto.leagueId).toBe(3);
  });

  it("should fail validation when leagueId is not a number", async () => {
    const dto = plainToInstance(GetClubStatsByDepartmentQueryDto, {
      leagueId: "abc",
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === "leagueId")).toBe(true);
  });
});
