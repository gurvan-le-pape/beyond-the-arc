// src/backend/modules/players/dto/players.query.dto.ts
import { CompetitionLevel } from "@common/constants";
import { Category, Gender, PaginationQueryDto } from "@common/index";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

/**
 * Query parameters for filtering and paginating players.
 */
export class GetPlayersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Competition level filter",
    enum: CompetitionLevel,
    example: CompetitionLevel.REGIONAL,
  })
  @IsOptional()
  @IsEnum(CompetitionLevel)
  level?: CompetitionLevel;

  @ApiPropertyOptional({
    description: "Club ID to filter players by club",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  clubId?: number;

  @ApiPropertyOptional({
    description: "Team ID to filter players by team",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  teamId?: number;

  @ApiPropertyOptional({
    description: "Team number to filter players",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  teamNumber?: number;

  @ApiPropertyOptional({
    description: "Player number to filter by jersey number",
    example: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  number?: number;

  @ApiPropertyOptional({
    description: "Committee ID (for departmental level)",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  committeeId?: number;

  @ApiPropertyOptional({
    description: "League ID (for regional level)",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  leagueId?: number;

  @ApiPropertyOptional({
    description: "Age category filter",
    example: "U18",
    enum: Category,
  })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiPropertyOptional({
    description: "Gender filter",
    example: "M",
    enum: Gender,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    description: "Search by player name (case-insensitive partial match)",
    example: "John",
    type: String,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
