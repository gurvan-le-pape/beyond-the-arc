// src/backend/common/dto/club-ref.dto.ts
import { ApiProperty } from "@nestjs/swagger";

import { CommitteeRefDto } from "./committee-ref.dto";

/**
 * Club reference, with its committee and league. Embedded wherever a team or
 * player response names the club.
 */
export class ClubRefDto {
  @ApiProperty({ description: "Club ID", example: 1, type: Number })
  id!: number;

  @ApiProperty({
    description: "Club name",
    example: "AS Monaco Basket",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Committee information",
    type: CommitteeRefDto,
  })
  committee!: CommitteeRefDto;
}
