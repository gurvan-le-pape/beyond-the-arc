// src/frontend/features/players/components/detail/player-comparison/PlayerIdentity.tsx
import { Text } from "@/shared/components/typography";
import { cn } from "@/shared/utils";

import type { Player } from "../../../types/Player";

interface PlayerIdentityProps {
  readonly player: Player;
  readonly side?: "left" | "right";
  readonly className?: string;
}

/**
 * Displays a player's ghost jersey number, name, and club.
 * The ghost number stroke colour flips between primary (left) and secondary (right).
 */
export function PlayerIdentity({
  player,
  side = "left",
  className,
}: PlayerIdentityProps) {
  const isRight = side === "right";

  return (
    <div
      className={cn(
        "flex flex-col",
        isRight ? "items-end text-right" : "items-start text-left",
        className,
      )}
    >
      <span
        className={cn(
          "text-7xl font-black leading-none select-none pointer-events-none opacity-35 text-transparent",
          isRight ? "text-stroke-away" : "text-stroke-home",
        )}
      >
        #{player.number}
      </span>

      <Text variant="h4" as="span" className="-mt-2 relative z-10">
        {player.name}
      </Text>

      {player.team?.club?.name && (
        <Text variant="caption" as="span" className="mt-0.5">
          {player.team.club.name}
        </Text>
      )}
    </div>
  );
}
