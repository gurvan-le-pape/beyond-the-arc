// src/frontend/features/organizations/clubs/components/map/SidePanel.tsx
"use client";

import { useTranslations } from "next-intl";
import { memo, useCallback, useState } from "react";

import { Text } from "@/shared/components/typography";

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
          className="fixed top-20 right-4 z-20 p-3 bg-surface-raised dark:bg-surface-raised-dark rounded-lg shadow-lg hover:bg-surface-subtle dark:hover:bg-surface-subtle-dark transition-colors border border-divide-light dark:border-divide-dark"
          aria-label={t("map.openPanel")}
          title={t("map.openPanel")}
        >
          <svg
            className="w-6 h-6 text-text-body dark:text-text-body-dark"
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
        className="fixed top-16 right-0 h-[calc(100vh-4rem)] bg-surface-raised dark:bg-surface-raised-dark shadow-2xl z-20 w-full sm:w-96 transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Loading indicator */}
        {isPending && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500 animate-pulse z-10" />
        )}

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-divide-light dark:border-divide-dark bg-surface-subtle dark:bg-surface-subtle-dark flex-shrink-0">
            <div>
              <Text variant="h2" className="text-lg">
                {t("map.title")}
              </Text>
              <Text variant="caption">
                {clubs.length} {clubs.length !== 1 ? t("clubs") : t("club")}
              </Text>
            </div>
            <div className="flex items-center gap-1">
              {/* List view button */}
              <ListViewButton label={t("map.listView")} />
              {/* Close button */}
              <button
                onClick={handleToggleOpen}
                className="p-2 hover:bg-surface-subtle dark:hover:bg-surface-subtle-dark rounded-lg transition-colors"
                aria-label={t("map.closePanel")}
                title={t("map.closePanel")}
              >
                <svg
                  className="w-5 h-5 text-text-body dark:text-text-body-dark"
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
            <div className="p-4 border-b border-divide-light dark:border-divide-dark flex-shrink-0">
              <SearchBar
                query={query}
                onQueryChange={onQueryChange}
                onClear={onClearSearch}
                resultCount={resultCount}
                placeholder={t("map.searchPlaceholder")}
              />
            </div>

            {/* Filters Section */}
            <div className="border-b border-divide-light dark:border-divide-dark flex-shrink-0">
              <button
                onClick={handleToggleFilters}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-subtle dark:hover:bg-surface-subtle-dark transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-text-body dark:text-text-body-dark"
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
                  <span className="font-medium text-text-heading dark:text-text-heading-dark">
                    {t("map.filters")}
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-medium px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <svg
                  className={`w-5 h-5 text-text-muted dark:text-text-muted-dark transition-transform ${
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
                    label={t("map.filterWebsite")}
                    checked={filters.hasWebsite}
                    onChange={() => onToggleFilter("hasWebsite")}
                  />
                  <FilterCheckbox
                    label={t("map.filterEmail")}
                    checked={filters.hasEmail}
                    onChange={() => onToggleFilter("hasEmail")}
                  />
                  <FilterCheckbox
                    label={t("map.filterPhone")}
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
                    className="w-12 h-12 text-text-muted dark:text-text-muted-dark mb-3"
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
                  <Text variant="body" className="font-medium">
                    {query ? t("map.noResults") : t("map.noClubsFound")}
                  </Text>
                  <Text variant="caption" className="mt-1">
                    {query
                      ? t("map.tryAnotherSearch")
                      : t("map.zoomToSeeClubs")}
                  </Text>
                </div>
              ) : (
                <div className="divide-y divide-divide-light dark:divide-divide-dark">
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
        <button
          type="button"
          className="fixed inset-0 top-16 bg-black/50 z-10 lg:hidden w-full cursor-default"
          onClick={handleToggleOpen}
          aria-label={t("map.closeMenu")}
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
        className="w-4 h-4 text-primary-600 dark:text-primary-400 border-divide-light dark:border-divide-dark rounded focus:ring-primary-500 dark:focus:ring-primary-400 bg-surface-raised dark:bg-surface-raised-dark"
      />
      <span className="text-sm text-text-emphasis dark:text-text-emphasis-dark group-hover:text-text-heading dark:group-hover:text-text-heading-dark">
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
      className="w-full text-left p-4 hover:bg-surface-subtle dark:hover:bg-surface-subtle-dark transition-colors group"
      style={{ contain: "layout style paint" }}
    >
      <Text
        variant="h3"
        className="mb-1 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400"
      >
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
            className="w-4 h-4 text-text-muted dark:text-text-muted-dark"
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
            className="w-4 h-4 text-text-muted dark:text-text-muted-dark"
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
            className="w-4 h-4 text-text-muted dark:text-text-muted-dark"
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
