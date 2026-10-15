// src/backend/common/dto/organization-scope.query.dto.ts
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

/**
 * Query parameters scoping a request to an organization.
 * Used by the filter-values endpoints; going through a DTO (instead of
 * inline pipes) keeps the global whitelist/forbidNonWhitelisted
 * validation active, so unknown query params are rejected with 400.
 */
export class OrganizationScopeQueryDto {
  @ApiPropertyOptional({
    description: "Filter by committee ID",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  committeeId?: number;

  @ApiPropertyOptional({
    description: "Filter by league ID",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  leagueId?: number;
}
