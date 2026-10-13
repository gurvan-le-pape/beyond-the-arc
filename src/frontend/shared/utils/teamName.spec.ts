// src/frontend/shared/utils/teamName.spec.ts
import { describe, expect, it } from "vitest";

import { formatTeamName } from "./teamName";

describe("formatTeamName", () => {
  it("joins the club's name and the team's number", () => {
    expect(formatTeamName("ASVEL BASKET", 2)).toBe("ASVEL BASKET - 2");
  });

  it("leaves the club's name alone without a number", () => {
    expect(formatTeamName("ASVEL BASKET", null)).toBe("ASVEL BASKET");
    expect(formatTeamName("ASVEL BASKET", undefined)).toBe("ASVEL BASKET");
  });

  it("is empty without a club", () => {
    expect(formatTeamName(null, 2)).toBe("");
    expect(formatTeamName(undefined, undefined)).toBe("");
  });
});
