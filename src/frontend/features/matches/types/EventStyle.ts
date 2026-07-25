// src/frontend/features/matches/types/EventStyle.ts
import type { eventConfig } from "@/features/matches/constants";
import type { EventCategory } from "@/shared/constants";

/** Every label key declared in `eventConfig`. */
export type EventLabelKey =
  (typeof eventConfig)[keyof typeof eventConfig]["labelKey"];

/**
 * Display configuration returned by getEventStyle for a single event type.
 */
export interface EventStyle {
  icon: string;
  color: string;
  /**
   * Message key in the `matches` namespace, absent for event types with no
   * configured label — callers fall back to the raw event type.
   */
  labelKey?: EventLabelKey;
  eventCategory: EventCategory;
}
