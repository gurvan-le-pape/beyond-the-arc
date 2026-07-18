// src/frontend/features/organizations/clubs/types/ClubStatsByDepartment.ts
import type { components } from "@/shared/types";

/**
 * Department-level club statistics, generated from the backend OpenAPI
 * document. Regenerate with `npm run typegen` after backend DTO changes —
 * CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type DepartmentInfo = components["schemas"]["DepartmentInfoDto"];

export type ClubStatsByDepartment =
  components["schemas"]["ClubStatsByDepartmentDto"];
