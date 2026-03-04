// src/frontend/shared/types/filters/PlayersTableFiltersConfig.ts
import type { NamedEntity } from "@/shared/types/SelectOption";

export interface PlayersTableFiltersConfig {
  numbers: number[];
  teamNumbers: number[];
  clubs: NamedEntity[];
  categories: string[];
  genders: string[];
  clubProps: {
    value: string;
    onChange: (val: string | number | undefined) => void;
  };
  nameProps: { value: string; onChange: (val: string) => void };
  numberProps: { value: string; onChange: (val: string) => void };
  teamProps: { value: string; onChange: (val: string) => void };
  categoryProps: { value: string; onChange: (val: string) => void };
  genderProps: { value: string; onChange: (val: string) => void };
}
