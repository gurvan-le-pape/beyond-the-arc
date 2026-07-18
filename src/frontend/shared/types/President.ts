// src/frontend/shared/types/President.ts
import type { components } from "./api.generated";

/**
 * President entity, generated from the backend OpenAPI document.
 * Regenerate with `npm run typegen` after backend DTO changes —
 * CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type President = components["schemas"]["PresidentResponseDto"];
