// src/backend/common/utils/ffbb-links.util.spec.ts
import {
  ffbbClubUrl,
  ffbbCommitteeUrl,
  ffbbLeagueUrl,
} from "./ffbb-links.util";

describe("FFBB links", () => {
  it("builds a league page from one of its club codes", () => {
    expect(ffbbLeagueUrl("SUD0013011")).toBe(
      "https://competitions.ffbb.com/ligues/sud",
    );
  });

  it("builds a committee page from one of its club codes", () => {
    expect(ffbbCommitteeUrl("SUD0013011")).toBe(
      "https://competitions.ffbb.com/ligues/sud/comites/0013",
    );
    // A merged committee: Lozère's clubs carry Aveyron's committee code.
    expect(ffbbCommitteeUrl("OCC1248005")).toBe(
      "https://competitions.ffbb.com/ligues/occ/comites/1248",
    );
  });

  it("builds a club page from its code", () => {
    expect(ffbbClubUrl("SUD0013011")).toBe(
      "https://competitions.ffbb.com/ligues/sud/comites/0013/clubs/sud0013011",
    );
  });

  it.each([null, "", "PRES-SUD0013011", "SUD13011", "sud0013011"])(
    "returns null for a missing or malformed code (%p)",
    (code) => {
      expect(ffbbLeagueUrl(code)).toBeNull();
      expect(ffbbCommitteeUrl(code)).toBeNull();
      expect(ffbbClubUrl(code)).toBeNull();
    },
  );
});
