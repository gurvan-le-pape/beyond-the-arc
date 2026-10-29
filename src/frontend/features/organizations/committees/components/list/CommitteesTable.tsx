// src/frontend/features/organizations/committees/components/list/CommitteesTable.tsx
import { useTranslations } from "next-intl";

import {
  namesMatch,
  normalizeDepartmentCode,
} from "@/features/organizations/utils";
import { DataTable, type TableColumn } from "@/shared/components/table";
import { formatCommitteeName } from "@/shared/utils";

import type { Committee } from "../../types";

// Department order: 1, 2, 2A, 2B, 3 … 95. The number decides, then the
// Corsican letter.
function compareCommittees(a: Committee, b: Committee): number {
  const codeA = normalizeDepartmentCode(a.department.code);
  const codeB = normalizeDepartmentCode(b.department.code);
  return (
    Number.parseInt(codeA, 10) - Number.parseInt(codeB, 10) ||
    codeA.localeCompare(codeB)
  );
}

interface CommitteesTableProps {
  readonly committees: Committee[];
  /** Each league's region name by league id, for the league column. */
  readonly regionNames: Record<number, string>;
}

/**
 * The committees listing, a row per committee in department order: its code,
 * department, league and club count. Each row links to the committee.
 *
 * The federation's own capitalised name is shown under the department only
 * where it says something the department name does not ("RHONE ET METROPOLE
 * DE LYON"). On a phone the league steps aside.
 */
export function CommitteesTable({
  committees,
  regionNames,
}: CommitteesTableProps) {
  const t = useTranslations("organizations");

  const columns: TableColumn<Committee>[] = [
    {
      key: "code",
      header: t("committees.columns.code"),
      align: "left",
      width: "fit",
      render: (committee) => normalizeDepartmentCode(committee.department.code),
    },
    {
      key: "department",
      header: t("committees.columns.department"),
      align: "left",
      emphasis: true,
      render: (committee) => {
        const officialName = formatCommitteeName(committee.name);
        return (
          <>
            {committee.department.name}
            {namesMatch(officialName, committee.department.name) ? null : (
              <span className="block text-xs font-normal text-text-secondary">
                {officialName}
              </span>
            )}
          </>
        );
      },
    },
    {
      key: "league",
      header: t("committees.columns.league"),
      align: "left",
      from: "sm",
      render: (committee) => regionNames[committee.leagueId] ?? "—",
    },
    {
      key: "clubs",
      header: t("committees.columns.clubs"),
      numeric: true,
      width: "fit",
      render: (committee) => committee.clubCount,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={[...committees].sort(compareCommittees)}
      getRowKey={(committee) => committee.id}
      getRowHref={(committee) => `/organizations/committees/${committee.id}`}
      getRowLabel={(committee) => committee.department.name}
      density="compact"
      emptyMessage={t("committees.empty")}
    />
  );
}
