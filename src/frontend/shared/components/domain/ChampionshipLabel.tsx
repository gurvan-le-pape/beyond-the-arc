// src/frontend/shared/components/domain/ChampionshipLabel.tsx
import { useTranslations } from "next-intl";

interface ChampionshipLabelProps {
  /** The age category, e.g. `Seniors`, `U18` — the same word in every locale. */
  readonly category: string;
  readonly gender: "male" | "female";
  readonly division: number;
}

/**
 * A championship's short name — category, gender and division, e.g.
 * "Seniors · Homme · Division 2" — for a row whose surroundings already name
 * the organisation.
 *
 * A championship has no name of its own: the API's `name` is English prose
 * the generator writes ("League male Seniors - Division 2"), so it is never
 * displayed. The championship page assembles the full title, organisation
 * and season included, with `buildChampionshipTitle`.
 */
export function ChampionshipLabel({
  category,
  gender,
  division,
}: ChampionshipLabelProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");

  return (
    <>
      {[
        category,
        tCommon(`gender.${gender}`),
        tCompetitions("divisionWithValue", { value: division }),
      ].join(" · ")}
    </>
  );
}

export default ChampionshipLabel;
