// src/frontend/features/teams/components/detail/team-roster/PlayerCard.tsx
import { useTranslations } from "next-intl";

import { PlayerAvatar } from "@/features/players/components";
import type { TeamPlayerRef } from "@/features/teams/types";
import { Badge, Card, StatPill } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { positionVariant } from "@/shared/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PlayerCardProps {
  readonly player: TeamPlayerRef;
  /** Where the card goes. The whole card is the link. */
  readonly href: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * PlayerCard — roster card for a single player. Per-game averages come
 * precomputed from the backend (`team.players[].seasonStats`); we only format
 * them to one decimal for display.
 */
export function PlayerCard({ player, href }: PlayerCardProps) {
  const tCommon = useTranslations("common");
  const { seasonStats } = player;

  return (
    <Card
      href={href}
      variant="default"
      padding="sm"
      className="flex flex-col items-center gap-3 text-center hover:border-solid-primary transition-colors duration-200"
    >
      <PlayerAvatar
        name={player.name}
        number={player.number}
        className="mb-1"
      />

      <div className="flex flex-col items-center gap-1.5 w-full">
        <Text
          variant="body"
          className="font-semibold text-text-heading leading-tight"
        >
          {player.name}
        </Text>
        <Badge variant={positionVariant(player.position)} size="sm">
          {player.position}
        </Badge>
      </div>

      <div className="w-full border-t border-divide pt-3 flex items-center justify-around">
        <StatPill
          label={tCommon("stats.points.abbr")}
          value={seasonStats.pointsPerGame.toFixed(1)}
        />
        <div className="w-px h-6 bg-divide" />
        <StatPill
          label={tCommon("stats.rebounds.abbr")}
          value={seasonStats.reboundsPerGame.toFixed(1)}
        />
        <div className="w-px h-6 bg-divide" />
        <StatPill
          label={tCommon("stats.assists.abbr")}
          value={seasonStats.assistsPerGame.toFixed(1)}
        />
      </div>

      <Text variant="caption" className="-mt-1">
        {seasonStats.gamesPlayed} {tCommon("stats.gamesPlayedShort")}
      </Text>
    </Card>
  );
}
