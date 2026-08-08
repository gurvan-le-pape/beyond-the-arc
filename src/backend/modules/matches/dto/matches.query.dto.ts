// src/backend/modules/matches/dto/matches.query.dto.ts
import { CompetitionLevel, MAX_SEARCH_LENGTH } from "@common/constants";
import { Category, Gender, PaginationQueryDto } from "@common/index";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from "class-validator";

/**
 * Query parameters for filtering and paginating matches.
 */
export class GetMatchesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Competition level filter",
    enum: CompetitionLevel,
    example: CompetitionLevel.REGIONAL,
  })
  @IsOptional()
  @IsEnum(CompetitionLevel)
  level?: CompetitionLevel;

  @ApiPropertyOptional({
    description: "Division number to filter matches",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  division?: number;

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
    example: Gender.MALE,
    enum: Gender,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    description: "Pool ID to filter matches",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  poolId?: number;

  @ApiPropertyOptional({
    description: "Championship ID to filter matches",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  championshipId?: number;

  @ApiPropertyOptional({
    description: "Matchday number",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  matchday?: number;

  @ApiPropertyOptional({
    description: "Date filter (YYYY-MM-DD format)",
    example: "2024-02-05",
    type: String,
  })
  @IsOptional()
  @IsString({ message: "date must be a string" })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "date must be in YYYY-MM-DD format",
  })
  date?: string;

  @ApiPropertyOptional({
    description: "Search by club name (case-insensitive partial match)",
    example: "Paris",
    type: String,
    maxLength: MAX_SEARCH_LENGTH,
  })
  @IsOptional()
  @IsString({ message: "search must be a string" })
  @MaxLength(MAX_SEARCH_LENGTH)
  search?: string;
}
