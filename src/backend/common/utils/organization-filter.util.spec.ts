// src/backend/common/utils/organization-filter.util.spec.ts
import {
  andWhere,
  buildClubOrganizationWhere,
} from "./organization-filter.util";

describe("buildClubOrganizationWhere", () => {
  it("should return undefined when no organization filter is provided", () => {
    expect(buildClubOrganizationWhere()).toBeUndefined();
    expect(buildClubOrganizationWhere({})).toBeUndefined();
  });

  it("should filter by committeeId directly", () => {
    expect(buildClubOrganizationWhere({ committeeId: 3 })).toEqual({
      committeeId: 3,
    });
  });

  it("should filter by leagueId through the committee relation", () => {
    expect(buildClubOrganizationWhere({ leagueId: 4 })).toEqual({
      committee: { leagueId: 4 },
    });
  });

  it("should combine committeeId and leagueId as AND", () => {
    expect(
      buildClubOrganizationWhere({ committeeId: 3, leagueId: 4 }),
    ).toEqual({
      committeeId: 3,
      committee: { leagueId: 4 },
    });
  });
});

describe("andWhere", () => {
  it("should return undefined when every fragment is missing or empty", () => {
    expect(andWhere()).toBeUndefined();
    expect(andWhere(undefined, {}, undefined)).toBeUndefined();
  });

  it("should return a single fragment as-is", () => {
    expect(andWhere({ OR: [{ a: 1 }] }, undefined)).toEqual({
      OR: [{ a: 1 }],
    });
  });

  it("should AND-compose multiple fragments instead of merging keys", () => {
    expect(andWhere({ OR: [{ a: 1 }] }, { OR: [{ b: 2 }] })).toEqual({
      AND: [{ OR: [{ a: 1 }] }, { OR: [{ b: 2 }] }],
    });
  });
});
