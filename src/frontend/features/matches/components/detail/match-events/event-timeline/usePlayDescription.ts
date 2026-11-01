// src/frontend/features/matches/components/detail/match-events/event-timeline/usePlayDescription.ts
import { useFormatter, useTranslations } from "next-intl";

import type { EventStyle } from "@/features/matches/types";
import {
  describeEvent,
  type EventDescriptionToken,
  tokenizeEventDescription,
} from "@/features/matches/utils";
import { EventType, Role } from "@/shared/constants";

import type { Play, ScoredMatchEvent } from "../plays";

/** What a play's row says: its label, its free throws, and its sentence. */
export interface PlayDescription {
  readonly label: string;
  /** The free throws folded into the play; `null` when it has none. */
  readonly freeThrows: {
    readonly made: number;
    readonly attempted: number;
  } | null;
  /** The sentence split into runs, player names marked; empty when there is none. */
  readonly tokens: readonly EventDescriptionToken[];
}

/**
 * The label and sentence of one row of the timeline.
 *
 * A lone event reads as its own label and sentence. A foul with its free
 * throws keeps the foul's, followed by how many went in. Simultaneous
 * substitutions read as one sentence listing everyone who came in and went
 * out, in the locale's list format. Every player named in any of the play's
 * events becomes a link.
 *
 * @param play - the play to describe
 * @param style - the display config of the play's lead event
 * @returns the row's label, free throws and sentence
 */
export function usePlayDescription(
  play: Play,
  style: EventStyle,
): PlayDescription {
  const t = useTranslations("matches");
  const format = useFormatter();

  const events = [play.lead, ...play.followers];
  const players = events.flatMap((event) => event.players ?? []);
  const tokenize = (text: string) =>
    text ? tokenizeEventDescription(text, players) : [];

  if (play.lead.eventType === EventType.SUBSTITUTION && play.followers.length) {
    const names = (role: string) =>
      format.list(events.map((event) => nameIn(event, role) ?? ""));
    return {
      label: t("matchEvents.substitutions"),
      freeThrows: null,
      tokens: tokenize(
        t("matchEvents.descriptions.substitutionGroup", {
          entering: names(Role.ENTERING_PLAYER),
          exiting: names(Role.EXITING_PLAYER),
        }),
      ),
    };
  }

  const description = describeEvent(play.lead);
  const sentence = description
    ? t(`matchEvents.descriptions.${description.key}`, description.values)
    : "";
  // Outside substitutions, the only events a play folds in are free throws.
  const freeThrows =
    play.followers.length > 0
      ? {
          made: play.followers.filter(
            (event) => event.eventType === EventType.FREE_THROW_MADE,
          ).length,
          attempted: play.followers.length,
        }
      : null;

  return {
    label: style.labelKey ? t(style.labelKey) : play.lead.eventType,
    freeThrows,
    tokens: tokenize(
      freeThrows
        ? [sentence, t("matchEvents.freeThrows", freeThrows)]
            .filter(Boolean)
            .join(" ")
        : sentence,
    ),
  };
}

/**
 * The name of the player in a role in an event.
 *
 * @param event - the event to look in
 * @param role - the role to find
 * @returns the player's name; `undefined` when nobody holds the role
 */
function nameIn(event: ScoredMatchEvent, role: string): string | undefined {
  return event.players?.find((p) => p.role === role)?.player.name;
}
