// src/frontend/features/competitions/championships/hooks/useGenderNavigation.ts
"use client";

import { useCallback, useMemo } from "react";

import { useChampionships } from "@/features/competitions/championships/api";
import { sortCategories } from "@/features/competitions/championships/utils";
import { useRouter } from "@/navigation";
import type { Category, CompetitionLevel } from "@/shared/constants";
import { Gender } from "@/shared/constants";

import type { Championship } from "../types";

export function useGenderNavigation(
  id: number,
  level: CompetitionLevel,
  gender: Gender | undefined,
  buildRoute?: (championshipId: number) => string,
) {
  const router = useRouter();

  // Use React Query hook instead of calling service directly
  const { data } = useChampionships(
    { level, id, limit: 100 },
    { enabled: !!id && !!gender },
  );
  const championships = data?.items;

  // Compute target championship ID using useMemo
  const targetChampionshipId = useMemo(() => {
    if (!championships || !gender) {
      return null;
    }

    const targetGender = gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;

    // Filter championships for the target gender
    const filteredChampionships: Championship[] = championships.filter(
      (champ: Championship) =>
        champ.gender === targetGender && champ.division === 1, // Division 1
    );

    // Sort categories to ensure smallest category is selected
    const sortedCategories = sortCategories([
      ...new Set(
        filteredChampionships
          .map((champ: Championship) => champ.category)
          .filter(
            (cat): cat is Category =>
              typeof cat === "string" && cat !== undefined,
          ),
      ),
    ]);

    // Find the target championship ID for the smallest category and division 1
    const targetChamp = filteredChampionships.find(
      (champ: Championship) =>
        champ.category === sortedCategories[0] && champ.division === 1,
    );

    return targetChamp ? targetChamp.id : null;
  }, [championships, gender]);

  // Memoize the switch function
  const switchGender = useCallback(() => {
    if (targetChampionshipId) {
      const route = buildRoute
        ? buildRoute(targetChampionshipId)
        : `/championships/${targetChampionshipId}`;
      router.replace(route);
    }
  }, [targetChampionshipId, router, level, id, buildRoute]);

  return {
    targetChampionshipId,
    switchGender,
  };
}
