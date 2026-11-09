// src/frontend/features/competitions/championships/components/list/championships-overview/OrganiserChampionships.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { useChampionships } from "@/features/competitions/championships/api";
import type { Championship } from "@/features/competitions/championships/types";
import { ErrorMessage, Spinner } from "@/shared/components/feedback";
import { Button } from "@/shared/components/primitives";

import { ChampionshipMatrix } from "../ChampionshipMatrix";
import { LEVEL_CONFIG } from "./levelConfig";
import type { Organiser, OrganiserLevel } from "./useOrganisers";

// Every organiser runs at most 48 championships, so one page holds them all.
const ALL = 100;

// "29 · Finistère" for a committee, the region's name for a league.
function displayName(organiser: Organiser | undefined): string {
  if (!organiser) return "";
  return organiser.group === undefined
    ? organiser.name
    : `${organiser.code} · ${organiser.name}`;
}

interface SummaryProps {
  readonly organiser: Organiser | undefined;
  readonly championships: readonly Championship[] | undefined;
}

// The league's region for a committee, then how many championships and pools.
function Summary({ organiser, championships }: SummaryProps) {
  const t = useTranslations("competitions");
  const parts = [organiser?.group];
  if (championships) {
    parts.push(
      t("organiserSummary", {
        championships: championships.length,
        pools: championships.reduce((sum, c) => sum + c.pools.length, 0),
      }),
    );
  }
  return (
    <p className="text-sm text-text-secondary min-h-5">
      {parts.filter(Boolean).join(" · ")}
    </p>
  );
}

interface OrganiserChampionshipsProps {
  readonly level: OrganiserLevel;
  readonly id: number;
  /** Undefined while the organiser list loads, or for an unknown id. */
  readonly organiser: Organiser | undefined;
  readonly onBack: () => void;
}

/**
 * The chosen league's or committee's championships: its name, how many it
 * runs, and the category × gender matrix, with a way back to the list.
 */
export function OrganiserChampionships({
  level,
  id,
  organiser,
  onBack,
}: OrganiserChampionshipsProps) {
  const t = useTranslations("competitions");
  const tCommon = useTranslations("common");
  const scope = level === "regional" ? { leagueId: id } : { committeeId: id };
  const { data, error, isLoading, refetch } = useChampionships({
    level,
    ...scope,
    page: 1,
    limit: ALL,
  });
  const name = displayName(organiser);

  return (
    <div className="space-y-5">
      <Button variant="link" size="sm" className="px-0" onPress={onBack}>
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        {tCommon(LEVEL_CONFIG[level].back)}
      </Button>

      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-text-heading">{name}</h2>
        <Summary organiser={organiser} championships={data?.items} />
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}
      {error && (
        <ErrorMessage
          message={tCommon("errors.fetchChampionships")}
          onRetry={refetch}
        />
      )}
      {data && (
        <ChampionshipMatrix
          championships={data.items}
          caption={t("matrixCaption", { name })}
          tone={level}
        />
      )}
    </div>
  );
}
