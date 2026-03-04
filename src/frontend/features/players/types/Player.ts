// src/frontend/features/players/types/Player.ts
import type { PlayerTeamRef } from "./PlayerTeamRef";

export interface Player {
  id: number;
  name: string;
  number: number;
  teamId: number;
  team: PlayerTeamRef;
}
