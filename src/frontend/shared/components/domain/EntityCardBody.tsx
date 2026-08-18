// src/frontend/shared/components/domain/EntityCardBody.tsx
import { Text } from "@/shared/components/typography";
import type { CompetitionLevel } from "@/shared/constants";
import { cn } from "@/shared/utils";

import { ClubLogo } from "./ClubLogo";
import { getLevelConfig } from "./ListEntityCard";

interface EntityCardCommittee {
  name: string;
  league?: { name: string } | null;
}

interface EntityCardBodyProps {
  /** Club name used to resolve the logo. */
  readonly clubName: string | null | undefined;
  /** Primary line (club name for teams, player name for players). */
  readonly title: string;
  readonly committee?: EntityCardCommittee | null;
  /** Jersey / team number, shown inline and in the side block. */
  readonly number?: number | null;
  /** Competition level, for the side block tint. */
  readonly level: CompetitionLevel | undefined;
}

/**
 * The single-entity body of the teams and players list cards: logo, identity
 * (title + number + committee/league), and the tinted number block.
 */
export function EntityCardBody({
  clubName,
  title,
  committee,
  number,
  level,
}: EntityCardBodyProps) {
  const config = getLevelConfig(level);

  return (
    <div className="px-5 py-4 flex flex-col sm:flex-row gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <ClubLogo clubName={clubName} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <p className="text-lg font-bold text-text-heading truncate">
              {title}
            </p>

            {!!number && (
              <span className="text-sm font-semibold text-text-secondary">
                #{number}
              </span>
            )}
          </div>

          {committee && (
            <div className="mt-1 flex flex-col">
              {committee.league && (
                <Text variant="caption" as="p" className="truncate">
                  {committee.league.name}
                </Text>
              )}

              <Text
                variant="caption"
                as="p"
                className="truncate text-text-secondary"
              >
                {committee.name}
              </Text>
            </div>
          )}
        </div>
      </div>

      {!!number && (
        <div
          className={cn(
            "hidden sm:flex flex-shrink-0",
            "items-center justify-center",
            "w-12 h-12 rounded-card border",
            "font-black text-lg tracking-tight",
            config.bg,
            config.border,
            "text-text-heading",
          )}
        >
          {number}
        </div>
      )}
    </div>
  );
}

export default EntityCardBody;
