// src/backend/common/dto/pagination.query.dto.spec.ts
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { PaginationQueryDto } from "./pagination.query.dto";

describe("PaginationQueryDto", () => {
  it("should pass validation with no fields (all optional)", async () => {
    const dto = plainToInstance(PaginationQueryDto, {});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it("should transform string values to numbers", async () => {
    const dto = plainToInstance(PaginationQueryDto, {
      page: "2",
      limit: "25",
    });
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(25);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  describe("page", () => {
    it("should fail when page is less than 1", async () => {
      for (const page of [0, -1]) {
        const dto = plainToInstance(PaginationQueryDto, { page });
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === "page")).toBe(true);
      }
    });

    it("should fail when page is not an integer", async () => {
      for (const page of [1.5, "abc"]) {
        const dto = plainToInstance(PaginationQueryDto, { page });
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === "page")).toBe(true);
      }
    });
  });

  describe("limit", () => {
    it("should pass at the maximum of 100", async () => {
      const dto = plainToInstance(PaginationQueryDto, { limit: 100 });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should fail when limit exceeds 100", async () => {
      const dto = plainToInstance(PaginationQueryDto, { limit: 101 });
      const errors = await validate(dto);
      expect(errors.some((e) => e.property === "limit")).toBe(true);
    });

    it("should fail when limit is less than 1", async () => {
      for (const limit of [0, -1]) {
        const dto = plainToInstance(PaginationQueryDto, { limit });
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === "limit")).toBe(true);
      }
    });

    it("should fail when limit is not an integer", async () => {
      for (const limit of [1.5, "abc"]) {
        const dto = plainToInstance(PaginationQueryDto, { limit });
        const errors = await validate(dto);
        expect(errors.some((e) => e.property === "limit")).toBe(true);
      }
    });
  });
});
