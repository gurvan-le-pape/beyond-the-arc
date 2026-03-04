// src/backend/modules/players/dto/players.query.dto.ts
import { CompetitionLevel } from "@common/constants/competition-levels";
import { Category, Gender } from "@common/index";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

/**
 * Query parameters for filtering and paginating players.
 */
export class GetPlayersQueryDto {
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
    description: "Club ID to filter players by club",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  clubId?: number;

  @ApiPropertyOptional({
    description: "Team ID to filter players by team",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  teamId?: number;

  @ApiPropertyOptional({
    description: "Team number to filter players",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  teamNumber?: number;

  @ApiPropertyOptional({
    description: "Player number to filter by jersey number",
    example: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  number?: number;

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
    description: "Search by player name (case-insensitive partial match)",
    example: "John",
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string;

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
