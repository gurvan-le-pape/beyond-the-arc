// src/backend/common/dto/president.response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * The president relation exposed by leagues, committees and clubs.
 *
 * Name only — no `phone`, no `email`. A president is a named private
 * individual, and this API is unauthenticated over a sequential,
 * publicly-handed-out id space, so any contact field here is a bulk export
 * readable one request at a time. No screen needs them: the detail pages
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
