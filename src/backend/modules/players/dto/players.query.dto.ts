// src/backend/modules/players/dto/players.query.dto.ts
import { MAX_SEARCH_LENGTH } from "@common/constants";
import { CompetitionScopeQueryDto } from "@common/dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";

/**
 * Query parameters for filtering and paginating players.
 */
export class GetPlayersQueryDto extends CompetitionScopeQueryDto {
  @ApiPropertyOptional({
    description: "Club ID to filter players by club",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  clubId?: number;

  @ApiPropertyOptional({
    description: "Team ID to filter players by team",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  teamId?: number;

  @ApiPropertyOptional({
    description: "Team number to filter players",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  teamNumber?: number;

  @ApiPropertyOptional({
    description: "Player number to filter by jersey number",
    example: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  number?: number;

  @ApiPropertyOptional({
    description: "Search by player name (case-insensitive partial match)",
    example: "John",
    type: String,
    maxLength: MAX_SEARCH_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_SEARCH_LENGTH)
  search?: string;
}
