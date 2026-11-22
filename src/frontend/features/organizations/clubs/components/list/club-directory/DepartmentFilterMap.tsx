// src/frontend/features/organizations/clubs/components/list/club-directory/DepartmentFilterMap.tsx
"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import type { ChoroplethDatum } from "@/features/geography/components";
import { ChoroplethMap } from "@/features/geography/components";
import { FRANCE_FRAME } from "@/features/geography/constants";
import type { Committee } from "@/features/organizations/committees/types";
import {
  DEPARTMENT_SHAPES,
  normalizeDepartmentCode,
} from "@/features/organizations/utils";
import type { FilterProps } from "@/shared/hooks";

import type { ClubsFilterValues } from "./useClubsFilterState";

const codeOf = (committee: Committee) =>
  normalizeDepartmentCode(committee.department.code);

interface DepartmentFilterMapProps extends FilterProps<ClubsFilterValues> {
  readonly committees: readonly Committee[];
}

/**
 * The departments shaded by their number of clubs, as a location filter:
 * a click narrows the list to that department's committee, a second click
 * lifts it.
 *
 * Departments outside the selected league or committee fade, and the selected
 * one stays outlined. The league and committee selects remain the keyboard and
 * screen-reader path to the same filter; the map is a pointer shortcut, and is
 * left out below lg, where it would sit above the results instead of beside
 * them.
 */
export function DepartmentFilterMap({
  committees,
  filters,
  set,
}: DepartmentFilterMapProps) {
  const t = useTranslations("organizations");
  const format = useFormatter();
  const [hovered, setHovered] = useState<string | null>(null);

  const byCode = new Map(committees.map((c) => [codeOf(c), c]));
  const data: Record<string, ChoroplethDatum> = Object.fromEntries(
    committees.map((c) => [
      codeOf(c),
      {
        value: c.clubCount,
        href: `/organizations/clubs?league=${c.leagueId}&committee=${c.id}`,
        label: `${c.department.name} (${codeOf(c)}), ${format.number(c.clubCount)} ${t("header.clubs", { count: c.clubCount })}`,
      },
    ]),
  );
  const muted = new Set(
    committees
      .filter(
        (c) =>
          (filters.league !== undefined && c.leagueId !== filters.league) ||
          (filters.committee !== undefined && c.id !== filters.committee),
      )
      .map(codeOf),
  );
  const selected = committees.find((c) => c.id === filters.committee);

  return (
    // Capped so the filters, once they grow chips, and the map still fit a
    // laptop screen together.
    <div className="hidden lg:block space-y-2 max-w-72 mx-auto">
      <ChoroplethMap
        shapes={DEPARTMENT_SHAPES}
        frame={FRANCE_FRAME}
        data={data}
        tone="clubs"
        highlighted={hovered ?? (selected ? codeOf(selected) : null)}
        onHighlight={setHovered}
        onSelect={(code) => {
          const committee = byCode.get(code);
          if (!committee) return;
          set(
            committee.id === filters.committee
              ? { committee: undefined }
              : { league: committee.leagueId, committee: committee.id },
          );
        }}
        muted={muted}
      />
      <p className="text-center text-sm text-text-secondary">
        {t("clubs.mapCaption")}
      </p>
    </div>
  );
}
