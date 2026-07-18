// src/backend/modules/competitions/championships/dto/championships.response.dto.ts
import { Category, CompetitionLevel, Gender } from "@common/constants";
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
    description: "Age category",
    example: "U18",
    enum: Category,
  })
  category!: Category;

  @ApiProperty({
    description: "Gender",
    example: Gender.MALE,
    enum: Gender,
  })
  gender!: Gender;

  @ApiProperty({
    description: "Season year (e.g., 2024-2025)",
    example: "2024-2025",
    type: String,
  })
  seasonYear!: string;

  @ApiProperty({
    description: "Competition level",
    example: CompetitionLevel.REGIONAL,
    enum: CompetitionLevel,
  })
  level!: CompetitionLevel;

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

  @ApiProperty({ type: String, nullable: true })
  committeeName!: string | null;

  @ApiProperty({ type: String, nullable: true })
  leagueName!: string | null;

  @ApiProperty({
    description: "Pools in this championship",
    type: [ChampionshipPoolDto],
  })
  pools!: ChampionshipPoolDto[];
}
