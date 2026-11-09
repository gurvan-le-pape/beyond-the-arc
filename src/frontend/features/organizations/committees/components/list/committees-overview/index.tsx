// src/frontend/features/organizations/committees/components/list/committees-overview/index.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { ChoroplethMap } from "@/features/geography/components";
import { FRANCE_FRAME } from "@/features/geography/constants";
import { DEPARTMENT_SHAPES } from "@/features/organizations/utils";
import { SearchField } from "@/shared/components/forms";

import type { Committee } from "../../../types";
import { CommitteeGroup } from "./CommitteeGroup";
import { useCommitteesOverview } from "./useCommitteesOverview";

interface CommitteesOverviewProps {
  readonly committees: Committee[];
  /** Each league's region name by league id, for the group headings. */
  readonly regionNames: Readonly<Record<number, string>>;
}

/**
 * The committees as a map of their departments beside a list grouped by
 * league, with a search that narrows both.
 *
 * Grouping by league replaces a league column that repeated thirteen names
 * down 96 rows, and lets the list run in columns. The map and the rows share
 * one highlight; the map is a pointer shortcut and the list is the accessible
 * half.
 */
export function CommitteesOverview({
  committees,
  regionNames,
}: CommitteesOverviewProps) {
  const t = useTranslations("organizations");
  const tCommon = useTranslations("common");
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const { groups, data, muted, maxClubs } = useCommitteesOverview(
    committees,
    regionNames,
    query,
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start">
      <div className="lg:sticky lg:top-24 space-y-4 max-w-md mx-auto w-full">
        <SearchField
          label={t("committees.searchLabel")}
          placeholder={t("committees.searchPlaceholder")}
          value={query}
          onChange={(value) => {
            // A row the search removes never fires its mouse-leave.
            setHighlighted(null);
            setQuery(value);
          }}
          onClear={() => setQuery("")}
          labels={{ clear: tCommon("clearSearch") }}
        />
        {/* Below md, 96 departments are too small to tap: the search and the
            list do the job there. */}
        <ChoroplethMap
          className="hidden md:block"
          shapes={DEPARTMENT_SHAPES}
          frame={FRANCE_FRAME}
          data={data}
          tone="departmental"
          highlighted={highlighted}
          onHighlight={setHighlighted}
          muted={muted}
        />
        <p className="hidden md:block text-center text-sm text-text-secondary">
          {t("committees.mapCaption")}
        </p>
      </div>

      {groups.length > 0 ? (
        <div className="columns-1 md:columns-2 gap-6">
          {groups.map((group) => (
            <CommitteeGroup
              key={group.leagueId}
              {...group}
              maxClubs={maxClubs}
              highlighted={highlighted}
              onHighlight={setHighlighted}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-text-secondary">
          {t("committees.noMatch", { query: query.trim() })}
        </p>
      )}
    </div>
  );
}
