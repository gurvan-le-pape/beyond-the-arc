// src/frontend/shared/types/filters/TeamsTableFiltersConfig.ts
import type { NamedEntity } from "@/shared/types/SelectOption";

export interface TeamsTableFiltersConfig {
  numbers: number[];
  clubs: NamedEntity[];
  categories: string[];
  genders: string[];
  divisions: number[];
  poolLetters: string[];
  numberProps: { value: string; onChange: (val: string) => void };
  clubProps: { value: string; onChange: (val: string) => void };
  categoryProps: { value: string; onChange: (val: string) => void };
  genderProps: { value: string; onChange: (val: string) => void };
  divisionProps: { value: string; onChange: (val: string) => void };
  poolProps: { value: string; onChange: (val: string) => void };
}
