// src/frontend/features/competitions/championships/components/list/NationalChampionships.tsx
"use client";

import { Trophy } from "lucide-react";
import { useTranslations } from "next-intl";

import { useChampionships } from "@/features/competitions/championships/api";
import {
  EmptyState,
  ErrorMessage,
  Spinner,
} from "@/shared/components/feedback";
import { CompetitionLevel } from "@/shared/constants";

import { ChampionshipMatrix } from "../ChampionshipMatrix";

/**
 * The national championships, under their tab of the championships page, as
 * one category × gender matrix: there is no organiser to choose between.
 *
 * The import holds no national championships, so the tab shows its empty
 * state; it stays to show where that level sits.
 */
export function NationalChampionships() {
  const t = useTranslations("competitions");
  const tCommon = useTranslations("common");
  const { data, error, isLoading, refetch } = useChampionships({
    level: CompetitionLevel.NATIONAL,
    page: 1,
    limit: 100,
  });
  const championships = data?.items ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }
  if (error) {
    return (
      <ErrorMessage
        message={tCommon("errors.fetchChampionships")}
        onRetry={refetch}
      />
    );
  }
  return championships.length > 0 ? (
    <ChampionshipMatrix
      championships={championships}
      caption={t("title")}
      tone="national"
    />
  ) : (
    <EmptyState
      icon={<Trophy className="w-16 h-16" />}
      title={tCommon("emptyState.championships")}
    />
  );
}
