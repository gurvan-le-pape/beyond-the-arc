// src/frontend/features/organizations/clubs/types/ClubsPaginatedResponse.ts
import type { paths } from "@/shared/types";

/**
 * Paginated clubs list, generated from the backend OpenAPI document —
 * the pagination envelope with typed items comes straight from the
 * /clubs operation (#241). Regenerate with `npm run typegen` after
 * backend DTO changes — CI fails when docs/openapi.json and
 * api.generated.ts drift.
 */
export type ClubsPaginatedResponse =
  paths["/api/clubs"]["get"]["responses"][200]["content"]["application/json"];
