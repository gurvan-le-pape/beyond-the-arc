// src/frontend/features/competitions/championships/hooks/useCategoryNavigation.ts
"use client";

import { useCallback, useMemo } from "react";

import { useRouter } from "@/navigation";
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

import { useChampionships } from "../api";
import type { Championship } from "../types";
import { sortCategories } from "../utils";

export function useCategoryNavigation(
  id: number,
  championshipId: number,
  level: CompetitionLevel,
  gender: Gender | undefined,
  buildRoute?: (championshipId: number) => string,
) {
  const router = useRouter();

  const { data } = useChampionships(
    { level, id, limit: 100 },
    { enabled: !!id && !!gender },
  );
  const championships = data?.items;

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
      if (!categories.includes(champ.category)) categories.push(champ.category);
      if (!map[champ.category] && champ.division)
        map[champ.category] = champ.id;
      if (championshipId && champ.id === championshipId)
        initialCategory = champ.category;
    });

    const sortedCategories = sortCategories(categories.slice());

    return {
      categoryMap: map,
      availableCategories: sortedCategories,
      currentCategory: initialCategory ?? sortedCategories[0] ?? undefined,
    };
  }, [championships, gender, championshipId]);

  // Memoize the navigation function
  const navigateToCategory = useCallback(
    (targetCategory: Category) => {
      const targetChampionshipId = categoryMap[targetCategory];
      if (targetChampionshipId) {
        const route = buildRoute
          ? buildRoute(targetChampionshipId)
          : `/championships/${targetChampionshipId}`;
        router.replace(route);
      }
    },
    [categoryMap, router, level, id, buildRoute],
  );

  return {
    categoryMap,
    availableCategories,
    currentCategory,
    navigateToCategory,
  };
}
