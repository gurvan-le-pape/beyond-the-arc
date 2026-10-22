// src/frontend/features/competitions/championships/components/ChampionshipGrid.tsx
import { useTranslations } from "next-intl";

import type { Championship } from "@/features/competitions/championships/types";
import { buildChampionshipHeading } from "@/features/competitions/championships/utils";
import { Section } from "@/shared/components/blocks";
import {
  DataTable,
  TableCellLink,
  type TableColumn,
} from "@/shared/components/table";
import { type Category, CATEGORY_LIST, Gender } from "@/shared/constants";

interface ChampionshipGridProps {
  /** One organiser's championships. */
  readonly championships: Championship[];
  readonly title: string;
  readonly emptyMessage: string;
}

interface CategoryRow {
  readonly category: Category;
  readonly byGender: Record<string, Championship[]>;
}

/**
 * One organiser's championships as a grid: a row per category, youngest first,
 * and a column per gender holding a link to each division.
 *
 * Every championship is one link, named in full for a screen reader — the
 * visible "Division 1" means something only under its row and column.
 */
export function ChampionshipGrid({
  championships,
  title,
  emptyMessage,
}: ChampionshipGridProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");

  const rows: CategoryRow[] = CATEGORY_LIST.map((category) => {
    const inCategory = championships
      .filter((championship) => championship.category === category)
      .sort((a, b) => a.division - b.division);
    return {
      category,
      byGender: {
        [Gender.FEMALE]: inCategory.filter((c) => c.gender === Gender.FEMALE),
        [Gender.MALE]: inCategory.filter((c) => c.gender === Gender.MALE),
      },
    };
  }).filter((row) =>
    Object.values(row.byGender).some((list) => list.length > 0),
  );

  const divisionLinks = (list: Championship[]) =>
    list.length === 0 ? (
      "—"
    ) : (
      <span className="flex flex-wrap gap-x-4 gap-y-1">
        {list.map((championship) => (
          <TableCellLink
            key={championship.id}
            href={`/championships/${championship.id}`}
            aria-label={buildChampionshipHeading(championship, {
              gender: tCommon(`gender.${championship.gender}`),
              division: tCompetitions("divisionWithValue", {
                value: championship.division,
              }),
            })}
          >
            {tCompetitions("divisionWithValue", {
              value: championship.division,
            })}
          </TableCellLink>
        ))}
      </span>
    );

  const columns: TableColumn<CategoryRow>[] = [
    {
      key: "category",
      header: tCompetitions("listColumns.category"),
      align: "left",
      emphasis: true,
      width: "fit",
      render: (row) => tCommon(`category.${row.category}`),
    },
    ...[Gender.FEMALE, Gender.MALE].map(
      (gender): TableColumn<CategoryRow> => ({
        key: gender,
        header: tCommon(`gender.${gender}`),
        align: "left",
        render: (row) => divisionLinks(row.byGender[gender]),
      }),
    ),
  ];

  return (
    <Section title={title}>
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.category}
        density="cozy"
        emptyMessage={emptyMessage}
      />
    </Section>
  );
}
