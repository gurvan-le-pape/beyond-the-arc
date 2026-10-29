// src/frontend/shared/utils/filterCascade.spec.ts
import { describe, expect, it } from "vitest";

import { type FilterCascades, withDependentsCleared } from "./filterCascade";

interface Filters {
  level: string;
  committee: number;
  league: number;
  division: number;
  pool: number;
  q: string;
}

const CASCADES: FilterCascades<Filters> = {
  level: ["committee", "league"],
  committee: ["division"],
  league: ["division"],
  division: ["pool"],
};

describe("withDependentsCleared", () => {
  it("leaves a filter nothing depends on as it is", () => {
    expect(withDependentsCleared({ q: "x" }, CASCADES)).toEqual({ q: "x" });
  });

  it("clears the dependents of a changed filter, all the way down", () => {
    expect(withDependentsCleared({ level: "regional" }, CASCADES)).toEqual({
      level: "regional",
      committee: undefined,
      league: undefined,
      division: undefined,
      pool: undefined,
    });
  });

  it("clears dependents when a filter is cleared too", () => {
    expect(withDependentsCleared({ division: undefined }, CASCADES)).toEqual({
      division: undefined,
      pool: undefined,
    });
  });

  it("keeps a dependent the patch sets itself", () => {
    expect(withDependentsCleared({ league: 3, division: 2 }, CASCADES)).toEqual(
      { league: 3, division: 2, pool: undefined },
    );
  });

  it("stops on a cycle", () => {
    const cyclic: FilterCascades<Filters> = { q: ["level"], level: ["q"] };
    expect(withDependentsCleared({ q: "x" }, cyclic)).toEqual({
      q: "x",
      level: undefined,
    });
  });
});
