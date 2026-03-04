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
}
