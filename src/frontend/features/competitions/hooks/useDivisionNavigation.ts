// src/frontend/features/competitions/hooks/useDivisionNavigation.ts
"use client";

import { useCallback, useMemo } from "react";

import { useChampionships } from "@/features/competitions/championships/api/use-championships";
import { useRouter } from "@/navigation";
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

import type { Championship } from "../championships/types/Championship";

export function useDivisionNavigation(
  id: number,
  level: CompetitionLevel,
  category: Category | undefined,
  gender: Gender | undefined,
  division: number | undefined,
) {
  const router = useRouter();

  // Use React Query hook instead of calling service directly
  const { data: championships } = useChampionships(
    {
      level: level,
      id: id,
    },
    {
      enabled: !!id && !!level && !!category && !!gender, // Only fetch when we have required params
    },
  );

  // Compute derived state using useMemo
  const { divisionMap, availableDivisions, currentDivision } = useMemo(() => {
    if (!championships || !category || !gender) {
      return {
        divisionMap: {},
        availableDivisions: [],
        currentDivision: undefined,
      };
    }

    const filteredChampionships = championships.filter(
      (champ: Championship) =>
        champ.category === category && champ.gender === gender,
    );

    // Create a map of division to championshipId
    const map: Record<number, number> = {};
    filteredChampionships.forEach((champ: Championship) => {
      map[champ.division] = champ.id;
    });

    const divisions = Object.keys(map)
      .map((key) => Number.parseInt(key))
      .sort((a, b) => a - b);

    return {
      divisionMap: map,
      availableDivisions: divisions,
      currentDivision: division ?? undefined,
    };
  }, [championships, category, gender, division]);

  // Memoize the navigation function
  const navigateToDivision = useCallback(
    (targetDivision: number) => {
      const targetChampionshiptId = divisionMap[targetDivision];
      if (targetChampionshiptId) {
        void router.replace(
          `/competitions/${level}/${id}/${targetChampionshiptId}`,
        );
      }
    },
    [divisionMap, router, level, id],
  );

  return {
    divisionMap,
    availableDivisions,
    currentDivision,
    navigateToDivision,
  };
}
