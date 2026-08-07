// src/backend/common/dto/president.response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

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

  @ApiProperty({
    description: "President phone number",
    example: "02 99 00 00 00",
    type: String,
    nullable: true,
  })
  phone!: string | null;

  @ApiProperty({
    description: "President email address",
    example: "president@ligue-bretagne.fr",
    type: String,
    nullable: true,
  })
  email!: string | null;
}
