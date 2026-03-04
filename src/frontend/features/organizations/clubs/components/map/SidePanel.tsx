// src/frontend/features/organizations/clubs/components/map/SidePanel.tsx
"use client";

import { useTranslations } from "next-intl";
import { memo, useCallback, useState } from "react";

import type { ClubFilters } from "../../hooks/useFilters";
import type { ClubBasic } from "../../types/ClubBasic";
import ListViewButton from "./ListViewButton";
import { SearchBar } from "./SearchBar";

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
  const [isOpen, setIsOpen] = useState(true);
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
      {!isOpen && (
        <button
          onClick={handleToggleOpen}
          className="fixed top-20 right-4 z-20 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
          aria-label="Ouvrir le panneau"
          title="Ouvrir le panneau"
        >
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Panel */}
      <div
        className="fixed top-16 right-0 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 shadow-2xl z-20 w-full sm:w-96 transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Loading indicator */}
        {isPending && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse z-10" />
        )}

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
            <div>
              <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                Clubs
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {clubs.length} club{clubs.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {/* List view button */}
              <ListViewButton label={t("map.listView")} />
              {/* Close button */}
              <button
                onClick={handleToggleOpen}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Réduire le panneau"
                title="Réduire le panneau"
              >
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <SearchBar
                query={query}
                onQueryChange={onQueryChange}
                onClear={onClearSearch}
                resultCount={resultCount}
              />
            </div>

            {/* Filters Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={handleToggleFilters}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Filtres
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${
                    filtersExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {filtersExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  <FilterCheckbox
                    label="Avec site web"
                    checked={filters.hasWebsite}
                    onChange={() => onToggleFilter("hasWebsite")}
                  />
                  <FilterCheckbox
                    label="Avec email"
                    checked={filters.hasEmail}
                    onChange={() => onToggleFilter("hasEmail")}
                  />
                  <FilterCheckbox
                    label="Avec téléphone"
                    checked={filters.hasPhone}
                    onChange={() => onToggleFilter("hasPhone")}
                  />
                </div>
              )}
            </div>

            {/* Club List */}
            <div
              className="flex-1 overflow-y-auto"
              style={{
                contain: "layout style paint",
                contentVisibility: "auto",
              }}
            >
              {clubs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <svg
                    className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    {query ? "Aucun résultat" : "Aucun club trouvé"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {query
                      ? "Essayez une autre recherche"
                      : "Zoomez sur la carte pour voir les clubs"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {clubs.map((club) => (
                    <ClubListItem
                      key={club.id}
                      club={club}
                      onClick={onClubClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay (mobile only, when open) */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/50 z-10 lg:hidden"
          onClick={handleToggleOpen}
        />
      )}
    </>
  );
});

const FilterCheckbox = memo(function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
      />
      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
        {label}
      </span>
    </label>
  );
});

const ClubListItem = memo(function ClubListItem({
  club,
  onClick,
}: {
  club: ClubBasic;
  onClick: (club: ClubBasic) => void;
}) {
  const handleClick = useCallback(() => {
    onClick(club);
  }, [club, onClick]);

  return (
    <button
      onClick={handleClick}
      className="w-full text-left p-4 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors group"
      style={{ contain: "layout style paint" }}
    >
      <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1 truncate">
        {club.name}
      </h3>
      {(club.city || club.zipCode) && (
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {club.city}
          {club.city && club.zipCode && " • "}
          {club.zipCode}
        </p>
      )}
      <div className="flex items-center gap-3 mt-2">
        {club.website && (
          <svg
            className="w-4 h-4 text-gray-400 dark:text-gray-500"
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
            className="w-4 h-4 text-gray-400 dark:text-gray-500"
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
            className="w-4 h-4 text-gray-400 dark:text-gray-500"
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
