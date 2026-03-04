// src/frontend/features/matches/types/EventStyle.ts
import type { EventCategory } from "@/shared/constants/event-categories";

/**
 * Display configuration returned by getEventStyle for a single event type.
 */
export interface EventStyle {
  icon: string;
  color: string;
  labelKey: string;
  eventCategory: EventCategory;
}
