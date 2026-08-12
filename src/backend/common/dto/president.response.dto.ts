// src/backend/common/dto/president.response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * The president relation exposed by leagues, committees and clubs.
 *
 * Name only. `phone` and `email` used to be here, which made 3,953 phone
 * numbers and 3,968 email addresses of named private individuals readable
 * one request at a time over a sequential, publicly-handed-out id space —
 * on an API with no authentication. No screen needs them: the detail pages
 * render the organisation's own contact details, not the president's.
 */
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
}
