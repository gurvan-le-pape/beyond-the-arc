// src/backend/common/utils/player-summary.mapper.ts
import type { Position } from "@common/constants";

/**
 * Prisma player fields backing PlayerSummaryDto.
 */
export interface PlayerSummaryFields {
  id: number;
  name: string;
  number: number;
  position: string;
  teamId: number;
}

/**
 * Maps the Prisma player fields shared by matches/players/teams services
 * into the common PlayerSummaryDto shape.
 */
export function mapPlayerSummary(player: PlayerSummaryFields): {
  id: number;
  name: string;
  number: number;
  position: Position;
  teamId: number;
} {
  return {
    id: player.id,
    name: player.name,
    number: player.number,
    position: player.position as Position,
    teamId: player.teamId,
  };
}
