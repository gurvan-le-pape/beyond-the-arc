// src/frontend/features/organizations/clubs/components/map/clubs-map/side-panel/ClubListItem.tsx
"use client";

import { memo, useCallback } from "react";

import { ListItem } from "@/shared/components/primitives";

import type { ClubBasic } from "../../../../types/ClubBasic";

interface ClubListItemProps {
  readonly club: ClubBasic;
  readonly onClick: (club: ClubBasic) => void;
}

/** A single club row in the side panel list. */
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
    />
  );
});
