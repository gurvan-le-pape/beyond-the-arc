// src/frontend/features/organizations/committees/types/Committees.ts

import type { Department } from "@/features/geography/departments/types/Department";

export interface Committee {
  id: number;
  name: string;
  leagueId: number;
  department: Department;
}
