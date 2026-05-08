// src/frontend/features/competitions/championships/components/list/tabs/RegionalTab.tsx
"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useChampionships } from "@/features/competitions/championships/api";
import type { Championship } from "@/features/competitions/championships/types/Championship";
import { useLeagues } from "@/features/organizations/leagues/api/use-leagues";
import type { Category, Gender } from "@/shared/constants";
import { CompetitionLevel } from "@/shared/constants";

import { ChampionshipGrid } from "../ChampionshipGrid";
import { RegionalFilters } from "../filters/RegionalFilters";

export function RegionalTab() {
  const tCompetitions = useTranslations("competitions");

  const [leagueId, setLeagueId] = useState("");
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [seasonYear, setSeasonYear] = useState("");

  const { data: leagues = [] } = useLeagues();

  const leagueIdNum = Number(leagueId) || undefined;

  const { data: allChampionships = [], isLoading } = useChampionships(
    leagueIdNum
      ? { level: CompetitionLevel.REGIONAL, id: leagueIdNum }
      : undefined,
  );

  const championships = useMemo(
    () =>
      leagueIdNum
        ? allChampionships
        : allChampionships.filter((c) => c.level === CompetitionLevel.REGIONAL),
    [allChampionships, leagueIdNum],
  );

  const seasonYears = useMemo(() => {
    const years = [...new Set(championships.map((c) => c.seasonYear))].sort(
      (a, b) => b.localeCompare(a),
    );
    return years.map((y) => ({ value: y, label: y }));
  }, [championships]);

  const filtered = useMemo(() => {
    return championships.filter((c: Championship) => {
      if (category && c.category !== category) return false;
      if (gender && c.gender !== gender) return false;
      if (seasonYear && c.seasonYear !== seasonYear) return false;
      return true;
    });
  }, [championships, category, gender, seasonYear]);

  const handleReset = () => {
    setLeagueId("");
    setCategory(undefined);
    setGender(undefined);
    setSeasonYear("");
  };

  return (
    <div className="space-y-6">
      <RegionalFilters
        leagueId={leagueId}
        setLeagueId={setLeagueId}
        leagues={leagues}
        category={category}
        setCategory={setCategory}
        gender={gender}
        setGender={setGender}
        seasonYear={seasonYear}
        setSeasonYear={setSeasonYear}
        seasonYears={seasonYears}
        onReset={handleReset}
      />

      {!isLoading && (
        <div className="text-sm text-text-secondary">
          {filtered.length} {tCompetitions("championshipsCount")}
        </div>
      )}

      <ChampionshipGrid championships={filtered} isLoading={isLoading} />
    </div>
  );
}
