// src/frontend/features/geography/types/Department.ts
import type { components } from "@/shared/types/api.generated";

/**
 * Department entity, generated from the backend OpenAPI document.
 * Regenerate with `npm run typegen` after backend DTO changes —
 * CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type Department = components["schemas"]["DepartmentResponseDto"];
