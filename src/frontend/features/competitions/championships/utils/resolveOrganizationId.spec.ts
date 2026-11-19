// src/frontend/features/competitions/championships/utils/resolveOrganizationId.spec.ts
import { describe, expect, it } from "vitest";

import { championship } from "./championshipFixtures";
import { resolveOrganizationId } from "./resolveOrganizationId";

describe("resolveOrganizationId", () => {
  it("is the committee at departmental level", () => {
    expect(
      resolveOrganizationId(
        championship(1, { level: "departmental", committeeId: 29 }),
      ),
    ).toBe(29);
  });

  it("is the league otherwise", () => {
    expect(resolveOrganizationId(championship(1, { leagueId: 10 }))).toBe(10);
  });

  it("is null when the level's organisation is unset", () => {
    expect(
      resolveOrganizationId(
        championship(1, { level: "departmental", committeeId: null }),
      ),
    ).toBeNull();
  });
});
