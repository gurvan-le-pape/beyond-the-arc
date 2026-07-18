// src/frontend/features/competitions/championships/types/Championship.ts
import type { components } from "@/shared/types";

/**
 * Championship entities, generated from the backend OpenAPI document.
 * The category/gender/level unions come from the contract's enum
 * declarations (#238). Regenerate with `npm run typegen` after backend
 * DTO changes — CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type ChampionshipPool = components["schemas"]["ChampionshipPoolDto"];

export type Championship = components["schemas"]["ChampionshipResponseDto"];
