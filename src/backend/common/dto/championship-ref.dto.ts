// src/backend/common/dto/championship-ref.dto.ts
import { CompetitionLevel } from "@common/constants";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Championship reference, as embedded in a pool reference.
 */
export class ChampionshipRefDto {
  @ApiProperty({ description: "Championship ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Championship name",
    example: "Championship Régional U18 male",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Competition level",
    example: CompetitionLevel.REGIONAL,
    enum: CompetitionLevel,
  })
  level!: CompetitionLevel;

  @ApiProperty({ description: "Division number", example: 1, type: Number })
  division!: number;
}
