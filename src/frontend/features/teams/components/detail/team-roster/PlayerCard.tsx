// src/frontend/features/teams/components/detail/team-roster/PlayerCard.tsx
import { useTranslations } from "next-intl";

import { PlayerAvatar } from "@/features/players/components";
import type { PlayerMatchHistoryEntry } from "@/features/players/types";
import { Badge, Card, StatPill } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { positionVariant } from "@/shared/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PlayerCardProps {
  readonly player: PlayerMatchHistoryEntry[];
  readonly stats: {
    gp: number;
    ppg: string;
    rpg: string;
    apg: string;
  };
  readonly onClick: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * PlayerCard — roster card for a single player.
 * Receives pre-computed stats from TeamRoster to avoid re-calculation.
 */
export function PlayerCard({ player, stats, onClick }: PlayerCardProps) {
  const tCommon = useTranslations("common");
  const info = player[0]?.player;

  if (!info) return null;

  return (
    <Card
      clickable
      variant="default"
      padding="sm"
      onClick={onClick}
      className="flex flex-col items-center gap-3 text-center hover:border-primary transition-colors duration-200"
    >
      <PlayerAvatar name={info.name} number={info.number} className="mb-1" />

      <div className="flex flex-col items-center gap-1.5 w-full">
        <Text
          variant="body"
          className="font-semibold text-text-heading leading-tight"
        >
          {info.name}
        </Text>
        <Badge variant={positionVariant(info.position)} size="sm">
          {info.position}
        </Badge>
      </div>

      <div className="w-full border-t border-divide pt-3 flex items-center justify-around">
        <StatPill label={tCommon("stats.points.abbr")} value={stats.ppg} />
        <div className="w-px h-6 bg-divide" />
        <StatPill label={tCommon("stats.rebounds.abbr")} value={stats.rpg} />
        <div className="w-px h-6 bg-divide" />
        <StatPill label={tCommon("stats.assists.abbr")} value={stats.apg} />
      </div>

      <Text variant="caption" className="text-text-muted -mt-1">
        {stats.gp} GP
      </Text>
    </Card>
  );
}
