// src/backend/modules/organizations/committees/dto/committees.response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

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
    description: "Unique committee identifier",
    example: 1,
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "Committee name",
    example: "Comité Departmental de l'Ain",
    type: String,
  })
  name!: string;

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
}
