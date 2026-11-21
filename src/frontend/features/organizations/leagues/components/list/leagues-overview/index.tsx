// src/frontend/features/organizations/leagues/components/list/leagues-overview/index.tsx
"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { ChoroplethMap } from "@/features/geography/components";
import { FRANCE_FRAME, FRANCE_REGIONS } from "@/features/geography/constants";
import { regionShapeCode } from "@/features/organizations/utils";
import { MapListLayout } from "@/shared/components/layout";

import type { League } from "../../../types";
import { LeagueRow } from "./LeagueRow";

interface LeaguesOverviewProps {
  readonly leagues: League[];
  /** Each league's committee count by league id. */
  readonly committeeCounts: Readonly<Record<number, number>>;
}

/**
 * The leagues as a map of their regions beside a list ranked by club count.
 *
 * Both halves lead to the same pages and share one highlight: hovering a
 * region lights up its row and the other way round. The list is the
 * accessible half; the map is a pointer shortcut and a picture of where the
 * clubs are.
 */
export function LeaguesOverview({
  leagues,
  committeeCounts,
}: LeaguesOverviewProps) {
  const t = useTranslations("organizations");
  const format = useFormatter();
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const rows = leagues
    .map((league) => ({ league, code: regionShapeCode(league.region.name) }))
    .sort((a, b) => b.league.clubCount - a.league.clubCount);
  const maxClubs = Math.max(0, ...leagues.map((league) => league.clubCount));

  const data = Object.fromEntries(
    rows.flatMap(({ league, code }) =>
      code
        ? [
            [
              code,
              {
                value: league.clubCount,
                href: `/organizations/leagues/${league.id}`,
                label: `${league.region.name}, ${format.number(league.clubCount)} ${t("header.clubs", { count: league.clubCount })}`,
              },
            ],
          ]
        : [],
    ),
  );

  return (
    <MapListLayout
      map={
        <>
          <ChoroplethMap
            shapes={FRANCE_REGIONS}
            frame={FRANCE_FRAME}
            data={data}
            tone="regional"
            highlighted={highlighted}
            onHighlight={setHighlighted}
          />
          <p className="mt-3 text-center text-sm text-text-secondary">
            {t("leagues.mapCaption")}
          </p>
        </>
      }
    >
      <ol className="border border-divide rounded-card overflow-hidden divide-y divide-divide">
        {rows.map(({ league, code }) => (
          <LeagueRow
            key={league.id}
            league={league}
            committeeCount={committeeCounts[league.id] ?? 0}
            maxClubs={maxClubs}
            active={code !== undefined && code === highlighted}
            onActivate={(active) =>
              setHighlighted(active ? (code ?? null) : null)
            }
          />
        ))}
      </ol>
    </MapListLayout>
  );
}
