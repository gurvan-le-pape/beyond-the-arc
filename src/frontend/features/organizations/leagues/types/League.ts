// src/frontend/features/organizations/leagues/types/League.ts

import type { Region } from "@/features/geography/types";
import type { President } from "@/shared/types";

export interface League {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  president: President | null;
  region: Region;
  clubCount: number;
}
