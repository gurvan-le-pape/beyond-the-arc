// src/backend/common/dto/domain/pool-ref.dto.ts
import { ApiProperty } from "@nestjs/swagger";

import { ChampionshipRefDto } from "./championship-ref.dto";

/**
 * Pool reference, with its championship. Embedded wherever a team or player
 * response names the pool.
 */
export class PoolRefDto {
  @ApiProperty({ description: "Pool ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({ description: "Pool name", example: "Poule A", type: String })
  name!: string;

  @ApiProperty({ description: "Pool letter", example: "A", type: String })
  letter!: string;

  @ApiProperty({
    description: "Championship the pool belongs to",
    type: ChampionshipRefDto,
  })
  championship!: ChampionshipRefDto;
}
