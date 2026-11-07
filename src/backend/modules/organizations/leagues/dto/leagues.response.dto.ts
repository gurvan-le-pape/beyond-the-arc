// src/backend/modules/organizations/leagues/dto/leagues.response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * A league's region, nested in the league response.
 */
export class RegionDto {
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
    description: "League address",
    example: "1 rue de la Ligue, 35000 Rennes",
    type: String,
    nullable: true,
  })
  address!: string | null;

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

  @ApiProperty({
    description:
      "The league's page on the FFBB competitions site, where its contact details are kept up to date",
    example: "https://competitions.ffbb.com/ligues/sud",
    type: String,
    nullable: true,
  })
  ffbbUrl!: string | null;
}
