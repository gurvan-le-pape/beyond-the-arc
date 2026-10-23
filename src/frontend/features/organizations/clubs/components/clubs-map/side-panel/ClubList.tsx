// src/frontend/features/organizations/clubs/components/clubs-map/side-panel/ClubList.tsx
"use client";

import { List } from "@/shared/components/primitives";

import type { ClubBasic } from "../../../types/ClubBasic";
import { ClubListItem } from "./ClubListItem";
import { PanelEmptyState } from "./PanelEmptyState";

interface ClubListProps {
  readonly clubs: ClubBasic[];
  readonly query: string;
  readonly onClubClick: (club: ClubBasic) => void;
}

/** Scrollable club list in the side panel — empty state or the club rows. */
export function ClubList({ clubs, query, onClubClick }: ClubListProps) {
  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{
        contain: "layout style paint",
        contentVisibility: "auto",
      }}
    >
      {clubs.length === 0 ? (
        <PanelEmptyState query={query} />
      ) : (
        <List>
          {clubs.map((club) => (
            <ClubListItem key={club.id} club={club} onClick={onClubClick} />
          ))}
        </List>
      )}
    </div>
  );
}

export default ClubList;
