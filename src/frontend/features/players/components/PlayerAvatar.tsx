// src/frontend/features/players/components/PlayerAvatar.tsx
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/shared/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export interface PlayerAvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  number?: number;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: {
    avatar: "w-9 h-9",
    initials: "text-xs",
    badge: "text-[10px] px-1 py-0.5",
  },
  md: {
    avatar: "w-14 h-14",
    initials: "text-base",
    badge: "text-[11px] px-1.5 py-0.5",
  },
  lg: {
    avatar: "w-20 h-20",
    initials: "text-xl",
    badge: "text-xs px-2 py-0.5",
  },
};

/**
 * PlayerAvatar — initials circle with an optional jersey number badge.
 *
 * @example
 * <PlayerAvatar name="Marcus Bell" number={5} />
 * <PlayerAvatar name="Jordan Lee" number={11} size="sm" />
 */
export const PlayerAvatar = forwardRef<HTMLDivElement, PlayerAvatarProps>(
  ({ name, number, size = "md", className, ...props }, ref) => {
    const config = sizeConfig[size];

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div
          className={cn(
            "rounded-full bg-primary-subtle flex items-center justify-center",
            config.avatar,
          )}
        >
          <span
            className={cn(
              "font-semibold text-primary-strong select-none",
              config.initials,
            )}
          >
            {getInitials(name)}
          </span>
        </div>
        {number !== undefined && (
          <span
            className={cn(
              "absolute -bottom-1 -right-1 bg-surface-raised border border-divide rounded-button font-semibold text-text-secondary leading-none",
              config.badge,
            )}
          >
            #{number}
          </span>
        )}
      </div>
    );
  },
);

PlayerAvatar.displayName = "PlayerAvatar";
