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

interface MatchupProps {
  readonly home: MatchupSide;
  readonly away: MatchupSide;
  /**
   * `hero` heads the match page, `card` is a match in a list of matches, `row`
   * a fixture among many in a championship's matchday.
   */
  readonly size: MatchupSize;
  /**
   * Link each side's club mark to its club and its name to its team. Off when
   * the matchup sits inside a link of its own, such as a list card.
   */
  readonly linked?: boolean;
  /** Shown under the score, such as a link to the match. */
  readonly belowScore?: ReactNode;
}

// `centre` is the mark's height, so the score lines up with the two marks
// however many lines each team's name wraps onto.
const SIZES = {
  hero: {
    mark: "xl",
    score: "hero",
    side: "gap-3 md:gap-4",
    name: "text-xs md:text-base",
    centre: "min-h-16",
  },
  card: {
    mark: "lg",
    score: "list",
    side: "gap-3",
    name: "text-sm md:text-lg",
    centre: "min-h-14",
  },
  row: {
    mark: "sm",
    score: "compact",
    side: "gap-1",
    name: "text-sm line-clamp-2",
    centre: "min-h-8",
  },
} as const;

interface SideProps {
  readonly side: MatchupSide;
  readonly size: MatchupSize;
  readonly isWinner: boolean;
  readonly linked: boolean;
}

function Side({ side, size, isWinner, linked }: SideProps) {
  const tCommon = useTranslations("common");
  const config = SIZES[size];
  const mark = <ClubMark clubName={side.clubName} size={config.mark} />;

  return (
    <div
      className={cn(
        "flex flex-1 min-w-0 flex-col items-center text-center",
        config.side,
      )}
    >
      {linked && side.clubId !== null ? (
        <Link
          href={`/organizations/clubs/${side.clubId}`}
          aria-label={tCommon("club.seeClub", { name: side.clubName ?? "" })}
          className="rounded-button focus-ring"
        >
          {mark}
        </Link>
      ) : (
        mark
      )}
      <span
        title={side.teamName}
        className={cn(
          "w-full leading-snug break-words [hyphens:auto]",
          config.name,
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

/**
 * A match: its two sides — club mark and team name, home on the left — and
 * the score between them, or "upcoming" before it is played.
 *
 * The one way the app draws a match, at three sizes. The winner, from
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

  return (
    <div
      className={cn(
        "flex items-start justify-between",
        size === "row" ? "gap-2" : "gap-3 md:gap-6",
      )}
    >
      <Side
        side={home}
        size={size}
        isWinner={winner === "home"}
        linked={linked}
      />
      <div
        className={cn(
          "flex shrink-0 flex-col items-center justify-center gap-1",
          SIZES[size].centre,
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
        size={size}
        isWinner={winner === "away"}
        linked={linked}
      />
    </div>
  );
}

export default Matchup;
