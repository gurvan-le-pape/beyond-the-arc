// src/frontend/shared/components/domain/matches/matchHistoryColumns.tsx
import type { ReactNode } from "react";

import { Badge } from "@/shared/components/primitives";
import type { TableColumn } from "@/shared/components/table";
import { formatMatchDateTime } from "@/shared/utils";

interface MatchWithTeams {
  startsAt: Date | string;
  homeTeam: { id: number; club: { name: string } };
  awayTeam: { id: number; club: { name: string } };
}

/**
 * Shared "starts at" column for match-history tables, built the same way across
 * teams/players/matches features.
 */
export function buildMatchDateColumn<T extends MatchWithTeams>(
  header: ReactNode,
  locale: string,
): TableColumn<T> {
  return {
    key: "startsAt",
    header,
    render: (match: T) => formatMatchDateTime(match.startsAt, locale),
    align: "center",
  };
}

/**
 * Shared "opponent" column for match-history tables scoped to one team — a
 * team's own history, or a player's.
 *
 * Every row involves that team, so naming it again on each row only pushes the
 * stat columns off a phone screen. The column names the other side and which
 * side hosted: `describe` is the caller's translator, since "vs"/"at" (or
 * "contre"/"chez") is user-facing text.
 */
export function buildOpponentColumn<T extends MatchWithTeams>(
  header: ReactNode,
  currentTeamId: number,
  describe: (opponent: string, venue: "home" | "away") => string,
): TableColumn<T> {
  return {
    key: "opponent",
    header,
    render: (match: T) =>
      match.homeTeam.id === currentTeamId
        ? describe(match.awayTeam.club.name, "home")
        : describe(match.homeTeam.club.name, "away"),
    align: "left",
  };
}

interface MatchWithScore extends MatchWithTeams {
  homeTeamScore: number | null;
  awayTeamScore: number | null;
}

/** The words the result column shows: a one-letter badge and its full name. */
export interface ResultLabels {
  readonly win: string;
  readonly winShort: string;
  readonly loss: string;
  readonly lossShort: string;
}

/**
 * Result column of a team's or player's match history, read from that team's
 * side: a win/loss badge, then the team's score before the opponent's. A row
 * already says "chez X" or "contre X", so a score in home–away order would
 * leave the reader to work out which number is theirs.
 *
 * The badge shows one letter; its full word is what a screen reader hears.
 * Basketball has no draws, so a level score cannot occur in a played match.
 */
export function buildResultColumn<T extends MatchWithScore>(
  header: ReactNode,
  currentTeamId: number,
  labels: ResultLabels,
): TableColumn<T> {
  return {
    key: "result",
    header,
    render: (match: T) => {
      if (match.homeTeamScore === null || match.awayTeamScore === null) {
        return "—";
      }
      const isHome = match.homeTeam.id === currentTeamId;
      const own = isHome ? match.homeTeamScore : match.awayTeamScore;
      const opponent = isHome ? match.awayTeamScore : match.homeTeamScore;
      const won = own > opponent;

      return (
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <Badge variant={won ? "success" : "error"} size="sm">
            <span aria-hidden="true">
              {won ? labels.winShort : labels.lossShort}
            </span>
            <span className="sr-only">{won ? labels.win : labels.loss}</span>
          </Badge>
          <span className="tabular-nums">
            {own} - {opponent}
          </span>
        </span>
      );
    },
    align: "center",
  };
}
