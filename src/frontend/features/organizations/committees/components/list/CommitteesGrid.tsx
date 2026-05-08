// src/frontend/features/organizations/committees/components/list/CommitteesGrid.tsx
"use client";

import { useTranslations } from "next-intl";

import type { Committee } from "../../types";
import { CommitteeCard } from "./CommitteeCard";

interface CommitteesGridProps {
  readonly committees: Committee[];
}

export function CommitteesGrid({ committees }: CommitteesGridProps) {
  const t = useTranslations("clubs");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {committees.map((committee) => (
        <CommitteeCard
          key={committee.id}
          committee={committee}
          clubLabel={committee.clubCount === 1 ? t("club") : t("clubs")}
        />
      ))}
    </div>
  );
}
