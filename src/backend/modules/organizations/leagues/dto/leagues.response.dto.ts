// src/backend/modules/organizations/leagues/dto/leagues.response.dto.ts
import { PresidentResponseDto } from "@common/dto";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Response DTO for a region entity nested in league.
 */
export class RegionDto {
  @ApiProperty({
    description: "Region unique identifier",
    example: 1,
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "Region code",
    example: "BRE",
    type: String,
  })
  code!: string;

  @ApiProperty({
    description: "Region name",
    example: "Bretagne",
    type: String,
  })
  name!: string;
}

/**
 * Response DTO for a league entity.
 */
export class LeagueResponseDto {
  @ApiProperty({
    description: "League unique identifier",
    example: 1,
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "League name",
    example: "LIGUE REGIONALE BRETAGNE DE BASKET-BALL",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "League phone number",
    example: "02 99 00 00 00",
    type: String,
    nullable: true,
  })
  phone!: string | null;

  @ApiProperty({
    description: "League email address",
    example: "contact@ligue-bretagne.fr",
    type: String,
    nullable: true,
  })
  email!: string | null;

  @ApiProperty({
    description: "League address",
    example: "1 rue de la Ligue, 35000 Rennes",
    type: String,
    nullable: true,
  })
  address!: string | null;

  @ApiProperty({
    description: "League president",
    type: PresidentResponseDto,
    nullable: true,
  })
  president!: PresidentResponseDto | null;

  @ApiProperty({
    description: "Region the league belongs to",
    type: RegionDto,
  })
  region!: RegionDto;

  @ApiProperty({
    description: "Number of clubs in this league",
    example: 42,
    type: Number,
  })
  clubCount!: number;
}
