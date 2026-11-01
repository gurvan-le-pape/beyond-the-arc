// src/frontend/features/matches/components/detail/match-events/match-flow/matchFlow.ts
import type { MatchEvent } from "@/features/matches/types";

import { gameSeconds } from "../gameClock";
import { type Play, type Run, scoringStreaks } from "../plays";

/** Where a period ends on the match's time axis. */
export interface PeriodEnd {
  readonly period: number;
  /** Game seconds from tip-off to the period's buzzer. */
  readonly seconds: number;
}

/**
 * When each period's buzzer sounds, read off the events rather than off
 * period lengths the frontend would have to know: an event's elapsed time
 * plus the time left on its clock lands on its period's buzzer.
 *
 * @param events - the match's events
 * @param tipOff - when the match started
 * @returns one entry per period with an event, in period order
 */
export function periodEnds(
  events: readonly MatchEvent[],
  tipOff: Date | string,
): PeriodEnd[] {
  const ends = new Map<number, number>();
  for (const event of events) {
    if (ends.has(event.period)) continue;
    ends.set(
      event.period,
      gameSeconds(event.occurredAt, tipOff) + event.secondsLeft,
    );
  }
  return [...ends]
    .sort(([a], [b]) => a - b)
    .map(([period, seconds]) => ({ period, seconds }));
}

/** The widest a side's lead got, and the play that took it there. */
export interface BiggestLead {
  readonly margin: number;
  readonly play: Play;
}

/** The shape of the match, in the figures above the timeline. */
export interface MatchSummary {
  /** The plays that took the lead from the side that had it. */
  readonly leadChanges: number;
  /** The plays that levelled the score, the 0–0 start not included. */
  readonly ties: number;
  /** Each side's biggest lead; `null` for a side that never led. */
  readonly biggestLead: {
    readonly home: BiggestLead | null;
    readonly away: BiggestLead | null;
  };
  /**
   * The most points either side scored in a row, the earliest when two
   * streaks tie, whether or not it reaches `RUN_MIN_POINTS`; `null` in a
   * match without a point.
   */
  readonly bestRun: Run | null;
  /**
   * The play after which the winner led for good: its first basket for a
   * wire-to-wire win. `null` when the match ended level.
   */
  readonly decidingPlay: Play | null;
}

/**
 * Each side's biggest lead over the match.
 *
 * @param plays - the match's plays, in match order
 * @returns the widest lead per side and the first play to reach it
 */
function biggestLeads(plays: readonly Play[]): MatchSummary["biggestLead"] {
  let home: BiggestLead | null = null;
  let away: BiggestLead | null = null;
  for (const play of plays) {
    const margin = play.homeScore - play.awayScore;
    if (margin > (home?.margin ?? 0)) home = { margin, play };
    if (-margin > (away?.margin ?? 0)) away = { margin: -margin, play };
  }
  return { home, away };
}

/**
 * The play after which the winner led for good.
 *
 * @param plays - the match's plays, in match order
 * @returns the last play that put the winner ahead; `null` when the match ended level
 */
function findDecidingPlay(plays: readonly Play[]): Play | null {
  const last = plays[plays.length - 1];
  const winner = last ? Math.sign(last.homeScore - last.awayScore) : 0;
  if (winner === 0) return null;

  let deciding: Play | null = null;
  let before = 0;
  for (const play of plays) {
    if (play.scoringTeamId === undefined) continue;
    const now = Math.sign(play.homeScore - play.awayScore);
    if (now === winner && before !== winner) deciding = play;
    before = now;
  }
  return deciding;
}

/**
 * Sums up the match from its plays.
 *
 * @param plays - the match's plays, in match order, as `groupPlays` returns them
 * @returns the match's figures
 */
export function summarizeMatch(plays: readonly Play[]): MatchSummary {
  const bestRun = scoringStreaks(plays).reduce<Run | null>(
    (best, { teamId, points }) =>
      points > (best?.points ?? 0) ? { teamId, points } : best,
    null,
  );

  return {
    leadChanges: plays.filter((play) => play.swing === "leadChange").length,
    ties: plays.filter((play) => play.swing === "tie").length,
    biggestLead: biggestLeads(plays),
    bestRun,
    decidingPlay: findDecidingPlay(plays),
  };
}

/** One step of the score-margin chart: a scoring play and where it falls. */
export interface MarginPoint {
  readonly play: Play;
  /** Game seconds from tip-off to the play. */
  readonly seconds: number;
  /** Home score minus away score once the play is over. */
  readonly margin: number;
}

/**
 * The score margin after each scoring play, against game time.
 *
 * @param plays - the match's plays, in match order
 * @param tipOff - when the match started
 * @returns one point per scoring play, in match order
 */
export function marginPoints(
  plays: readonly Play[],
  tipOff: Date | string,
): MarginPoint[] {
  return plays
    .filter((play) => play.scoringTeamId !== undefined)
    .map((play) => ({
      play,
      seconds: gameSeconds(play.lead.occurredAt, tipOff),
      margin: play.homeScore - play.awayScore,
    }));
}
