// src/frontend/features/organizations/clubs/types/ClubStatsByDepartment.ts
export interface DepartmentInfo {
  id: number;
  name: string;
  code: string;
}

export interface ClubStatsByDepartment {
  id: number;
  name: string;
  department: DepartmentInfo;
  leagueId: number;
  region?: { id: number } | null;
  clubCount: number;
}
