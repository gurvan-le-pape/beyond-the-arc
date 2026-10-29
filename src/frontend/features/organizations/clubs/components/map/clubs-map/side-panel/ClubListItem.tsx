// src/frontend/features/organizations/clubs/components/map/clubs-map/side-panel/ClubListItem.tsx
"use client";

import { Globe } from "lucide-react";
import { memo, useCallback } from "react";

import { ListItem } from "@/shared/components/primitives";

import type { ClubBasic } from "../../../../types/ClubBasic";

interface ClubListItemProps {
  readonly club: ClubBasic;
  readonly onClick: (club: ClubBasic) => void;
}

/** A single club row in the side panel list, marked when the club has a website. */
export const ClubListItem = memo(function ClubListItem({
  club,
  onClick,
}: ClubListItemProps) {
  const handleClick = useCallback(() => {
    onClick(club);
  }, [club, onClick]);

  return (
    <ListItem
      onClick={handleClick}
      title={club.name}
      description={[club.city, club.zipCode].filter(Boolean).join(" • ")}
      trailing={
        club.website && (
          <Globe aria-hidden="true" className="h-4 w-4 text-text-muted" />
        )
      }
    />
  );
});
