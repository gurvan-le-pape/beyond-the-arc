// src/backend/modules/teams/dto/teams.query.dto.ts
import { CompetitionLevel, MAX_SEARCH_LENGTH } from "@common/constants";
import { Category, Gender, PaginationQueryDto } from "@common/index";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

/**
 * Query parameters for filtering and paginating teams.
 */
export class GetTeamsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Club ID to filter teams by club",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  clubId?: number;

  @ApiPropertyOptional({
    description: "Competition level filter",
    enum: CompetitionLevel,
    example: CompetitionLevel.REGIONAL,
  })
  @IsOptional()
  @IsEnum(CompetitionLevel)
  level?: CompetitionLevel;

  @ApiPropertyOptional({
    description: "Division number to filter teams",
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
    description: "Team number",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  number?: number;

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
    description: "Search by club name (case-insensitive partial match)",
    example: "Paris",
    type: String,
    maxLength: MAX_SEARCH_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_SEARCH_LENGTH)
  search?: string;

  @ApiPropertyOptional({
    description: "Filter by pool letter",
    example: "A",
    type: String,
  })
  @IsOptional()
  @IsString()
  poolLetter?: string;
}
