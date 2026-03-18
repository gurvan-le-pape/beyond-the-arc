// src/backend/common/dto/president.response.dto.ts
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PresidentResponseDto {
  @ApiProperty({
    description: "President unique identifier",
    example: 1,
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "President name",
    example: "Jean Dupont",
    type: String,
  })
  name!: string;

  @ApiPropertyOptional({
    description: "President phone number",
    example: "02 99 00 00 00",
    type: String,
  })
  phone!: string | null;

  @ApiPropertyOptional({
    description: "President email address",
    example: "president@ligue-bretagne.fr",
    type: String,
  })
  email!: string | null;

  @ApiPropertyOptional({
    description: "President address",
    example: "1 rue de la Ligue, 35000 Rennes",
    type: String,
  })
  address!: string | null;

  @ApiPropertyOptional({
    description: "President code",
    example: "PRE-001",
    type: String,
  })
  code!: string | null;
}
