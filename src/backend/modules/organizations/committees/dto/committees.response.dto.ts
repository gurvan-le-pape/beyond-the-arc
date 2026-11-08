// src/backend/modules/organizations/committees/dto/committees.response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * A committee's department, nested in the committee response.
 */
export class DepartmentResponseDto {
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

  @ApiProperty({
    description: "Committee address",
    example: "1 rue du Comité, 35000 Rennes",
    type: String,
    nullable: true,
  })
  address!: string | null;

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

  @ApiProperty({
    description:
      "The committee's page on the FFBB competitions site, where its contact details are kept up to date",
    example: "https://competitions.ffbb.com/ligues/sud/comites/0013",
    type: String,
    nullable: true,
  })
  ffbbUrl!: string | null;
}
