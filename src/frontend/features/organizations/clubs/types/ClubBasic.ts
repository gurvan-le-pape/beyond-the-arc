// src/frontend/features/organizations/clubs/types/ClubBasic.ts
import type { components } from "@/shared/types/api.generated";

/**
 * Basic club entity, generated from the backend OpenAPI document.
 * Regenerate with `npm run typegen` after backend DTO changes —
 * CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type ClubBasic = components["schemas"]["ClubBasicResponseDto"];
