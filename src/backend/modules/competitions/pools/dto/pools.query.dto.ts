// src/backend/modules/competitions/pools/dto/pools.query.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

/**
 * Query parameters for filtering pools by championship ID.
 */
export class GetPoolsByChampionshipIdQueryDto {
  @ApiProperty({
    description: "Championship ID",
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: "championshipId is required" })
  @Type(() => Number)
  @IsNumber()
  championshipId!: number;
}
