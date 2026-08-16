// src/frontend/features/organizations/clubs/types/ClubsPaginatedResponse.ts
import type { paths } from "@/shared/types/api.generated";

/**
 * Paginated clubs list, generated from the backend OpenAPI document —
 * the pagination envelope with typed items comes straight from the
 * /clubs operation (#241). Regenerate with `npm run typegen` after
 * backend DTO changes — CI fails when docs/openapi.json and
 * api.generated.ts drift.
 *
 * The `["data"]` on the end is not an implementation detail to tidy away: it
 * is where the unwrapping both HTTP clients perform becomes visible in the
 * types. `api-client.ts` and `server-api-client.ts` each strip the response
 * envelope before a service method sees the payload, so what a caller receives
 * is the `data` half, not the whole body. The document describes the envelope,
 * so indexing explicitly is what keeps this alias correct rather than
 * accidentally correct.
 */
export type ClubsPaginatedResponse =
  paths["/api/clubs"]["get"]["responses"][200]["content"]["application/json"]["data"];
