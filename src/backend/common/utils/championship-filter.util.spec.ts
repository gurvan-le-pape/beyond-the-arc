// src/backend/common/utils/championship-filter.util.spec.ts
import { Category, CompetitionLevel, Gender } from "@common/constants";

import { buildChampionshipWhere } from "./championship-filter.util";

describe("buildChampionshipWhere", () => {
  it("returns undefined when no filter is provided", () => {
    expect(buildChampionshipWhere({})).toBeUndefined();
  });

  it("keeps only the filters that are provided", () => {
    expect(
      buildChampionshipWhere({ level: CompetitionLevel.REGIONAL }),
    ).toStrictEqual({ level: CompetitionLevel.REGIONAL });
  });

  it("combines every championship filter", () => {
    expect(
      buildChampionshipWhere({
        level: CompetitionLevel.REGIONAL,
        division: 2,
        category: Category.U18,
        gender: Gender.MALE,
      }),
    ).toStrictEqual({
      level: CompetitionLevel.REGIONAL,
      division: 2,
      category: Category.U18,
      gender: Gender.MALE,
    });
  });

  it("ignores fields that are not championship filters", () => {
    const filters = { division: 1, poolId: 9, search: "bas" };

    expect(buildChampionshipWhere(filters)).toStrictEqual({ division: 1 });
  });
});
