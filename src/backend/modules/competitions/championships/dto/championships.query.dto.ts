// src/backend/modules/competitions/championships/dto/championships.query.dto.ts
import { CompetitionLevel } from "@common/constants/competition-levels";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";

/**
 * Query parameters for filtering championships by level and ID.
 */
export class GetChampionshipsQueryDto {
  @ApiProperty({
    description: "Competition level (regional or departmental)",
    enum: [CompetitionLevel.REGIONAL, CompetitionLevel.DEPARTMENTAL],
    example: CompetitionLevel.REGIONAL,
  })
  @IsNotEmpty({ message: "level is required" })
  @IsEnum(CompetitionLevel, {
    message: `level must be either "${CompetitionLevel.REGIONAL}" or "${CompetitionLevel.DEPARTMENTAL}"`,
  })
  level!:
    | typeof CompetitionLevel.REGIONAL
    | typeof CompetitionLevel.DEPARTMENTAL;

  @ApiProperty({
    description:
      "League ID (for regional level) or Committee ID (for departmental level)",
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: "id is required" })
  @Type(() => Number)
  @IsNumber()
  id!: number;
}
