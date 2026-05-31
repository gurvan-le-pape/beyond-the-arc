// src/frontend/features/players/types/Player.ts
import type { Position } from "@/shared/constants";

import type { PlayerTeamRef } from "./PlayerTeamRef";

export interface Player {
  id: number;
  name: string;
  number: number;
  position: Position;
  heightCm: number;
  weightKg: number;
  birthdate: string;
  teamId: number;
  team: PlayerTeamRef;
}
