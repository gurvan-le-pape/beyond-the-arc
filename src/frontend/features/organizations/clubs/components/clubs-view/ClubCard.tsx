// src/frontend/features/organizations/clubs/components/clubs-view/ClubCard.tsx
import { ClubMark } from "@/shared/components/domain";
import { Badge, Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { cn } from "@/shared/utils";

import type { ClubBasic } from "../../types/ClubBasic";

interface ClubCardProps {
  readonly club: ClubBasic;
}

/**
 * A club as a card in the list.
 *
 * The committee and its league are optional-chained throughout, since the list
 * response does not always carry them; a club missing either renders without
 * the location line rather than failing.
 */
export function ClubCard({ club }: ClubCardProps) {
  return (
    <Card
      padding="none"
      href={`/organizations/clubs/${club.id}`}
      className={cn(
        "group relative overflow-hidden",
        "border-line-clubs hover:border-solid-clubs",
        "flex",
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-20 flex items-center justify-center",
          "bg-gradient-to-br from-[var(--surface-inset)] to-[var(--surface-bg)]",
          "border-r border-white/5",
        )}
      >
        <ClubMark clubName={club.name} size="lg" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        {(club.city || club.zipCode) && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 bg-tint-clubs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full flex-shrink-0 bg-solid-clubs" />
              {club.city && (
                <Text
                  variant="label"
                  className="font-medium text-ink-clubs truncate"
                >
                  {club.city}
                </Text>
              )}
            </div>
            {club.zipCode && (
              <Badge variant="info" size="sm" className="flex-shrink-0">
                {club.zipCode}
              </Badge>
            )}
          </div>
        )}

        <div className="px-4 py-3 flex items-center flex-1">
          <Text
            variant="h3"
            className="leading-snug line-clamp-2 text-base md:text-lg group-hover:text-ink-primary transition-colors duration-200"
          >
            {club.name}
          </Text>
        </div>
      </div>
    </Card>
  );
}
