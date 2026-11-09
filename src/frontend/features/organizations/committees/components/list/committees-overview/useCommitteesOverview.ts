// src/frontend/features/organizations/committees/components/list/committees-overview/useCommitteesOverview.ts
import { useFormatter, useTranslations } from "next-intl";

import type { ChoroplethDatum } from "@/features/geography/components";
import { normalizeDepartmentCode } from "@/features/organizations/utils";
import { normalizeString } from "@/shared/utils";

import type { Committee } from "../../../types";

// A department number as shown: "1", "2A", never "01".
const codeOf = (committee: Committee) =>
  normalizeDepartmentCode(committee.department.code);

// Department order: 1, 2, 2A, 2B, 3 … 95. The number decides, then the
// Corsican letter.
function compareCommittees(a: Committee, b: Committee): number {
  const codeA = codeOf(a);
  const codeB = codeOf(b);
  return (
    Number.parseInt(codeA, 10) - Number.parseInt(codeB, 10) ||
    codeA.localeCompare(codeB)
  );
}

// A folded query matches a department's number exactly or its name in part.
function matches(committee: Committee, folded: string): boolean {
  return (
    codeOf(committee).toLowerCase() === folded.replace(/^0+/, "") ||
    normalizeString(committee.department.name).includes(folded)
  );
}

/**
 * What the committees overview draws for a search: the matching committees
 * grouped by league, the map's data, and the departments the search left out.
 *
 * Map data is keyed by the department number as shown, the same key the rows
 * highlight with.
 *
 * @param committees - every committee, in any order
 * @param regionNames - each league's region name by league id
 * @param query - the search as typed; folded for case and accents here
 * @returns the visible groups in region order, the map data and muted
 *   departments, and the largest club count, which fills a bar
 */
export function useCommitteesOverview(
  committees: Committee[],
  regionNames: Readonly<Record<number, string>>,
  query: string,
) {
  const t = useTranslations("organizations");
  const format = useFormatter();

  const folded = normalizeString(query.trim());
  const visible = [...committees]
    .sort(compareCommittees)
    .filter((committee) => !folded || matches(committee, folded));

  const groups = Object.entries(regionNames)
    .map(([id, regionName]) => ({
      leagueId: Number(id),
      regionName,
      committees: visible.filter((c) => c.leagueId === Number(id)),
    }))
    .filter((group) => group.committees.length > 0)
    .sort((a, b) => a.regionName.localeCompare(b.regionName));

  const data: Record<string, ChoroplethDatum> = Object.fromEntries(
    committees.map((c) => [
      codeOf(c),
      {
        value: c.clubCount,
        href: `/organizations/committees/${c.id}`,
        label: `${c.department.name} (${codeOf(c)}), ${format.number(c.clubCount)} ${t("header.clubs", { count: c.clubCount })}`,
      },
    ]),
  );

  const visibleCodes = new Set(visible.map(codeOf));
  const muted = folded
    ? new Set(committees.map(codeOf).filter((code) => !visibleCodes.has(code)))
    : undefined;

  return {
    groups,
    data,
    muted,
    maxClubs: Math.max(0, ...committees.map((c) => c.clubCount)),
  };
}
