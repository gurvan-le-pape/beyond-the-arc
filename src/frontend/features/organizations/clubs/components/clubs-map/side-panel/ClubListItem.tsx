// src/frontend/features/organizations/clubs/components/clubs-map/side-panel/ClubListItem.tsx
"use client";

import { memo, useCallback } from "react";

import { Text } from "@/shared/components/typography";

import type { ClubBasic } from "../../../types/ClubBasic";

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
    <button
      type="button"
      onClick={handleClick}
      className="w-full text-left p-4 hover:bg-surface-inset transition-colors group"
      style={{ contain: "layout style paint" }}
    >
      <Text variant="h3" className="mb-1 truncate group-hover:text-ink-primary">
        {club.name}
      </Text>
      {(club.city || club.zipCode) && (
        <Text variant="caption" className="truncate">
          {club.city}
          {club.city && club.zipCode && <span aria-hidden="true"> • </span>}
          {club.zipCode}
        </Text>
      )}
      {club.website && (
        <div className="flex items-center gap-3 mt-2">
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
        </div>
      )}
    </button>
  );
});

export default ClubListItem;
