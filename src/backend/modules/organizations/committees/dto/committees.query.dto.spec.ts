// src/backend/modules/organizations/committees/dto/committees.query.dto.spec.ts
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { GetCommitteesQueryDto } from "./committees.query.dto";

describe("GetCommitteesQueryDto", () => {
  it("should pass validation with no fields (all optional)", async () => {
    const dto = plainToInstance(GetCommitteesQueryDto, {});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it("should pass validation for valid numeric leagueId", async () => {
    const dto = plainToInstance(GetCommitteesQueryDto, { leagueId: 1 });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it("should transform string leagueId to number", async () => {
    const dto = plainToInstance(GetCommitteesQueryDto, { leagueId: "3" });
    expect(dto.leagueId).toBe(3);
  });

  it("should fail validation when leagueId is not a number", async () => {
    const dto = plainToInstance(GetCommitteesQueryDto, { leagueId: "abc" });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === "leagueId")).toBe(true);
  });
});
