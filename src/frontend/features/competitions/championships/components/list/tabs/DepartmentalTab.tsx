// src/frontend/features/competitions/championships/components/list/tabs/DepartmentalTab.tsx
"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useChampionships } from "@/features/competitions/championships/api";
import type { Championship } from "@/features/competitions/championships/types/Championship";
import { useCommittees } from "@/features/organizations/committees/api/use-committees";
import type { Category, Gender } from "@/shared/constants";
import { CompetitionLevel } from "@/shared/constants";

import { ChampionshipGrid } from "../ChampionshipGrid";
import { DepartmentalFilters } from "../filters/DepartmentalFilters";

export function DepartmentalTab() {
  const tCompetitions = useTranslations("competitions");

  const [committeeId, setCommitteeId] = useState("");
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [seasonYear, setSeasonYear] = useState("");

  const { data: committees = [] } = useCommittees();

  const committeeIdNum = Number(committeeId) || undefined;

  const { data: allChampionships = [], isLoading } = useChampionships(
    committeeIdNum
      ? { level: CompetitionLevel.DEPARTMENTAL, id: committeeIdNum }
      : undefined,
  );

  const championships = useMemo(
    () =>
      committeeIdNum
        ? allChampionships
        : allChampionships.filter(
            (c) => c.level === CompetitionLevel.DEPARTMENTAL,
          ),
    [allChampionships, committeeIdNum],
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
    setCommitteeId("");
    setCategory(undefined);
    setGender(undefined);
    setSeasonYear("");
  };

  return (
    <div className="space-y-6">
      <DepartmentalFilters
        committeeId={committeeId}
        setCommitteeId={setCommitteeId}
        committees={committees}
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
