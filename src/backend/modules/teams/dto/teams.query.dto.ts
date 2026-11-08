// src/backend/modules/teams/dto/teams.query.dto.ts
import { MAX_SEARCH_LENGTH } from "@common/constants";
import { CompetitionScopeQueryDto } from "@common/dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";

/**
 * Query parameters for filtering and paginating teams.
 */
export class GetTeamsQueryDto extends CompetitionScopeQueryDto {
  @ApiPropertyOptional({
    description: "Club ID to filter teams by club",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  clubId?: number;

  @ApiPropertyOptional({
    description: "Division number to filter teams",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  division?: number;

  @ApiPropertyOptional({
    description: "Team number",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  number?: number;

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
    description:
      "Pool ID; it fixes the championship, so the competition filters are ignored with it",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  poolId?: number;
}
