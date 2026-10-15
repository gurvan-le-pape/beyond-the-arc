// src/frontend/features/teams/components/TeamListItem.tsx
"use client";

import { useTranslations } from "next-intl";

import type { ClubTeamInfo } from "@/features/organizations/clubs/types";
import { Link } from "@/navigation";
import { ChampionshipLabel } from "@/shared/components/domain";
import { Badge, TextLink } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { formatTeamName } from "@/shared/utils";

interface TeamListItemProps {
  readonly team: ClubTeamInfo;
  readonly clubName: string;
}

/**
 * A team row inside a **club** detail page: name, competition, pool link, and
 * the leaderboard standing when there is one.
 *
 * Takes `ClubTeamInfo` rather than `Team` — the shape the clubs feature loads —
 * which is why `clubName` arrives as its own prop instead of coming off the
 * team.
 *
 * The leaderboard block renders only when the team has standings; a rank of
 * `null` inside it shows an em dash.
 */
export function TeamListItem({ team, clubName }: TeamListItemProps) {
  const t = useTranslations("teams");
  const tCommon = useTranslations("common");

  const leaderboard = team.leaderboard;
  const pool = team.pool;
  const championship = pool?.championship;

  return (
    <div className="w-full px-6 py-3.5 flex items-center justify-between hover:bg-surface-inset transition-colors group">
      <div className="flex flex-col gap-1">
        <span className="text-[15px] font-medium text-text-heading">
          <TextLink href={`/teams/${team.id}`} variant="plain">
            {formatTeamName(clubName, team.number)}
          </TextLink>
        </span>

        {championship && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={championship.level} size="sm">
              {tCommon(`competition.levels.${championship.level}`)}
            </Badge>
            <Text variant="caption" as="span">
              <ChampionshipLabel
                category={team.category}
                gender={team.gender}
                division={championship.division}
              />
            </Text>
          </div>
        )}

        {championship && (
          <Link
            href={`/championships/${championship.id}?pool=${pool.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-clubs hover:underline transition-colors w-fit"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-solid-clubs" />
            {t("poolLabel", { letter: pool.letter })}
          </Link>
        )}
      </div>

      {leaderboard && (
        <div className="flex flex-col items-end gap-1.5 ml-4 shrink-0">
          <div className="flex items-baseline gap-1 px-2.5 py-1.5 rounded-lg bg-tint-warning border border-solid-warning">
            <span className="text-base font-medium text-ink-warning leading-none">
              {leaderboard.rank ?? "—"}
            </span>
            {leaderboard.poolSize && (
              <span className="text-xs text-ink-warning leading-none">
                /{leaderboard.poolSize}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-ink-success">
              {leaderboard.gamesWon}
              {t("teamDetail.won")}
            </span>
            <span className="w-px h-3 bg-text-muted" />
            <span className="text-xs font-medium text-ink-error">
              {leaderboard.gamesLost}
              {t("teamDetail.lost")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
