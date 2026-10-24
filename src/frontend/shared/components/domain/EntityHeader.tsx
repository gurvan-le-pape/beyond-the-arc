// src/frontend/shared/components/domain/EntityHeader.tsx
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { StatGroup } from "@/shared/components/blocks";
import { Card, TextLink } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import type { CompetitionLevel, Gender } from "@/shared/constants";
import { cn } from "@/shared/utils";

import { EntityHeaderBadges } from "./EntityHeaderBadges";

export interface EntityHeaderStat {
  readonly value: string;
  readonly label: string;
}

interface EntityHeaderProps {
  /** Leading visual: the player's avatar, or the team's club mark. */
  readonly visual: ReactNode;
  readonly title: string;
  /** The team's category and gender, the player's for a player. */
  readonly category: string;
  readonly gender: Gender;
  /**
   * The team's pool, with its championship. The championship's level and
   * division become badges, and the line under them links to this pool's
   * standings.
   */
  readonly pool?: {
    readonly id: number;
    readonly letter: string;
    readonly championship: {
      readonly id: number;
      readonly level?: CompetitionLevel;
      readonly division?: number;
    };
  } | null;
  /** Badges after the team's, such as a player's position. */
  readonly extraBadges?: ReactNode;
  /** A line under the badges, such as the link to a player's team. */
  readonly subtitle?: ReactNode;
  /**
   * Trailing visual, from `sm` up only: on a phone it would take a third of
   * the row from the title and badges.
   */
  readonly aside?: ReactNode;
  /** A band of figures under the identity, such as a player's age and size. */
  readonly stats?: readonly EntityHeaderStat[];
}

/**
 * The identity block at the top of a player or team page: a visual, the
 * name, the team's badges, a link to its pool's standings, and optionally a
 * band of figures.
 */
export function EntityHeader({
  visual,
  title,
  category,
  gender,
  pool,
  extraBadges,
  subtitle,
  aside,
  stats = [],
}: EntityHeaderProps) {
  const tCompetitions = useTranslations("competitions");

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex items-center gap-3 p-4 sm:gap-5 sm:p-6">
        {visual}

        <div className="flex-1 min-w-0">
          <Text variant="h1" className="mb-3">
            {title}
          </Text>

          <EntityHeaderBadges
            category={category}
            gender={gender}
            championship={pool?.championship}
          >
            {extraBadges}
          </EntityHeaderBadges>

          {subtitle && (
            <span className="block text-sm font-medium text-text-heading">
              {subtitle}
            </span>
          )}

          {pool && (
            <span
              className={cn(
                "block text-sm text-text-secondary",
                subtitle && "mt-1",
              )}
            >
              <TextLink
                href={`/championships/${pool.championship.id}?pool=${pool.id}`}
                variant="plain"
              >
                {tCompetitions("poolStandings", { letter: pool.letter })}
              </TextLink>
            </span>
          )}
        </div>

        {aside && (
          <div className="hidden sm:flex flex-shrink-0 pl-5 border-l border-divide self-stretch items-center">
            {aside}
          </div>
        )}
      </div>

      {stats.length > 0 && (
        <div className="border-t border-divide">
          <StatGroup stats={stats} />
        </div>
      )}
    </Card>
  );
}

export default EntityHeader;
