// src/frontend/features/organizations/clubs/components/clubs-map/SearchBar.tsx
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Input } from "@/shared/components/forms";

interface SearchBarProps {
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
  readonly onClear: () => void;
}

/**
 * The club search at the top of the map's side panel.
 *
 * Fully controlled — matching is done by the map, which owns both the club list
 * and the camera. This reports the query; it filters nothing itself, and the
 * number of matches is shown by the panel header above it.
 *
 * Not debounced: it filters clubs already in memory, so there is no request to
 * spare. "/" focuses it from anywhere on the page, as the hint inside the empty
 * field says.
 */
export function SearchBar({ query, onQueryChange, onClear }: SearchBarProps) {
  const t = useTranslations("clubs");
  const tCommon = useTranslations("common");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Input
      ref={inputRef}
      variant="search"
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
      onClear={onClear}
      clearAriaLabel={tCommon("clearSearch")}
      aria-label={t("map.searchLabel")}
      placeholder={t("map.searchPlaceholder")}
      // The shortcut hint while the field is empty; once there is a query the
      // search variant puts its clear button in this slot instead.
      rightIcon={
        query ? undefined : (
          <kbd
            aria-hidden="true"
            className="pointer-events-none hidden sm:inline-block px-1.5 text-xs text-text-secondary border border-divide rounded-input"
          >
            /
          </kbd>
        )
      }
    />
  );
}
