// src/frontend/features/competitions/championships/types/DivisionNav.ts

export interface DivisionNav {
  divisionMap: Record<number, number>;
  availableDivisions: number[];
  currentDivision: number | undefined;
}
