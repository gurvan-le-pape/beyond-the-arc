// src/backend/common/utils/pagination.util.spec.ts
import { DEFAULT_PAGE_LIMIT, resolvePagination } from "./pagination.util";

describe("resolvePagination", () => {
  it("should apply defaults when page and limit are omitted", () => {
    expect(resolvePagination({})).toEqual({
      page: 1,
      limit: DEFAULT_PAGE_LIMIT,
      skip: 0,
      take: DEFAULT_PAGE_LIMIT,
    });
  });

  it("should derive skip and take from explicit page and limit", () => {
    expect(resolvePagination({ page: 3, limit: 10 })).toEqual({
      page: 3,
      limit: 10,
      skip: 20,
      take: 10,
    });
  });

  it("should default limit independently of an explicit page", () => {
    expect(resolvePagination({ page: 2 })).toEqual({
      page: 2,
      limit: DEFAULT_PAGE_LIMIT,
      skip: DEFAULT_PAGE_LIMIT,
      take: DEFAULT_PAGE_LIMIT,
    });
  });

  it("should default page independently of an explicit limit", () => {
    expect(resolvePagination({ limit: 5 })).toEqual({
      page: 1,
      limit: 5,
      skip: 0,
      take: 5,
    });
  });
});
