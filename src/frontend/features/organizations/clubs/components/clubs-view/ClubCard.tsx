// src/frontend/features/organizations/clubs/components/clubs-view/ClubCard.tsx
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

import type { ClubBasic } from "../../types/ClubBasic";

interface ClubCardProps {
  readonly club: ClubBasic;
}

/**
 * A club as a card in the list: its name, then its city and postcode.
 *
 * City and postcode are each optional in the list response; the second line
 * shows whichever is present and is left out when neither is.
 */
export function ClubCard({ club }: ClubCardProps) {
  const place = [club.city, club.zipCode].filter(Boolean).join(" · ");

  return (
    <Card
      padding="none"
      href={`/organizations/clubs/${club.id}`}
      className="group px-4 py-3 border-line-clubs hover:border-solid-clubs"
    >
      <Text
        variant="h3"
        as="h2"
        className="leading-snug line-clamp-2 text-base md:text-lg group-hover:text-ink-primary transition-colors duration-200"
      >
        {club.name}
      </Text>
      {place && (
        <Text variant="caption" className="mt-0.5 truncate">
          {place}
        </Text>
      )}
    </Card>
  );
}
