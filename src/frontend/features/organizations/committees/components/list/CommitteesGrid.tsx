// src/frontend/features/organizations/committees/components/list/CommitteesGrid.tsx
"use client";

import { useTranslations } from "next-intl";

import { normalizeDepartmentCode } from "@/features/organizations/utils";

import type { Committee } from "../../types";
import { CommitteeCard } from "./CommitteeCard";

interface CommitteesGridProps {
  readonly committees: Committee[];
}

export function CommitteesGrid({ committees }: CommitteesGridProps) {
  const t = useTranslations("clubs");

  const sorted = [...committees].sort((a, b) => {
    const ca = normalizeDepartmentCode(a.department.code);
    const cb = normalizeDepartmentCode(b.department.code);
    const numA = Number.parseInt(ca, 10);
    const numB = Number.parseInt(cb, 10);
    if (numA !== numB) return numA - numB;
    const letterA = ca.replace(/\d+/, "");
    const letterB = cb.replace(/\d+/, "");
    return letterA.localeCompare(letterB);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sorted.map((committee) => (
        <CommitteeCard
          key={committee.id}
          committee={committee}
          clubLabel={committee.clubCount === 1 ? t("club") : t("clubs")}
        />
      ))}
    </div>
  );
}
