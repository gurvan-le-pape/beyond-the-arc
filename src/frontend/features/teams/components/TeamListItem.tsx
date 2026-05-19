// src/frontend/features/teams/components/TeamListItem.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import type { ClubTeamInfo } from "@/features/organizations/clubs/types";
import { Badge } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { CompetitionLevel } from "@/shared/constants";
import { normalizeString } from "@/shared/utils";

interface TeamListItemProps {
  readonly team: ClubTeamInfo;
  readonly clubName: string;
}

interface LevelBadgeProps {
  readonly level: string;
  readonly label: string;
}

function buildCompetitionUrl(
  team: ClubTeamInfo,
  locale: string,
): string | null {
  const championship = team.pool?.championship;
  if (!championship || !team.pool) return null;

  const level = normalizeString(championship.level);
  let parentId: number | null = null;

  if (level === CompetitionLevel.DEPARTMENTAL) {
    parentId = championship.committeeId;
  } else if (level === CompetitionLevel.REGIONAL) {
    parentId = championship.leagueId;
  }

  if (!parentId) return null;
  return `/${locale}/championships/${championship.id}?pool=${team.pool.id}`;
}

function LevelBadge({ level, label }: LevelBadgeProps) {
  const normalized = normalizeString(level);

  if (normalized === CompetitionLevel.REGIONAL) {
    return (
      <Badge variant="regional" size="sm">
        {label}
      </Badge>
    );
  }
  if (normalized === CompetitionLevel.DEPARTMENTAL) {
    return (
      <Badge variant="departmental" size="sm">
        {label}
      </Badge>
    );
  }
  return null;
}

export function TeamListItem({ team, clubName }: TeamListItemProps) {
  const t = useTranslations("teams");
  const tCommon = useTranslations("common");
  const { locale } = useParams<{ locale: string }>();

  const leaderboard = team.leaderboard;
  const pool = team.pool;
  const championship = pool?.championship;
  const competitionUrl = buildCompetitionUrl(team, locale);

  let levelLabel: string | null = null;

  if (championship) {
    const level = normalizeString(championship.level);
    if (level === CompetitionLevel.REGIONAL) {
      levelLabel = tCommon("competition.levels.regional");
    } else if (level === CompetitionLevel.DEPARTMENTAL) {
      levelLabel = tCommon("competition.levels.departmental");
    }
  }

  return (
    <div className="w-full px-6 py-3.5 flex items-center justify-between hover:bg-surface-inset transition-colors group">
      {/* Left */}
      <div className="flex flex-col gap-1">
        <Link
          href={`/${locale}/teams/${team.id}`}
          className="text-[15px] font-medium text-text-heading group-hover:text-primary transition-colors hover:underline"
        >
          {clubName} {team.number || ""}
        </Link>

        {championship && levelLabel && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <LevelBadge level={championship.level} label={levelLabel} />
            <Text variant="caption" as="span">
              {championship.name}
            </Text>
          </div>
        )}

        {competitionUrl && pool?.name && (
          <Link
            href={competitionUrl}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-clubs-strong hover:underline transition-colors w-fit"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-clubs" />
            {pool.name}
          </Link>
        )}
      </div>

      {/* Right */}
      {leaderboard && (
        <div className="flex flex-col items-end gap-1.5 ml-4 shrink-0">
          {/* Rank */}
          <div className="flex items-baseline gap-1 px-2.5 py-1.5 rounded-lg bg-warning-subtle border border-warning">
            <span className="text-base font-medium text-warning-strong leading-none">
              {leaderboard.rank ?? "—"}
            </span>
            {leaderboard.poolSize && (
              <span className="text-xs text-warning-strong/60 leading-none">
                /{leaderboard.poolSize}
              </span>
            )}
          </div>

          {/* W / L */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-success-strong">
              {leaderboard.gamesWon}
              {t("teamDetail.won")}
            </span>
            <span className="w-px h-3 bg-text-muted" />
            <span className="text-xs font-medium text-error-strong">
              {leaderboard.gamesLost}
              {t("teamDetail.lost")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
