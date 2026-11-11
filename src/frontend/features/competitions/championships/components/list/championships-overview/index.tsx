// src/frontend/features/competitions/championships/components/list/championships-overview/index.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useChampionshipsFilterState } from "@/features/competitions/championships/hooks";
import { ErrorMessage } from "@/shared/components/feedback";
import { MapListLayout } from "@/shared/components/layout";

import { LEVEL_CONFIG } from "./levelConfig";
import { OrganiserChampionships } from "./OrganiserChampionships";
import { OrganiserMap } from "./OrganiserMap";
import { OrganiserPicker } from "./OrganiserPicker";
import { type OrganiserLevel, useOrganisers } from "./useOrganisers";

interface ChampionshipsOverviewProps {
  readonly level: OrganiserLevel;
}

/**
 * One level's championships, reached through who organises them: pick a
 * league (regional) or a committee (departmental) on the map or in the list,
 * and its championships open as a category × gender matrix.
 *
 * The choice lives in the query string (`league` or `committee`), so it
 * survives a reload and can be linked to. The map is a pointer shortcut,
 * hidden below lg; the list is the accessible path and the phone's.
 */
export function ChampionshipsOverview({ level }: ChampionshipsOverviewProps) {
  const tCommon = useTranslations("common");
  const config = LEVEL_CONFIG[level];
  const [hovered, setHovered] = useState<string | null>(null);
  const { filters, set } = useChampionshipsFilterState();
  const { organisers, error, retry } = useOrganisers(level);

  const selectedId = filters[config.param];
  const selected = organisers.find((o) => o.id === selectedId);
  const select = (id: number | undefined) => {
    setHovered(null);
    set({ [config.param]: id });
  };
  const hrefFor = (id: number) =>
    `/championships?tab=${level}&${config.param}=${id}`;

  return (
    <MapListLayout
      hideMapBelowLg
      map={
        <OrganiserMap
          level={level}
          organisers={organisers}
          selected={selected}
          hovered={hovered}
          onHover={setHovered}
          hrefFor={hrefFor}
          onSelect={select}
        />
      }
    >
      <div className="space-y-4">
        {error && (
          <ErrorMessage message={tCommon(config.fetchError)} onRetry={retry} />
        )}
        {selectedId === undefined ? (
          <OrganiserPicker
            level={level}
            organisers={organisers}
            highlighted={hovered}
            onHighlight={setHovered}
            hrefFor={hrefFor}
            onSelect={select}
          />
        ) : (
          <OrganiserChampionships
            key={selectedId}
            level={level}
            id={selectedId}
            organiser={selected}
            onBack={() => select(undefined)}
          />
        )}
      </div>
    </MapListLayout>
  );
}
