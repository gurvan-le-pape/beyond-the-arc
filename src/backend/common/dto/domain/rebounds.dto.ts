// src/backend/common/dto/domain/rebounds.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * Rebounds breakdown within player match stats. Mirrors the shape
 * produced by mapPlayerMatchStats in common/utils.
 */
export class ReboundsDto {
  @ApiProperty({ description: "Total rebounds", example: 8, type: Number })
  total!: number;

  @ApiProperty({ description: "Offensive rebounds", example: 3, type: Number })
  offensive!: number;

  @ApiProperty({ description: "Defensive rebounds", example: 5, type: Number })
  defensive!: number;
}
