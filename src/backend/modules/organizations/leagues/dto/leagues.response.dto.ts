// src/backend/modules/organizations/leagues/dto/leagues.response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * Response DTO for a league entity.
 */
export class LeagueResponseDto {
  @ApiProperty({
    description: "Unique league identifier",
    example: 1,
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "League regionale name",
    example: "League Auvergne-Rhône-Alpes",
    type: String,
  })
  name!: string;
}
