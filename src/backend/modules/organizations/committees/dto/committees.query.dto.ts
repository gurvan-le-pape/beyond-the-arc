// src/backend/modules/organizations/committees/dto/committees.query.dto.ts
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

/**
 * Query parameters for filtering committees.
 */
export class GetCommitteesQueryDto {
  @ApiPropertyOptional({
    description:
      "Filter committees by league ID. If not provided, returns all departmental committees.",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  leagueId?: number;
}
