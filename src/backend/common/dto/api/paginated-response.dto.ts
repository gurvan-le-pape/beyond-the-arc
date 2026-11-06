// src/backend/common/dto/api/paginated-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * Generic pagination envelope for list endpoints.
 *
 * `items` is documented as a plain object array: the element type is a
 * generic parameter, which neither the swagger plugin nor decorators can
 * resolve per-endpoint. The explicit decorator also stops the plugin from
 * inferring a self-referential schema for it (which crashes
 * SwaggerModule.createDocument at startup).
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: "Page of result items",
    isArray: true,
    type: "object",
    additionalProperties: true,
  })
  items!: T[];

  @ApiProperty({ description: "Total number of items", example: 120 })
  total!: number;

  @ApiProperty({ description: "Current page (1-based)", example: 1 })
  page!: number;

  @ApiProperty({ description: "Items per page", example: 50 })
  limit!: number;

  @ApiProperty({ description: "Total number of pages", example: 3 })
  totalPages!: number;
}
