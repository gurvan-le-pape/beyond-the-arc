// src/frontend/features/organizations/clubs/components/clubs-map/side-panel/index.tsx
"use client";

import { useTranslations } from "next-intl";
import { memo, useCallback, useState } from "react";

import type { ClubBasic } from "../../../types/ClubBasic";
import { SearchBar } from "../SearchBar";
import type { ClubFilters } from "../useFilters";
import { ClubList } from "./ClubList";
import { MobileOverlay } from "./MobileOverlay";
import { SidePanelFilters } from "./SidePanelFilters";
import { SidePanelHeader } from "./SidePanelHeader";
import { SidePanelToggleButton } from "./SidePanelToggleButton";

interface SidePanelProps {
  clubs: ClubBasic[];
  filters: ClubFilters;
  onToggleFilter: (key: keyof ClubFilters) => void;
  onClubClick: (club: ClubBasic) => void;
  query: string;
  onQueryChange: (query: string) => void;
  onClearSearch: () => void;
  resultCount: number;
  isPending?: boolean;
}

/** Matches Tailwind's `lg`, the breakpoint where the mobile backdrop stops. */
const PANEL_OPEN_BY_DEFAULT_QUERY = "(min-width: 1024px)";

/**
 * Sliding side panel over the clubs map. Owns only its two UI toggles
 * (open/closed, filters expanded); all data arrives via props. Composes the
 * toggle button, header, search bar, filters accordion, club list, and the
 * mobile backdrop.
 */
export const SidePanel = memo(function SidePanel({
  clubs,
  filters,
  onToggleFilter,
  onClubClick,
  query,
  onQueryChange,
  onClearSearch,
  resultCount,
  isPending = false,
}: SidePanelProps) {
  const t = useTranslations("clubs");
  // Open on wide screens only. Below `lg` the panel covers the map (full width
  // under `sm`, behind a backdrop up to `lg`), so a phone landed on a list with
  // no map in sight. The map is client-only (`ssr: false`), so `window` exists
  // on the first render and there is no server markup to disagree with.
  const [isOpen, setIsOpen] = useState(
    () => window.matchMedia(PANEL_OPEN_BY_DEFAULT_QUERY).matches,
  );
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleToggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleToggleFilters = useCallback(() => {
    setFiltersExpanded((prev) => !prev);
  }, []);

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
        {isPending && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-solid-primary animate-pulse z-raised" />
        )}

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
                resultCount={resultCount}
                placeholder={t("map.searchPlaceholder")}
              />
            </div>

            <SidePanelFilters
              filters={filters}
              onToggleFilter={onToggleFilter}
              expanded={filtersExpanded}
              onToggleExpanded={handleToggleFilters}
              activeFilterCount={activeFilterCount}
            />

            <ClubList clubs={clubs} query={query} onClubClick={onClubClick} />
          </div>
        </div>
      </div>

      {/* Overlay (mobile only, when open) */}
      {isOpen && <MobileOverlay onClose={handleToggleOpen} />}
    </>
  );
});

export default SidePanel;
