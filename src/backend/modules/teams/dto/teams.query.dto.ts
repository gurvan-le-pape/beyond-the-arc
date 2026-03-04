// src/backend/modules/teams/dto/teams.query.dto.ts
import { CompetitionLevel } from "@common/constants/competition-levels";
import { Category, Gender } from "@common/index";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

/**
 * Query parameters for filtering and paginating teams.
 */
export class GetTeamsQueryDto {
  @ApiPropertyOptional({
    description: "Club ID to filter teams by club",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  clubId?: number;

  @ApiPropertyOptional({
    description: "Competition level (regional or departmental)",
    enum: [CompetitionLevel.REGIONAL, CompetitionLevel.DEPARTMENTAL],
    example: CompetitionLevel.REGIONAL,
  })
  @IsOptional()
  @IsEnum(CompetitionLevel, {
    message: `level must be either "${CompetitionLevel.REGIONAL}" or "${CompetitionLevel.DEPARTMENTAL}"`,
  })
  level?: CompetitionLevel;

  @ApiPropertyOptional({
    description: "Division number to filter teams",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  division?: number;

  @ApiPropertyOptional({
    description: "Committee ID (for departmental level)",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  committeeId?: number;

  @ApiPropertyOptional({
    description: "League ID (for regional level)",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  leagueId?: number;

  @ApiPropertyOptional({
    description: "Team number",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  number?: number;

  @ApiPropertyOptional({
    description: "Age category filter",
    example: "U18",
    type: String,
  })
  @IsOptional()
  @IsString()
  category?: Category;

  @ApiPropertyOptional({
    description: "Gender filter",
    example: "M",
    type: String,
  })
  @IsOptional()
  @IsString()
  gender?: Gender;

  @ApiPropertyOptional({
    description: "Search by club name (case-insensitive partial match)",
    example: "Paris",
    type: String,
  })
  @IsOptional()
  @IsString()
  clubName?: string;

  @ApiPropertyOptional({
    description: "Filter by pool letter",
    example: "A",
    type: String,
  })
  @IsOptional()
  @IsString()
  poolLetter?: string;

  @ApiPropertyOptional({
    description: "Page number for pagination",
    example: 1,
    type: Number,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    description: "Number of items per page (max 100)",
    example: 50,
    type: Number,
    default: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
