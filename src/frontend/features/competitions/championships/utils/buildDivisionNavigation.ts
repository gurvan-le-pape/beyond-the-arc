// src/frontend/features/competitions/championships/utils/buildDivisionNavigation.ts
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

import type { Championship } from "../types";

export function buildDivisionNavigation(
  championships: Championship[],
  level: CompetitionLevel,
  category: Category | undefined,
  gender: Gender | undefined,
  division: number | undefined,
) {
  if (!category || !gender) {
    return {
      divisionMap: {} as Record<number, number>,
      availableDivisions: [] as number[],
      currentDivision: undefined,
    };
  }

  const filtered = championships.filter(
    (c) => c.category === category && c.gender === gender && c.level === level,
  );

  const map: Record<number, number> = {};
  filtered.forEach((champ) => {
    map[champ.division] = champ.id;
  });

  const availableDivisions = Object.keys(map)
    .map(Number)
    .sort((a, b) => a - b);

  return {
    divisionMap: map,
    availableDivisions,
    currentDivision: division,
  };
}
