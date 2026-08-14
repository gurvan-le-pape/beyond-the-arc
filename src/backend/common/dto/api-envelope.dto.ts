// src/backend/common/dto/api-envelope.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * The envelope every successful response is wrapped in by
 * `TransformInterceptor`, and — from here — described in `docs/openapi.json`.
 *
 * It exists because the document described the *unwrapped* payload while the
 * API has never sent one. A client reading the contract for `/api/leagues` was
 * told to expect `LeagueResponseDto[]`; what arrives is
 * `{ data: LeagueResponseDto[], meta: { count }, timestamp, path, statusCode }`.
 * The envelope was not undocumented so much as documented where nothing reads
 * it: 16 responses carried a `schema` key as a *sibling* of `content`, a
 * position the OpenAPI spec does not define and `openapi-typescript` drops, so
 * the only description of the wrapper never reached a generated type or the
 * rendered Swagger UI.
 *
 * `data` is deliberately not a property here. Its type is what varies per
 * endpoint, and a generic type parameter does not survive serialization into
 * the document — so the three decorators in `@common/decorators` compose this
 * base with a concrete `data` schema through `allOf`. This class holds only
 * the three fields that are on every enveloped response regardless of shape.
 *
 * `meta` is not here either, for a different reason: it is absent from the
 * body entirely on single-object responses (`generateMeta` returns `undefined`
 * and `res.json()` omits the key), so declaring it optional on the base would
 * describe it as possible everywhere. The two shapes that do carry it get it
 * from `ApiListMetaDto` / `ApiPageMetaDto` below, added by the decorator that
 * knows which applies.
 *
 * @see TransformInterceptor — the emitter, whose return type is this class
 * @see ApiErrorResponseDto — the failure-path counterpart; errors are *not*
 *   enveloped, they are the body itself
 */
export class ApiEnvelopeDto {
  @ApiProperty({
    description: "When the response was produced, as an ISO 8601 UTC instant",
    example: "2026-02-05T10:00:00.000Z",
    type: String,
  })
  timestamp!: string;

  @ApiProperty({
    description:
      "The request path that produced this response, including the /api prefix and any query string",
    example: "/api/leagues",
    type: String,
  })
  path!: string;

  @ApiProperty({
    description: "HTTP status code, repeated in the body for convenience",
    example: 200,
    type: Number,
  })
  statusCode!: number;
}

/**
 * `meta` on a list response: the length of the `data` array, and nothing else.
 *
 * Measured rather than inferred — `generateMeta` returns exactly `{ count }`
 * for an array, so a list response has no `page`/`limit`/`totalPages` even
 * though the interceptor's own interface once declared all four as optional on
 * one type. Two shapes, two classes, so the document can say which is which.
 */
export class ApiListMetaDto {
  @ApiProperty({
    description: "Number of items in `data`",
    example: 3,
    type: Number,
  })
  count!: number;
}

/**
 * `meta` on a paginated response.
 *
 * Note what is *not* here: `total`. The interceptor copies `page`, `limit` and
 * a computed `totalPages` out of the payload but not the total item count,
 * which lives inside `data` instead (`PaginatedResponseDto.total`). `count` is
 * the length of the current page, not the size of the result set — the two
 * differ on every page but the last, and calling both "count" in one document
 * is the kind of thing this row exists to stop.
 */
export class ApiPageMetaDto {
  @ApiProperty({
    description:
      "Number of items on the current page — not the size of the full result set, which is `data.total`",
    example: 50,
    type: Number,
  })
  count!: number;

  @ApiProperty({
    description: "Current page (1-based), mirroring `data.page`",
    example: 1,
    type: Number,
  })
  page!: number;

  @ApiProperty({
    description: "Requested page size, mirroring `data.limit`",
    example: 50,
    type: Number,
  })
  limit!: number;

  @ApiProperty({
    description: "Total number of pages, mirroring `data.totalPages`",
    example: 3,
    type: Number,
  })
  totalPages!: number;
}
