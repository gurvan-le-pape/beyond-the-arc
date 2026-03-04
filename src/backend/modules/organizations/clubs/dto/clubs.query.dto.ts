// src/backend/modules/organizations/clubs/dto/clubs.query.dto.ts
import { Category } from "@common/constants/categories";
import { CompetitionLevel } from "@common/constants/competition-levels";
import { Gender } from "@common/constants/genders";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional } from "class-validator";

/**
 * Query parameters for filtering clubs.
 */
export class GetClubsQueryDto {
  @ApiPropertyOptional({
    description: "Competition level filter",
    enum: CompetitionLevel,
    example: CompetitionLevel.REGIONAL,
  })
  @IsOptional()
  @IsEnum(CompetitionLevel, {
    message: `Level must be one of: ${Object.values(CompetitionLevel).join(
      ", ",
    )}`,
  })
  level?: CompetitionLevel;

  @ApiPropertyOptional({
    description: "Filter by committee ID",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  committeeId?: number;

  @ApiPropertyOptional({
    description: "Filter by league ID",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  leagueId?: number;

  @ApiPropertyOptional({
    description: "Filter by category",
    enum: Category,
    example: Category.U18,
  })
  @IsOptional()
  @IsEnum(Category, {
    message: `Category must be one of: ${Object.values(Category).join(", ")}`,
  })
  category?: Category;

  @ApiPropertyOptional({
    description: "Filter by gender",
    enum: Gender,
    example: Gender.MALE,
  })
  @IsOptional()
  @IsEnum(Gender, {
    message: `Gender must be one of: ${Object.values(Gender).join(", ")}`,
  })
  gender?: Gender;
}

/**
 * Query parameters for filtering club statistics by department.
 */
export class GetClubStatsByDepartmentQueryDto {
  @ApiPropertyOptional({
    description: "Filter by league ID",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  leagueId?: number;
}
