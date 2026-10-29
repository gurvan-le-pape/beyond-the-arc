// src/frontend/features/organizations/clubs/components/map/clubs-map/side-panel/index.tsx
"use client";

import { memo, useCallback, useState } from "react";

import type { ClubBasic } from "../../../../types/ClubBasic";
import { SearchBar } from "../SearchBar";
import { ClubList } from "./ClubList";
import { MobileOverlay } from "./MobileOverlay";
import { SidePanelHeader } from "./SidePanelHeader";
import { SidePanelToggleButton } from "./SidePanelToggleButton";

/** Matches Tailwind's `lg`, the breakpoint where the mobile backdrop stops. */
const PANEL_OPEN_BY_DEFAULT_QUERY = "(min-width: 1024px)";

interface SidePanelProps {
  clubs: ClubBasic[];
  onClubClick: (club: ClubBasic) => void;
  query: string;
  onQueryChange: (query: string) => void;
  onClearSearch: () => void;
}

/**
 * Sliding side panel over the clubs map. Owns only its open/closed state; all
 * data arrives via props. Composes the toggle button, header, search bar, club
 * list, and the mobile backdrop.
 */
export const SidePanel = memo(function SidePanel({
  clubs,
  onClubClick,
  query,
  onQueryChange,
  onClearSearch,
}: SidePanelProps) {
  // Open on wide screens only. Below `lg` the panel covers the map (full width
  // under `sm`, behind a backdrop up to `lg`), so a phone landed on a list with
  // no map in sight. The map is client-only (`ssr: false`), so `window` exists
  // on the first render and there is no server markup to disagree with.
  const [isOpen, setIsOpen] = useState(
    () => window.matchMedia(PANEL_OPEN_BY_DEFAULT_QUERY).matches,
  );

  const handleToggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Below `lg` the panel hides the map, so a pick that opened the club's popup
  // behind it would show nothing. Close it to reveal the club on the map.
  const handleClubClick = useCallback(
    (club: ClubBasic) => {
      if (!window.matchMedia(PANEL_OPEN_BY_DEFAULT_QUERY).matches) {
        setIsOpen(false);
      }
      onClubClick(club);
    },
    [onClubClick],
  );

  return (
    <>
      {/* Toggle button when closed - separate from panel */}
      {!isOpen && <SidePanelToggleButton onOpen={handleToggleOpen} />}

      <div
        className="fixed top-16 right-0 h-[calc(100vh-4rem)] surface-subtle shadow-2xl z-drawer w-full sm:w-96 transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex flex-col h-full">
          <SidePanelHeader
            clubCount={clubs.length}
            onClose={handleToggleOpen}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-divide flex-shrink-0">
              <SearchBar
                query={query}
                onQueryChange={onQueryChange}
                onClear={onClearSearch}
              />
            </div>

            <ClubList
              clubs={clubs}
              query={query}
              onClubClick={handleClubClick}
            />
          </div>
        </div>
      </div>

      {/* Overlay (mobile only, when open) */}
      {isOpen && <MobileOverlay onClose={handleToggleOpen} />}
    </>
  );
});
