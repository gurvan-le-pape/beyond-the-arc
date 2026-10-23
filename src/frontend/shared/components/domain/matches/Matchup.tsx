// src/frontend/shared/components/domain/matches/Matchup.tsx
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "@/navigation";
import { TextLink } from "@/shared/components/primitives";
import { cn, type MatchSide, matchWinner } from "@/shared/utils";

import { ClubMark } from "../ClubMark";
import { MatchScore } from "./MatchScore";

/** One side of a match, as `Matchup` draws it. */
export interface MatchupSide {
  readonly teamId: number;
  /** The team's display name, from `formatTeamName`. */
  readonly teamName: string;
  readonly clubId: number | null;
  readonly clubName: string | null;
  /** The final score, `null` until the match is played. */
  readonly score: number | null;
}

type MatchupSize = "hero" | "card" | "row";

interface MatchupBaseProps {
  readonly home: MatchupSide;
  readonly away: MatchupSide;
  /**
   * Link each side's club mark (at `hero` size) to its club and its name to its
   * team. Off when
   * the matchup sits inside a link of its own, such as a list card.
   */
  readonly linked?: boolean;
}

interface FacingMatchupProps {
  /**
   * `hero` heads the match page, `card` is a match in a list of matches, `row`
   * a fixture among many in a championship's matchday.
   */
  readonly size: MatchupSize;
  /** Shown under the score, such as a link to the match. */
  readonly belowScore?: ReactNode;
}

interface LineMatchupProps {
  /**
   * `line` stacks the two sides as two lines, each a name and its own score,
   * for a short list of results. It has no score in the middle, so nothing
   * goes under one.
   */
  readonly size: "line";
  readonly belowScore?: never;
}

type MatchupProps = MatchupBaseProps & (FacingMatchupProps | LineMatchupProps);

// Only `hero` draws club marks: it heads the match page, where each mark is
// also the link to its club. In a list the mark repeated the name beside it,
// and initials do not tell clubs apart, many clubs sharing each pair. `centre` is
// the mark's height, so the score lines up with the two marks however many
// lines each team's name wraps onto; with no mark it lines up with the names.
const SIZES = {
  hero: {
    mark: "xl",
    score: "hero",
    side: "contents md:flex md:gap-4",
    name: "text-xs md:text-base",
    centre: "min-h-16",
  },
  card: {
    mark: null,
    score: "list",
    side: "gap-3",
    name: "text-sm md:text-lg",
    centre: "",
  },
  row: {
    mark: null,
    score: "compact",
    side: "gap-1",
    name: "text-sm line-clamp-2",
    centre: "",
  },
} as const;

// Below `md`, a side is too narrow for a name beside the score: it gets 80px
// at 390, and a long one wraps onto four lines. So there the hero is a grid,
// each side's `contents` laid into it: the marks at either edge with the score
// centred between them, and under them the names, each in half the width and
// aligned to its mark's edge.
const HERO_GRID = {
  home: {
    mark: "col-start-1 row-start-1 justify-self-start",
    name: "col-start-1 row-start-2 text-left md:text-center",
  },
  away: {
    mark: "col-start-2 row-start-1 justify-self-end",
    name: "col-start-2 row-start-2 text-right md:text-center",
  },
} as const;

interface SideProps {
  readonly side: MatchupSide;
  readonly position: MatchSide;
  readonly size: MatchupSize;
  readonly isWinner: boolean;
  readonly linked: boolean;
}

function Side({ side, position, size, isWinner, linked }: SideProps) {
  const tCommon = useTranslations("common");
  const config = SIZES[size];
  const grid = size === "hero" ? HERO_GRID[position] : null;
  const mark = config.mark && (
    <ClubMark clubName={side.clubName} size={config.mark} />
  );

  return (
    <div
      className={cn(
        "flex flex-1 min-w-0 flex-col items-center text-center",
        config.side,
      )}
    >
      {mark && (
        <div className={grid?.mark}>
          {linked && side.clubId !== null ? (
            <Link
              href={`/organizations/clubs/${side.clubId}`}
              aria-label={tCommon("club.seeClub", {
                name: side.clubName ?? "",
              })}
              className="block rounded-button focus-ring"
            >
              {mark}
            </Link>
          ) : (
            mark
          )}
        </div>
      )}
      <span
        title={side.teamName}
        className={cn(
          "w-full leading-snug break-words",
          config.name,
          grid?.name,
          isWinner
            ? "font-bold text-text-heading"
            : "font-medium text-text-body",
        )}
      >
        {linked ? (
          <TextLink href={`/teams/${side.teamId}`} variant="plain">
            {side.teamName}
          </TextLink>
        ) : (
          side.teamName
        )}
      </span>
    </div>
  );
}

interface LineProps {
  readonly side: MatchupSide;
  readonly isWinner: boolean;
  readonly linked: boolean;
}

/** One side at `line` size: the team's name, then its score at the far end. */
function Line({ side, isWinner, linked }: LineProps) {
  const weight = isWinner
    ? "font-bold text-text-heading"
    : "font-normal text-text-body";

  return (
    <div className="flex items-baseline justify-between gap-3">
      <span title={side.teamName} className={cn("min-w-0 truncate", weight)}>
        {linked ? (
          <TextLink href={`/teams/${side.teamId}`} variant="plain">
            {side.teamName}
          </TextLink>
        ) : (
          side.teamName
        )}
      </span>
      <span className={cn("shrink-0 tabular-nums", weight)}>
        {side.score ?? "–"}
      </span>
    </div>
  );
}

/**
 * A match: its two sides — team name, with its club mark at `hero` size, home
 * on the left — and
 * the score between them, or "upcoming" before it is played; or, at `line`
 * size, home above away with each side's score beside its name.
 *
 * The one way the app draws a match, at four sizes. The winner, from
 * `matchWinner`, is shown the same way at every size: its name and its score
 * in bold heading text, the other side's in body text.
 */
export function Matchup({
  home,
  away,
  size,
  linked = false,
  belowScore,
}: MatchupProps) {
  const winner: MatchSide | null = matchWinner(home.score, away.score);

  if (size === "line") {
    return (
      <div className="flex flex-col gap-1.5 text-sm">
        <Line side={home} isWinner={winner === "home"} linked={linked} />
        <Line side={away} isWinner={winner === "away"} linked={linked} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start justify-between",
        size === "row" ? "gap-2" : "gap-3 md:gap-6",
        size === "hero" && "grid grid-cols-2 md:flex",
      )}
    >
      <Side
        side={home}
        position="home"
        size={size}
        isWinner={winner === "home"}
        linked={linked}
      />
      <div
        className={cn(
          "flex shrink-0 flex-col items-center justify-center gap-1",
          SIZES[size].centre,
          size === "hero" &&
            "col-span-2 col-start-1 row-start-1 justify-self-center",
        )}
      >
        <MatchScore
          homeScore={home.score}
          awayScore={away.score}
          variant={SIZES[size].score}
        />
        {belowScore}
      </div>
      <Side
        side={away}
        position="away"
        size={size}
        isWinner={winner === "away"}
        linked={linked}
      />
    </div>
  );
}

export default Matchup;
