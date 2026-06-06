// src/frontend/features/competitions/championships/hooks/useDivisionNavigation.ts
"use client";

import { useCallback } from "react";

import { useRouter } from "@/navigation";

export function useDivisionNavigation(
  divisionMap: Record<number, number>,
  buildRoute?: (championshipId: number) => string,
) {
  const router = useRouter();

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
    [divisionMap, router, buildRoute],
  );

  return { navigateToDivision };
}
