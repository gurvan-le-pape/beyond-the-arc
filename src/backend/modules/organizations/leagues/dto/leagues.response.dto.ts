// src/backend/modules/organizations/leagues/dto/leagues.response.dto.ts
import { PresidentResponseDto } from "@common/dto/president.response.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

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

  @ApiPropertyOptional({
    description: "League phone number",
    example: "02 99 00 00 00",
    type: String,
  })
  phone!: string | null;

  @ApiPropertyOptional({
    description: "League email address",
    example: "contact@ligue-bretagne.fr",
    type: String,
  })
  email!: string | null;

  @ApiPropertyOptional({
    description: "League address",
    example: "1 rue de la Ligue, 35000 Rennes",
    type: String,
  })
  address!: string | null;

  @ApiPropertyOptional({
    description: "League president",
    type: PresidentResponseDto,
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
