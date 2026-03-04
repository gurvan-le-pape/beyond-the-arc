// src/frontend/features/organizations/clubs/types/ClubBasic.ts
export interface ClubBasic {
  id: number;
  name: string;
  city: string | null;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  committeeId: number;
  leagueId: number;
}
