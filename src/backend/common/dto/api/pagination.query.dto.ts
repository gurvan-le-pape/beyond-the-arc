// src/backend/common/dto/api/pagination.query.dto.ts
import {
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
  MAX_PAGE_NUMBER,
} from "@common/utils";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

/**
 * Shared pagination query parameters.
 *
 * Every paginated query DTO extends this class so page/limit validation,
 * documentation, and limits stay identical across endpoints. Defaults are
 * applied by resolvePagination() in the service layer, not here.
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: "Page number",
    type: Number,
    minimum: 1,
    maximum: MAX_PAGE_NUMBER,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_NUMBER)
  page?: number;

  @ApiPropertyOptional({
    description: "Items per page",
    type: Number,
    minimum: 1,
    maximum: MAX_PAGE_LIMIT,
    default: DEFAULT_PAGE_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_LIMIT)
  limit?: number;
}
