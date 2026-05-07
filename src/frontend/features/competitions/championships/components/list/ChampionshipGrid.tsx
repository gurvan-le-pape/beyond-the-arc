// src/frontend/features/competitions/championships/components/list/ChampionshipGrid.tsx
import { useTranslations } from "next-intl";

import type { Championship } from "@/features/competitions/championships/types/Championship";

import { ChampionshipCard } from "./ChampionshipCard";

const SKELETON_KEYS = Array.from({ length: 12 }, () => crypto.randomUUID());

export function ChampionshipGrid({
  championships,
  isLoading,
}: {
  readonly championships: Championship[];
  readonly isLoading: boolean;
}) {
  const tCompetitions = useTranslations("competitions");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SKELETON_KEYS.map((key) => (
          <div
            key={key}
            className="h-32 rounded-card bg-surface-inset animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (championships.length === 0) {
    return (
      <div className="text-center py-16 text-text-secondary">
        {tCompetitions("noResults")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {championships.map((championship) => (
        <ChampionshipCard key={championship.id} championship={championship} />
      ))}
    </div>
  );
}
