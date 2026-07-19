// src/frontend/features/competitions/championships/components/detail/championship-navigation/useCategoryNavigation.ts
"use client";

import { useCallback } from "react";

import { useRouter } from "@/navigation";
import type { Category } from "@/shared/constants";

export function useCategoryNavigation(
  categoryMap: Record<Category, number>,
  buildRoute?: (championshipId: number) => string,
) {
  const router = useRouter();

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
    [categoryMap, router, buildRoute],
  );

  return { navigateToCategory };
}
