// src/frontend/features/organizations/types/President.ts
import type { components } from "@/shared/types/api.generated";

/**
 * President entity, generated from the backend OpenAPI document.
 * Lives with `organizations` because all three organization types carry one
 * (club, committee and league detail responses).
 * Regenerate with `npm run typegen` after backend DTO changes —
 * CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type President = components["schemas"]["PresidentResponseDto"];
