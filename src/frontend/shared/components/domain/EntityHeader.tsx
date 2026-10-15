// src/frontend/shared/components/domain/EntityHeader.tsx
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Card, TextLink } from "@/shared/components/primitives";
import { StatCell } from "@/shared/components/stats";
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
  readonly championship?: {
    readonly id: number;
    readonly level?: CompetitionLevel;
    readonly division?: number;
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
 * name, the team's badges, a link into its championship, and optionally a
 * band of figures.
 *
 * The border is the team's gender colour, a two-way split: anything that is
 * not `"female"`, a missing value included, takes the male border.
 */
export function EntityHeader({
  visual,
  title,
  category,
  gender,
  championship,
  extraBadges,
  subtitle,
  aside,
  stats = [],
}: EntityHeaderProps) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const isFemale = gender?.toLowerCase() === "female";

  return (
    <Card
      padding="none"
      className={cn(
        "overflow-hidden border-2",
        isFemale ? "border-solid-female" : "border-solid-male",
      )}
    >
      <div className="flex items-center gap-3 p-4 sm:gap-5 sm:p-6">
        {visual}

        <div className="flex-1 min-w-0">
          <Text variant="h1" className="mb-3">
            {title}
          </Text>

          <EntityHeaderBadges
            category={category}
            gender={gender}
            championship={championship}
          >
            {extraBadges}
          </EntityHeaderBadges>

          {subtitle && (
            <span className="block text-sm font-medium text-text-heading">
              {subtitle}
            </span>
          )}

          {championship && (
            <span
              className={cn(
                "block text-sm text-text-secondary",
                subtitle && "mt-1",
              )}
            >
              <TextLink
                href={`/championships/${championship.id}`}
                variant="plain"
                ariaLabel={tCommon("competition.seeCompetition")}
              >
                {tCompetitions("championship")}
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
        <div
          className="grid border-t border-divide"
          style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={i < stats.length - 1 ? "border-r border-divide" : ""}
            >
              <StatCell value={stat.value} label={stat.label} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default EntityHeader;
