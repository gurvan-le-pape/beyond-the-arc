// src/backend/common/dto/api-error-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * The error body every failed request receives, produced by
 * `AllExceptionsFilter` and — from here — described in `docs/openapi.json`.
 *
 * It exists because the one payload a client cannot avoid interpreting was the
 * one with no type. 45 error responses were documented by example alone, which
 * `openapi-typescript` renders as `unknown` (or `never` where there was no
 * `content` at all), so the frontend's only typing of an error body was two
 * unchecked `as Partial<ApiErrorResponse>` casts against a hand-written
 * interface.
 *
 * `error` is derived from the HTTP status, not from the exception class —
 * `"Not Found"`, not `"NotFoundException"`. Twenty-four documented examples
 * claimed the class name, so a client branching on the documented value would
 * have written a condition that can never be true.
 *
 * The dev-only `details` field (stack and cause, added by the filter when
 * `NODE_ENV === "development"`) is deliberately absent: this documents the
 * deployed contract, and nothing outside a developer's own machine ever sees
 * it.
 */
export class ApiErrorResponseDto {
  @ApiProperty({
    description: "HTTP status code, repeated in the body for convenience",
    example: 404,
    type: Number,
  })
  statusCode!: number;

  @ApiProperty({
    description:
      "What went wrong, for a developer reading logs — never user-facing copy. An array when it carries per-field validation failures.",
    example: "Player with ID 999999999 not found",
    oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
  })
  message!: string | string[];

  @ApiProperty({
    description:
      'The HTTP status name, e.g. "Not Found" or "Bad Request" — derived from the status code, never the exception class name',
    example: "Not Found",
    type: String,
  })
  error!: string;

  @ApiProperty({
    description: "The request path, including the /api prefix",
    example: "/api/players/999999999",
    type: String,
  })
  path!: string;

  @ApiProperty({
    description: "When the error was produced, as an ISO 8601 UTC instant",
    example: "2026-02-05T10:00:00.000Z",
    type: String,
  })
  timestamp!: string;
}
