// src/backend/modules/competitions/pools/dto/pools.response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * Response DTO for a pool entity.
 */
export class PoolResponseDto {
  @ApiProperty({
    description: "Unique pool identifier",
    example: 1,
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "Pool letter designation",
    example: "A",
    type: String,
  })
  letter!: string;

  @ApiProperty({
    description: "Pool name",
    example: "Pool A - Seniors",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Associated championship ID",
    example: 1,
    type: Number,
  })
  championshipId!: number;

  @ApiProperty({
    description: "Number of matchdays in this pool",
    example: 10,
    type: Number,
  })
  nbMatchdays!: number;
}

/**
 * Response DTO for a pool that played in the most recent completed round.
 */
export class RecentPoolResponseDto extends PoolResponseDto {
  @ApiProperty({
    description: "Matchday this pool played in the most recent round",
    example: 4,
    type: Number,
  })
  matchday!: number;

  @ApiProperty({
    description:
      "Tip-off instant of the most recent round, as an ISO 8601 UTC timestamp",
    example: "2026-10-17T20:00:00Z",
    type: String,
  })
  playedAt!: Date;
}
