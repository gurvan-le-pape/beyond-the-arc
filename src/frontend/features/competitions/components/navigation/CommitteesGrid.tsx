// src/frontend/features/competitions/components/navigation/CommitteesGrid.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useRouter } from "@/navigation";
import { Input } from "@/shared/components/forms";
import { Card, ImageWithFallback } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { CompetitionLevel } from "@/shared/constants/competition-levels";
import { normalizeDepartmentCode } from "@/shared/utils";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";

import type { Committee } from "../../../organizations/committees/types/Committees";

interface CommitteesGridProps {
  readonly committees: Committee[];
}

/**
 * CommitteesGrid
 *
 * Displays a searchable grid of departmental committee cards with logos.
 * Each card is clickable and navigates to the championships for that committee.
 */
export function CommitteesGrid({ committees }: CommitteesGridProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const tCompetitions = useTranslations("competitions");
  const tCommon = useTranslations("common");

  const filtered = committees.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <Input
        variant="search"
        value={search}
        placeholder={tCompetitions("departmental.searchPlaceholder")}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch("")}
        clearAriaLabel={tCommon("clearSearch")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((committee) => (
          <Card
            key={committee.id}
            variant="default"
            padding="md"
            clickable
            onClick={() =>
              router.push(
                `/competitions/${CompetitionLevel.DEPARTMENTAL}/${committee.id}`,
              )
            }
            className="border-l-4 border-l-departmental-dark dark:border-l-departmental-light hover:border-l-divide-light dark:hover:!border-l-divide-dark flex flex-col items-center text-center"
          >
            {/* Logo placeholder */}
            <div className="mb-3 w-16 h-16 flex items-center justify-center rounded-xl bg-surface-raised dark:bg-surface-raised-dark">
              <ImageWithFallback
                src={`/images/committees/${formatNameToFileName(
                  committee.name,
                )}.webp`}
                alt={committee.name}
                fallback="/images/committees/defaultLogo.30cc7520.svg"
                className="w-12 h-12 object-contain"
              />
            </div>

            <Text variant="h3" className="text-sm leading-snug mb-1">
              {committee.name}
            </Text>

            {committee.department && (
              <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                {normalizeDepartmentCode(committee.department.code)}
              </p>
            )}
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
            {tCompetitions("departmental.noResults", { search })}
          </p>
          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            {tCompetitions("departmental.clearSearch")}
          </button>
        </div>
      )}
    </div>
  );
}

export default CommitteesGrid;
