// src/backend/modules/competitions/championships/dto/championships.response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * Response DTO for a championship entity.
 */
export class ChampionshipPoolDto {
  @ApiProperty({ example: 1, type: Number })
  id!: number;

  @ApiProperty({ example: "A", type: String })
  letter!: string;

  @ApiProperty({ example: "Pool A", type: String })
  name!: string;

  @ApiProperty({ example: 10, type: Number })
  nbMatchdays!: number;
}

export class ChampionshipResponseDto {
  @ApiProperty({
    description: "Unique championship identifier",
    example: 1,
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "Championship name",
    example: "Championship Régional U18 male",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Age category (e.g., U18, Senior)",
    example: "U18",
    type: String,
    nullable: true,
  })
  category!: string | null;

  @ApiProperty({
    description: "Gender category (male, female, Mixte)",
    example: "male",
    type: String,
  })
  gender!: string;

  @ApiProperty({
    description: "Season year (e.g., 2024-2025)",
    example: "2024-2025",
    type: String,
  })
  seasonYear!: string;

  @ApiProperty({
    description: "Competition level (national, regional, departmental)",
    example: "regional",
    type: String,
  })
  level!: string;

  @ApiProperty({ description: "Division number", example: 1, type: Number })
  division!: number;

  @ApiProperty({
    description: "Regional league ID",
    example: 1,
    type: Number,
    nullable: true,
  })
  leagueId!: number | null;

  @ApiProperty({
    description: "Departmental committee ID",
    example: 3,
    type: Number,
    nullable: true,
  })
  committeeId!: number | null;

  @ApiProperty({
    description: "Name of the parent organization (league or committee)",
    example: "LIGUE REGIONALE DE BRETAGNE DE BASKET-BALL",
    type: String,
    nullable: true,
  })
  organizationName!: string | null;

  @ApiProperty({
    description: "Pools in this championship",
    type: [ChampionshipPoolDto],
  })
  pools!: ChampionshipPoolDto[];
}
