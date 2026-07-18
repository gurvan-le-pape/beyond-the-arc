// src/backend/common/dto/player-summary.dto.ts
import { Position } from "@common/constants";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Compact player identity shape embedded in match stats and history
 * responses across the matches, players, and teams modules.
 */
export class PlayerSummaryDto {
  @ApiProperty({ description: "Player ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Player name",
    example: "John Doe",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Player jersey number",
    example: 10,
    type: Number,
  })
  number!: number;

  @ApiProperty({
    description: "Player position",
    example: "PG",
    enum: Position,
  })
  position!: Position;

  @ApiProperty({ description: "Team ID", example: 1, type: Number })
  teamId!: number;
}
