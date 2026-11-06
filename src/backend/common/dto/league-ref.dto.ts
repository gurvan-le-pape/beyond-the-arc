// src/backend/common/dto/league-ref.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * League reference: the top of a club's organization chain.
 */
export class LeagueRefDto {
  @ApiProperty({ description: "League ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "League name",
    example: "LIGUE REGIONALE DE BRETAGNE DE BASKET-BALL",
    type: String,
  })
  name!: string;
}
