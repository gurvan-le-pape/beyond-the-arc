// src/frontend/features/competitions/championships/components/list/ChampionshipMatrix.tsx
import { useTranslations } from "next-intl";

import type { Championship } from "@/features/competitions/championships/types";
import { Link } from "@/navigation";
import { CATEGORY_LIST, GENDER_LIST } from "@/shared/constants";
import { cn } from "@/shared/utils";

type Tone = "regional" | "departmental" | "national";

const TONE_HOVER: Record<Tone, string> = {
  regional: "hover:border-solid-regional hover:bg-tint-regional",
  departmental: "hover:border-solid-departmental hover:bg-tint-departmental",
  national: "hover:border-solid-primary hover:bg-tint-primary",
};

interface MatrixCellProps {
  readonly championships: readonly Championship[];
  readonly tone: Tone;
}

// One category and gender: its divisions in order, or a dash.
function MatrixCell({ championships, tone }: MatrixCellProps) {
  const t = useTranslations("competitions");

  if (championships.length === 0) {
    return <span className="text-text-secondary">—</span>;
  }
  return (
    <ul className="space-y-2">
      {championships.map((championship) => (
        <li key={championship.id}>
          <Link
            href={`/championships/${championship.id}`}
            className={cn(
              "flex flex-wrap items-baseline justify-between gap-x-3 rounded-md border border-divide surface-subtle px-3 py-2 transition-colors focus-ring",
              TONE_HOVER[tone],
            )}
          >
            <span className="font-medium text-text-heading">
              {t("divisionWithValue", { value: championship.division })}
            </span>
            <span className="text-sm text-text-secondary tabular-nums">
              {t("poolCount", { count: championship.pools.length })}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

interface ChampionshipMatrixProps {
  readonly championships: readonly Championship[];
  /** Names the table for assistive technology: "Bretagne championships …". */
  readonly caption: string;
  readonly tone: Tone;
}

/**
 * One organiser's championships laid out the way they are organised: a row
 * per category, a column per gender, and in each cell the divisions, each a
 * link to its championship with its pool count.
 *
 * Every organiser runs the same categories for both genders, so the grid is
 * the structure itself and needs no filters. A slot with no championship
 * shows a dash.
 */
export function ChampionshipMatrix({
  championships,
  caption,
  tone,
}: ChampionshipMatrixProps) {
  const tCommon = useTranslations("common");

  const cell = (category: string, gender: string) =>
    championships
      .filter((c) => c.category === category && c.gender === gender)
      .sort((a, b) => a.division - b.division);

  return (
    <table className="w-full table-fixed border-separate border-spacing-x-2 border-spacing-y-0 -mx-2">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          <td className="w-16 sm:w-24" />
          {GENDER_LIST.map((gender) => (
            <th
              key={gender}
              scope="col"
              className="pb-2 text-left text-sm font-semibold text-text-secondary"
            >
              {tCommon(`gender.${gender}`)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {CATEGORY_LIST.map((category) => (
          <tr key={category}>
            <th
              scope="row"
              className="py-3 pr-2 text-left align-top font-semibold text-text-heading border-t border-divide"
            >
              {tCommon(`category.${category}`)}
            </th>
            {GENDER_LIST.map((gender) => (
              <td
                key={gender}
                className="py-3 align-top border-t border-divide"
              >
                <MatrixCell
                  championships={cell(category, gender)}
                  tone={tone}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
