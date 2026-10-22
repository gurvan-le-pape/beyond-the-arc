// src/frontend/features/competitions/championships/components/list/ChampionshipTable.tsx
import { useTranslations } from "next-intl";

import type { Championship } from "@/features/competitions/championships/types";
import { buildChampionshipTitle } from "@/features/competitions/championships/utils";
import { DataTable, type TableColumn } from "@/shared/components/table";
import { CompetitionLevel } from "@/shared/constants";

interface ChampionshipTableProps {
  /** The tab's level: which organiser, if any, leads each row. */
  readonly level: CompetitionLevel;
  readonly championships: Championship[];
  readonly emptyMessage: string;
}

/**
 * One level's championships, a row each: the organiser's place, then what
 * tells the championship apart — category, gender, division — and its pool
 * count. Each row links to the championship.
 *
 * The level is the tab's, so it is not repeated on every row; the organiser
 * column is the league's region at regional level, the committee's department
 * at departmental level, and absent at national level, where there is none.
 */
export function ChampionshipTable({
  level,
  championships,
  emptyMessage,
}: ChampionshipTableProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");

  const labelsFor = (championship: Championship) => ({
    gender: tCommon(`gender.${championship.gender}`),
    division: tCompetitions("divisionWithValue", {
      value: championship.division,
    }),
  });

  const organizerColumn: TableColumn<Championship> | null =
    level === CompetitionLevel.REGIONAL
      ? {
          key: "league",
          header: tCompetitions("listColumns.league"),
          align: "left",
          emphasis: true,
          render: (row) => row.regionName,
        }
      : level === CompetitionLevel.DEPARTMENTAL
        ? {
            key: "committee",
            header: tCompetitions("listColumns.committee"),
            align: "left",
            emphasis: true,
            render: (row) => row.departmentName,
          }
        : null;

  const columns: TableColumn<Championship>[] = [
    ...(organizerColumn ? [organizerColumn] : []),
    {
      key: "category",
      header: tCompetitions("listColumns.category"),
      align: "left",
      render: (row) =>
        row.category ? tCommon(`category.${row.category}`) : "",
    },
    {
      key: "gender",
      header: tCompetitions("listColumns.gender"),
      align: "left",
      render: (row) => tCommon(`gender.${row.gender}`),
    },
    {
      key: "division",
      // Abbreviated on a phone, where the full word pushes the column past the
      // screen's edge; the full word stays on the abbreviation.
      header: (
        <>
          <abbr
            title={tCompetitions("listColumns.division")}
            className="no-underline sm:hidden"
          >
            {tCompetitions("listColumns.divisionAbbr")}
          </abbr>
          <span className="hidden sm:inline">
            {tCompetitions("listColumns.division")}
          </span>
        </>
      ),
      numeric: true,
      render: (row) => row.division,
    },
    {
      key: "pools",
      header: tCompetitions("listColumns.pools"),
      numeric: true,
      from: "sm",
      render: (row) => row.pools.length,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={championships}
      getRowKey={(row) => row.id}
      getRowHref={(row) => `/championships/${row.id}`}
      getRowLabel={(row) => buildChampionshipTitle(row, labelsFor(row))}
      frame="outline"
      density="cozy"
      emptyMessage={emptyMessage}
    />
  );
}
