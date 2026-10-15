// src/backend/common/decorators/api-envelope.decorator.ts
import {
  ApiEnvelopeDto,
  ApiListMetaDto,
  ApiPageMetaDto,
  PaginatedResponseDto,
} from "@common/dto";
import type { Type } from "@nestjs/common";
import { applyDecorators, HttpStatus } from "@nestjs/common";
import type { OpenAPIObject } from "@nestjs/swagger";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";

/**
 * The schema type, derived from the package's public surface.
 *
 * `SchemaObject` is declared in `dist/interfaces/open-api-spec.interface` and
 * re-exported from neither the package root nor `dist/interfaces/index.d.ts`,
 * which publishes only `ApiTagOptions` and `OpenAPIObject`. A deep
 * `@nestjs/swagger/dist/…` import is not the way in: `@nestjs/swagger` 11.4.6
 * carries an `exports` map publishing only `.`, `./plugin` and
 * `./package.json`, and this project resolves with `nodenext`, which honours
 * it. The deep path is `TS2307`, and no version of it will come back — that
 * map is the package saying which surface it supports.
 *
 * Indexed access reaches the same type through a name the package *does*
 * publish, so it survives the next release the way a private path cannot. It
 * resolves to `SchemaObject | ReferenceObject`, wider by exactly the `$ref`
 * case — harmless here, since every value this module builds is a schema and
 * `getSchemaPath` produces the refs.
 */
type SchemaObject = NonNullable<
  NonNullable<OpenAPIObject["components"]>["schemas"]
>[string];

/**
 * The three shapes a successful response can take, as decorators that document
 * the envelope `TransformInterceptor` actually sends.
 *
 * Every route under the global `/api` prefix is enveloped — `@SkipTransform`
 * is applied in exactly one place, `/metrics`, which is outside the prefix and
 * serves Prometheus text rather than JSON. So a 2xx on an `/api` route that is
 * *not* declared with one of these decorators is documenting a body the API
 * does not send.
 *
 * Composition is `ApiExtraModels` + `getSchemaPath` + `allOf` because a
 * generic type parameter does not survive into the OpenAPI document: the
 * envelope's three constant fields come from `$ref`-ing `ApiEnvelopeDto`, and
 * the parts that vary per endpoint (`data`, and `meta` where it exists) are
 * merged in as a second `allOf` member. That keeps one declaration of the
 * wrapper for 34 endpoints instead of 34 hand-written copies — which is what
 * the sibling-`schema` examples were, and why they drifted.
 *
 * @see ApiEnvelopeDto for why `data` and `meta` are not properties of the base
 */

/** The envelope base plus whatever the endpoint puts in `data`/`meta`. */
const envelopeOf = (extra: SchemaObject): SchemaObject => ({
  allOf: [{ $ref: getSchemaPath(ApiEnvelopeDto) }, extra],
});

/**
 * A single object under `data`, and **no `meta` key at all**.
 *
 * `generateMeta` returns `undefined` for anything that is neither an array nor
 * a `{ items, total }` payload, and `res.json()` omits an undefined value — so
 * the key is absent from the body rather than present and null. Confirmed on
 * the wire for all 18 endpoints of this shape.
 *
 * `status` exists for the one enveloped response that is not a 200: the health
 * routes' 503, which `HealthCheckExceptionFilter` wraps in the same envelope as
 * their success path. Everything else defaults to 200, which is every other
 * enveloped response in the API.
 */
export const ApiEnvelope = <TDto extends Type<unknown>>(
  dto: TDto,
  description: string,
  status: HttpStatus = HttpStatus.OK,
) =>
  applyDecorators(
    ApiExtraModels(ApiEnvelopeDto, dto),
    ApiResponse({
      status,
      description,
      schema: envelopeOf({
        properties: { data: { $ref: getSchemaPath(dto) } },
        required: ["data"],
      }),
    }),
  );

/**
 * An array under `data`, with `meta: { count }` giving its length.
 *
 * This is the plain list shape — no pagination, the whole result set in one
 * response. `ApiEnvelopePage` is the paginated counterpart.
 */
export const ApiEnvelopeList = <TDto extends Type<unknown>>(
  dto: TDto,
  description: string,
) =>
  applyDecorators(
    ApiExtraModels(ApiEnvelopeDto, ApiListMetaDto, dto),
    ApiOkResponse({
      description,
      schema: envelopeOf({
        properties: {
          data: { type: "array", items: { $ref: getSchemaPath(dto) } },
          meta: { $ref: getSchemaPath(ApiListMetaDto) },
        },
        required: ["data", "meta"],
      }),
    }),
  );

/**
 * A page under `data` — `PaginatedResponseDto` with typed `items` — plus
 * `meta: { count, page, limit, totalPages }`.
 *
 * The pagination numbers appear twice on the wire, inside `data` and again in
 * `meta`, with one difference that matters: `data.total` is the size of the
 * full result set and `meta.count` is the length of this page. Both halves are
 * documented because both are sent; the descriptions on `ApiPageMetaDto` say
 * which is which. Documenting the page as the whole body would describe the
 * right fields in the wrong place.
 */
export const ApiEnvelopePage = <TItem extends Type<unknown>>(
  itemDto: TItem,
  description: string,
) =>
  applyDecorators(
    ApiExtraModels(
      ApiEnvelopeDto,
      ApiPageMetaDto,
      PaginatedResponseDto,
      itemDto,
    ),
    ApiOkResponse({
      description,
      schema: envelopeOf({
        properties: {
          data: {
            allOf: [
              { $ref: getSchemaPath(PaginatedResponseDto) },
              {
                properties: {
                  items: {
                    type: "array",
                    items: { $ref: getSchemaPath(itemDto) },
                  },
                },
                required: ["items"],
              },
            ],
          },
          meta: { $ref: getSchemaPath(ApiPageMetaDto) },
        },
        required: ["data", "meta"],
      }),
    }),
  );
