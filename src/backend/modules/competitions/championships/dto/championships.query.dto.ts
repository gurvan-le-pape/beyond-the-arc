// src/backend/modules/competitions/championships/dto/championships.query.dto.ts
import { CompetitionLevel } from "@common/constants";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional } from "class-validator";

/**
 * Query parameters for filtering championships.
 * All fields are optional — omitting them returns all championships.
 */
export class GetChampionshipsQueryDto {
  @ApiPropertyOptional({
    description: "Competition level (regional or departmental)",
    enum: [CompetitionLevel.REGIONAL, CompetitionLevel.DEPARTMENTAL],
    example: CompetitionLevel.REGIONAL,
  })
  @IsOptional()
  @IsEnum(CompetitionLevel, {
    message: `level must be either "${CompetitionLevel.REGIONAL}" or "${CompetitionLevel.DEPARTMENTAL}"`,
  })
  level?:
    | typeof CompetitionLevel.REGIONAL
    | typeof CompetitionLevel.DEPARTMENTAL;

  @ApiPropertyOptional({
    description:
      "League ID (for regional level) or Committee ID (for departmental level)",
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;
}
