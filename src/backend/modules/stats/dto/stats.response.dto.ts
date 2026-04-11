// src/backend/modules/stats/dto/stats.response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * Response DTO for platform-wide statistics.
 */
export class StatsResponseDto {
  @ApiProperty({ description: "Total number of clubs", example: 840 })
  clubs!: number;

  @ApiProperty({ description: "Total number of teams", example: 3200 })
  teams!: number;

  @ApiProperty({ description: "Total number of players", example: 12400 })
  players!: number;

  @ApiProperty({ description: "Total number of matches", example: 48000 })
  matches!: number;

  @ApiProperty({ description: "Total number of leagues", example: 26 })
  leagues!: number;

  @ApiProperty({ description: "Total number of committees", example: 95 })
  committees!: number;
}
