// src/frontend/features/matches/types/MatchEvent.ts
import type { components } from "@/shared/types";

/**
 * Generated from the backend OpenAPI document. Regenerate with
 * `npm run typegen` after backend DTO changes — CI fails when
 * docs/openapi.json and api.generated.ts drift.
 */
export type MatchEventPlayerRef = components["schemas"]["EventPlayerDto"];

export type MatchEventPlayer = components["schemas"]["MatchEventPlayerDto"];

export type ShotLocation = components["schemas"]["ShotLocationDto"];

export type MatchEvent = components["schemas"]["MatchEventDto"];
