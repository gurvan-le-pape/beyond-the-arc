// src/backend/common/dto/domain/committee-ref.dto.ts
import { ApiProperty } from "@nestjs/swagger";

import { LeagueRefDto } from "./league-ref.dto";

/**
 * Committee reference, with the league it belongs to.
 */
export class CommitteeRefDto {
  @ApiProperty({ description: "Committee ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Committee name",
    example: "Comité Départemental de l'Ain",
    type: String,
  })
  name!: string;

  @ApiProperty({ description: "League information", type: LeagueRefDto })
  league!: LeagueRefDto;
}
