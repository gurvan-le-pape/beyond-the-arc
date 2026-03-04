// src/backend/modules/competitions/championships/dto/championships.response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * Response DTO for a championship entity.
 */
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

  @ApiProperty({
    description: "Division number (e.g., 1, 2)",
    example: 1,
    type: Number,
  })
  division!: number;
}
