// src/frontend/features/matches/hooks/useMatchHistoryColumns.tsx
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useMemo } from "react";

import { Badge } from "@/shared/components/primitives";
import type { TableColumn } from "@/shared/components/table";
import { formatMatchDayMonth, formatMatchDayTime } from "@/shared/utils";

interface MatchWithTeams {
  startsAt: Date | string;
  homeTeam: { id: number; club: { name: string } };
  awayTeam: { id: number; club: { name: string } };
}

interface MatchWithScore extends MatchWithTeams {
  homeTeamScore: number | null;
  awayTeamScore: number | null;
}

/** The words the result column shows: a one-letter badge and its full name. */
interface ResultLabels {
  readonly win: string;
  readonly winShort: string;
  readonly loss: string;
  readonly lossShort: string;
}

/**
 * Shared "starts at" column for match-history tables, built the same way across
 * teams/players/matches features: the day and month, "17 oct.", on one line
 * and only as wide as it. `withTime` gives a fixture its weekday and start
 * time instead, "sam. 24 oct., 19:00", which are still worth knowing.
 */
function buildMatchDateColumn<T extends MatchWithTeams>(
  header: ReactNode,
  locale: string,
  { withTime = false }: { withTime?: boolean } = {},
): TableColumn<T> {
  return {
    key: "startsAt",
    header,
    render: (match: T) =>
      withTime
        ? formatMatchDayTime(match.startsAt, locale)
        : formatMatchDayMonth(match.startsAt, locale),
    align: "left",
    width: "fit",
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
function buildOpponentColumn<T extends MatchWithTeams>(
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

/**
 * Result column of a team's or player's match history, read from that team's
 * side: a win/loss badge, then the team's score before the opponent's. A row
 * already says "chez X" or "contre X", so a score in home–away order would
 * leave the reader to work out which number is theirs.
 *
 * The badge shows one letter; its full word is what a screen reader hears.
 * Basketball has no draws, so a level score cannot occur in a played match.
 */
function buildResultColumn<T extends MatchWithScore>(
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
            {own}–{opponent}
          </span>
        </span>
      );
    },
    align: "left",
    width: "fit",
  };
}

/**
 * The columns every match-history table scoped to one team opens with: date,
 * opponent, and the result from that team's side — a team's own history, or a
 * player's. Callers append their own columns after these.
 *
 * Memoised on the team id, options and locale, so the returned array keeps its
 * identity between unrelated parent renders.
 *
 * @typeParam T - the caller's row type
 * @param currentTeamId - the team every row is read from; an id that matches
 *   nothing renders every match as an away game
 * @param options - `withTime` gives the date column a weekday and start time;
 *   `withResult: false` drops the result column, for fixtures
 * @returns column definitions, stable between renders
 */
export function useMatchHistoryColumns<T extends MatchWithScore>(
  currentTeamId: number,
  {
    withTime = false,
    withResult = true,
  }: { withTime?: boolean; withResult?: boolean } = {},
): TableColumn<T>[] {
  const t = useTranslations("common");
  const locale = useLocale();

  return useMemo<TableColumn<T>[]>(() => {
    const columns: TableColumn<T>[] = [
      buildMatchDateColumn<T>(t("matchHistory.date"), locale, { withTime }),
      buildOpponentColumn<T>(
        t("matchHistory.opponent"),
        currentTeamId,
        (opponent, venue) =>
          venue === "home"
            ? t("matchHistory.opponentHome", { opponent })
            : t("matchHistory.opponentAway", { opponent }),
      ),
    ];
    if (!withResult) return columns;

    return [
      ...columns,
      buildResultColumn<T>(t("matchHistory.result"), currentTeamId, {
        win: t("matchHistory.win"),
        winShort: t("matchHistory.winShort"),
        loss: t("matchHistory.loss"),
        lossShort: t("matchHistory.lossShort"),
      }),
    ];
  }, [t, locale, currentTeamId, withTime, withResult]);
}
