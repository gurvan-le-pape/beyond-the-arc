// src/backend/modules/matches/dto/matches.query.dto.ts
import {
  Category,
  CompetitionLevel,
  Gender,
  MAX_SEARCH_LENGTH,
} from "@common/constants";
import { PaginationQueryDto } from "@common/dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
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
  @Min(1)
  division?: number;

  @ApiPropertyOptional({
    description: "Committee ID (for departmental level)",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  committeeId?: number;

  @ApiPropertyOptional({
    description: "League ID (for regional level)",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
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
  @Min(1)
  poolId?: number;

  @ApiPropertyOptional({
    description: "Championship ID to filter matches",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  championshipId?: number;

  @ApiPropertyOptional({
    description: "Matchday number",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  matchday?: number;

  @ApiPropertyOptional({
    description: "Date filter (YYYY-MM-DD format)",
    example: "2024-02-05",
    type: String,
    // Stated explicitly because the @nestjs/swagger CLI plugin's
    // classValidatorShim derives `pattern` from the source text of the
    // @Matches argument — for a RegExp literal that text carries the
    // surrounding slashes, which is not a valid JSON Schema pattern.
    pattern: String.raw`^\d{4}-\d{2}-\d{2}$`,
  })
  @IsOptional()
  @IsString({ message: "date must be a string" })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "date must be in YYYY-MM-DD format",
  })
  // The pattern accepts 2026-02-30; strict ISO 8601 checks the day exists, so
  // an impossible date is a 400 here rather than an Invalid Date in the query.
  @IsISO8601({ strict: true }, { message: "date must be a calendar date" })
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
