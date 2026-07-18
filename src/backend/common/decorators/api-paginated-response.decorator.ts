// src/backend/common/decorators/api-paginated-response.decorator.ts
import { PaginatedResponseDto } from "@common/dto";
import type { Type } from "@nestjs/common";
import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

/**
 * Documents a paginated endpoint response with a typed `items` array.
 *
 * `PaginatedResponseDto<T>` loses its type parameter in the OpenAPI
 * document (generics don't survive serialization), leaving `items`
 * untyped. This decorator composes the pagination envelope with a
 * concrete item schema so the contract — and the types generated from
 * it — carry the real item shape.
 */
export const ApiPaginatedResponse = <TItem extends Type<unknown>>(
  itemDto: TItem,
  description: string,
) =>
  applyDecorators(
    ApiExtraModels(PaginatedResponseDto, itemDto),
    ApiOkResponse({
      description,
      schema: {
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
    }),
  );
