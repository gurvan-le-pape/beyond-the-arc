// src/frontend/features/competitions/hooks/useGenderNavigation.ts
"use client";

import { useCallback, useMemo } from "react";

import { useChampionships } from "@/features/competitions/championships/api/use-championships";
import { sortCategories } from "@/features/competitions/utils/sortCategories";
import { useRouter } from "@/navigation";
import type { Category, CompetitionLevel } from "@/shared/constants";
import { Gender } from "@/shared/constants";

import type { Championship } from "../championships/types/Championship";

export function useGenderNavigation(
  id: number,
  level: CompetitionLevel,
  gender: Gender | undefined,
) {
  const router = useRouter();

  // Use React Query hook instead of calling service directly
  const { data: championships } = useChampionships(
    {
      level: level,
      id: id,
    },
    {
      enabled: !!id && !!gender, // Only fetch when we have required params
    },
  );

  // Compute target championship ID using useMemo
  const targetChampionshiptId = useMemo(() => {
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
    if (targetChampionshiptId) {
      void router.replace(
        `/competitions/${level}/${id}/${targetChampionshiptId}`,
      );
    }
  }, [targetChampionshiptId, router, level, id]);

  return {
    targetChampionshiptId,
    switchGender,
  };
}
