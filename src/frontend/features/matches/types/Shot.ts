// src/frontend/features/matches/types/Shot.ts
import type { components } from "@/shared/types/api.generated";

/**
 * One shot on a shot chart: its location and event type. Generated from the
 * backend OpenAPI document; regenerate with `npm run typegen` after backend
 * DTO changes.
 */
export type Shot = components["schemas"]["ShotDto"];
