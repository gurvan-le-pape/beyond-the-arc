// src/frontend/features/organizations/clubs/components/clubs-map/side-panel/ClubListItem.tsx
"use client";

import { memo, useCallback } from "react";

import { Text } from "@/shared/components/typography";

import type { ClubBasic } from "../../../types/ClubBasic";

interface ClubListItemProps {
  readonly club: ClubBasic;
  readonly onClick: (club: ClubBasic) => void;
}

/** A single club row in the side panel list, with contact-availability icons. */
export const ClubListItem = memo(function ClubListItem({
  club,
  onClick,
}: ClubListItemProps) {
  const handleClick = useCallback(() => {
    onClick(club);
  }, [club, onClick]);

  return (
    <button
      onClick={handleClick}
      className="w-full text-left p-4 hover:bg-surface-inset transition-colors group"
      style={{ contain: "layout style paint" }}
    >
      <Text variant="h3" className="mb-1 truncate group-hover:text-primary">
        {club.name}
      </Text>
      {(club.city || club.zipCode) && (
        <Text variant="caption" className="truncate">
          {club.city}
          {club.city && club.zipCode && " • "}
          {club.zipCode}
        </Text>
      )}
      <div className="flex items-center gap-3 mt-2">
        {club.website && (
          <svg
            className="w-4 h-4 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        )}
        {club.email && (
          <svg
            className="w-4 h-4 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        )}
        {club.phone && (
          <svg
            className="w-4 h-4 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        )}
      </div>
    </button>
  );
});

export default ClubListItem;
