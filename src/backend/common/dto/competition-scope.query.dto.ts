// src/backend/common/dto/competition-scope.query.dto.ts
import { Category, CompetitionLevel, Gender } from "@common/constants";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";

import { PaginationQueryDto } from "./pagination.query.dto";

/**
 * Paginated query parameters scoping a list to a competition and an
 * organization, shared by the matches, teams and players lists.
 */
export class CompetitionScopeQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Competition level filter",
    enum: CompetitionLevel,
    example: CompetitionLevel.REGIONAL,
  })
  @IsOptional()
  @IsEnum(CompetitionLevel)
  level?: CompetitionLevel;

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
}
