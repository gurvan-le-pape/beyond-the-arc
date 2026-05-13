// src/frontend/features/organizations/committees/types/Committees.ts
import type { Department } from "@/features/geography/types";
import type { President } from "@/shared/types";

export interface Committee {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  president: President | null;
  leagueId: number;
  department: Department;
  clubCount: number;
}
