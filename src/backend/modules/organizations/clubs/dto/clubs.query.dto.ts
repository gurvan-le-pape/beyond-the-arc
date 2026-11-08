// src/backend/modules/organizations/clubs/dto/clubs.query.dto.ts
import { CompetitionLevel, MAX_SEARCH_LENGTH } from "@common/constants";
import { PaginationQueryDto } from "@common/dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

/**
 * Query parameters for filtering clubs.
 */
export class GetClubsQueryDto extends PaginationQueryDto {
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

  @ApiPropertyOptional({
    description: "Search by club name",
    example: "Monaco",
    type: String,
    maxLength: MAX_SEARCH_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_SEARCH_LENGTH)
  search?: string;
}
