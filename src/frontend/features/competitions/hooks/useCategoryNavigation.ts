// src/frontend/features/competitions/hooks/useCategoryNavigation.ts
"use client";

import { useCallback, useMemo } from "react";

import { useRouter } from "@/navigation";
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

import { useChampionships } from "../championships/api";
import type { Championship } from "../championships/types/Championship";

export function useCategoryNavigation(
  id: number,
  championshipId: number,
  level: CompetitionLevel,
  gender: Gender | undefined,
) {
  const router = useRouter();

  const { data: championships } = useChampionships(
    {
      level: level,
      id: id,
    },
    {
      enabled: !!id && !!gender, // Only fetch when we have required params
    },
  );

  // Compute derived state using useMemo
  const { categoryMap, availableCategories, currentCategory } = useMemo(() => {
    if (!championships || !gender) {
      return {
        categoryMap: {} as Record<Category, number>,
        availableCategories: [],
        currentCategory: undefined,
      };
    }

    const filteredChampionships = championships.filter(
      (champ: Championship) => champ.gender === gender,
    );

    const map: Record<string, number> = {};
    const categories: Category[] = [];
    let initialCategory: Category | undefined = undefined;

    filteredChampionships.forEach((champ: Championship) => {
      if (!champ.category) return;

      if (!categories.includes(champ.category)) {
        categories.push(champ.category);
      }

      if (!map[champ.category] && champ.division) {
        map[champ.category] = champ.id;
      }

      if (championshipId && champ.id === championshipId) {
        initialCategory = champ.category;
      }
    });

    const sortedCategories = categories
      .slice()
      .sort((a, b) => a.localeCompare(b));

    return {
      categoryMap: map,
      availableCategories: sortedCategories,
      currentCategory: initialCategory ?? sortedCategories[0] ?? undefined,
    };
  }, [championships, gender, championshipId]);

  // Memoize the navigation function
  const navigateToCategory = useCallback(
    (targetCategory: Category) => {
      const targetChampionshiptId = categoryMap[targetCategory];
      if (targetChampionshiptId) {
        void router.replace(
          `/competitions/${level}/${id}/${targetChampionshiptId}`,
        );
      }
    },
    [categoryMap, router, level, id],
  );

  return {
    categoryMap,
    availableCategories,
    currentCategory,
    navigateToCategory,
  };
}
