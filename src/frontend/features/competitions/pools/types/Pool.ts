// src/frontend/features/competitions/pools/types/Pool.ts
import type { components } from "@/shared/types/api.generated";

/**
 * Pool entity, generated from the backend OpenAPI document.
 * Regenerate with `npm run typegen` after backend DTO changes —
 * CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type Pool = components["schemas"]["PoolResponseDto"];
