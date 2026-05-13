// src/frontend/features/matches/constants/eventCategories.ts
import { EventCategory, EventType } from "@/shared/constants";

export const eventCategories: Partial<Record<EventCategory, EventType[]>> = {
  [EventCategory.MADE]: [
    EventType.MADE_LAYUP,
    EventType.MADE_DUNK,
    EventType.MADE_FADEAWAY,
    EventType.MADE_PULL_UP_JUMP_SHOT,
    EventType.MADE_CATCH_AND_SHOOT_THREE,
    EventType.MADE_STEP_BACK_THREE,
    EventType.FREE_THROW_MADE,
    EventType.THREE_POINT_AND_1,
    EventType.TWO_POINT_EXT_AND_1,
    EventType.TWO_POINT_INT_AND_1,
  ],
  [EventCategory.MISS]: [
    EventType.MISSED_LAYUP,
    EventType.MISSED_DUNK,
    EventType.MISSED_FADEAWAY,
    EventType.MISSED_PULL_UP_JUMP_SHOT,
    EventType.MISSED_CATCH_AND_SHOOT_THREE,
    EventType.MISSED_STEP_BACK_THREE,
    EventType.FREE_THROW_MISSED,
  ],
  [EventCategory.DEFENSIVE]: [EventType.BLOCKED_SHOT, EventType.STEAL],
  [EventCategory.FOUL]: [
    EventType.BLOCKING_FOUL,
    EventType.PUSHING_FOUL,
    EventType.REACHING_FOUL,
    EventType.CHARGING_FOUL,
    EventType.ILLEGAL_SCREEN,
    EventType.TECHNICAL_FOUL,
    EventType.OFFENSIVE_FOUL,
    EventType.THREE_POINT_SHOOTING_FOUL,
    EventType.TWO_POINT_EXT_SHOOTING_FOUL,
    EventType.TWO_POINT_INT_SHOOTING_FOUL,
  ],
  [EventCategory.TURNOVER]: [
    EventType.TRAVELING,
    EventType.CARRYING,
    EventType.DOUBLE_DRIBBLE,
    EventType.BAD_PASS,
    EventType.SHOT_CLOCK_VIOLATION,
  ],
  [EventCategory.SUBSTITUTION]: [EventType.SUBSTITUTION],
  [EventCategory.REBOUND]: [
    EventType.OFFENSIVE_REBOUND,
    EventType.DEFENSIVE_REBOUND,
  ],
};
