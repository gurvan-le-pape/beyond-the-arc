// src/backend/common/dto/paginated-response.dto.ts
export class PaginatedResponseDto<T> {
  items!: T[];
  total!: number;
  page!: number;
  limit!: number;
  totalPages!: number;
}
