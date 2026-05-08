// src/frontend/features/organizations/clubs/components/list/ClubsGrid.tsx
"use client";

import { useTranslations } from "next-intl";

import type { ClubBasic } from "../../types/ClubBasic";
import { ClubCard } from "./ClubCard";

const SKELETON_KEYS = Array.from({ length: 12 }, (_, i) => String(i));

const gridClass =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";

interface ClubsGridProps {
  readonly clubs: ClubBasic[];
  readonly isLoading: boolean;
  readonly search: string;
}

export function ClubsGrid({ clubs, isLoading, search }: ClubsGridProps) {
  const t = useTranslations("organizations");

  if (isLoading) {
    return (
      <div className={gridClass}>
        {SKELETON_KEYS.map((key) => (
          <div
            key={key}
            className="h-20 rounded-card bg-surface-inset animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="text-center py-16 text-text-secondary">
        {t("clubs.noResults", { search })}
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {clubs.map((club) => (
        <ClubCard key={club.id} club={club} />
      ))}
    </div>
  );
}
