// src/frontend/features/matches/components/detail/match-events/event-filters/PlayerDropdownFilter.tsx
"use client";

import { useTranslations } from "next-intl";

import type { MatchTeamWithStats } from "@/features/matches/types";
import { MultiSelect } from "@/shared/components/primitives";

interface PlayerDropdownFilterProps {
  readonly homeTeam: MatchTeamWithStats;
  readonly awayTeam: MatchTeamWithStats;
  readonly selectedPlayerIds: Set<number>;
  readonly setSelectedPlayerIds: (ids: Set<number>) => void;
  readonly togglePlayer: (id: number) => void;
}

/**
 * Player multi-select filter.
 *
 * Thin wrapper around MultiSelect — maps team players into the
 * generic column/item shape. All popover, animation, and clear logic
 * lives in MultiSelect.
 */
export function PlayerDropdownFilter({
  homeTeam,
  awayTeam,
  selectedPlayerIds,
  setSelectedPlayerIds,
  togglePlayer,
}: PlayerDropdownFilterProps) {
  const t = useTranslations("matches");
  const tCommon = useTranslations("common");

  const toColumn = (team: MatchTeamWithStats) => ({
    title: team.name,
    items: [...team.players]
      .sort((a, b) => a.player.number - b.player.number)
      .map((p) => ({
        id: p.player.id,
        label: `#${p.player.number} ${p.player.name}`,
        checked: selectedPlayerIds.has(p.player.id),
        onToggle: () => togglePlayer(p.player.id),
      })),
  });

  return (
    <MultiSelect
      labels={{
        summary: (count) =>
          tCommon("multiSelectSummary", {
            label: t("matchEvents.players"),
            count,
          }),
        close: tCommon("close"),
        clear: tCommon("clearSelection"),
      }}
      label={t("matchEvents.players")}
      selectedCount={selectedPlayerIds.size}
      onClear={() => setSelectedPlayerIds(new Set())}
      columns={[toColumn(homeTeam), toColumn(awayTeam)]}
    />
  );
}
