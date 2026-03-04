// src/backend/modules/competitions/leaderboards/dto/leaderboards.query.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

/**
 * Query parameters for filtering leaderboards by pool ID.
 */
export class GetLeaderboardsQueryDto {
  @ApiProperty({
    description: "Pool ID",
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: "poolId is required" })
  @Type(() => Number)
  @IsNumber()
  poolId!: number;
}
