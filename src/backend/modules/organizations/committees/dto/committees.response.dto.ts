// src/backend/modules/organizations/committees/dto/committees.response.dto.ts
import { PresidentResponseDto } from "@common/dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * Response DTO for department entity nested in committee.
 */
export class DepartmentResponseDto {
  @ApiProperty({
    description: "Department unique identifier",
    example: 1,
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "Department name",
    example: "Ain",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "Department code",
    example: "01",
    type: String,
  })
  code!: string;
}

/**
 * Response DTO for a committee entity.
 */
export class CommitteeResponseDto {
  @ApiProperty({
    description: "Committee unique identifier",
    example: 1,
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "Committee name",
    example: "COMITE DE L'AIN DE BASKET-BALL",
    type: String,
  })
  name!: string;

  @ApiPropertyOptional({
    description: "Committee phone number",
    example: "02 99 00 00 00",
    type: String,
  })
  phone!: string | null;

  @ApiPropertyOptional({
    description: "Committee email address",
    example: "contact@comite-bretagne.fr",
    type: String,
  })
  email!: string | null;

  @ApiPropertyOptional({
    description: "Committee address",
    example: "1 rue du Comité, 35000 Rennes",
    type: String,
  })
  address!: string | null;

  @ApiPropertyOptional({
    description: "Committee president",
    type: PresidentResponseDto,
  })
  president!: PresidentResponseDto | null;

  @ApiProperty({
    description: "Associated league ID",
    example: 10,
    type: Number,
  })
  leagueId!: number;

  @ApiProperty({
    description: "Associated department information",
    type: DepartmentResponseDto,
  })
  department!: DepartmentResponseDto;

  @ApiProperty({
    description: "Number of clubs in this committee",
    example: 15,
    type: Number,
  })
  clubCount!: number;
}
