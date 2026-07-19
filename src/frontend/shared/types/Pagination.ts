// src/frontend/shared/types/Pagination.ts
import type { components } from "./api.generated";

/**
 * Pagination envelope, generated from the backend OpenAPI document
 * (the contract's PaginatedResponseDto minus its untyped items).
 * Regenerate with `npm run typegen` after backend DTO changes —
 * CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type Pagination = Omit<
  components["schemas"]["PaginatedResponseDto"],
  "items"
>;

/**
 * Generic paginated response: the contract's envelope with typed items.
 */
export type PaginatedResponse<T> = Pagination & { items: T[] };
