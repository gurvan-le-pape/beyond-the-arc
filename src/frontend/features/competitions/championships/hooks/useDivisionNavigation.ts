// src/frontend/features/competitions/championships/hooks/useDivisionNavigation.ts
"use client";

import { useCallback, useMemo } from "react";

import { useChampionships } from "@/features/competitions/championships/api";
import { useRouter } from "@/navigation";
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

import type { Championship } from "../types";

export function useDivisionNavigation(
  id: number,
  level: CompetitionLevel,
  category: Category | undefined,
  gender: Gender | undefined,
  division: number | undefined,
  buildRoute?: (championshipId: number) => string,
) {
  const router = useRouter();

  // Use React Query hook instead of calling service directly
  const { data } = useChampionships(
    { level, id, limit: 100 },
    { enabled: !!id && !!level && !!category && !!gender },
  );
  const championships = data?.items;

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
        champ.category === category &&
        champ.gender === gender &&
        champ.level === level,
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
      currentDivision: division,
    };
  }, [championships, category, gender, division]);

  // Memoize the navigation function
  const navigateToDivision = useCallback(
    (targetDivision: number) => {
      const targetChampionshipId = divisionMap[targetDivision];
      if (targetChampionshipId) {
        const route = buildRoute
          ? buildRoute(targetChampionshipId)
          : `/championships/${targetChampionshipId}`;
        router.replace(route);
      }
    },
    [divisionMap, router, level, id, buildRoute],
  );

  return {
    divisionMap,
    availableDivisions,
    currentDivision,
    navigateToDivision,
  };
}
