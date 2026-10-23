// src/frontend/features/organizations/clubs/components/clubs-map/SearchBar.tsx
"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { IconButton } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface SearchBarProps {
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
  readonly onClear: () => void;
  readonly placeholder?: string;
  readonly resultCount?: number;
}

/**
 * The club search overlaid on the map.
 *
 * Fully controlled — matching is done by the map, which owns both the club list
 * and the camera. This reports the query and renders the result count it is
 * given; it filters nothing itself.
 */
export function SearchBar({
  query,
  onQueryChange,
  onClear,
  placeholder,
  resultCount,
}: SearchBarProps) {
  const t = useTranslations("clubs");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on "/" key
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
    <div className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2.5 bg-surface-inset border border-divide rounded-lg text-text-heading placeholder:text-text-secondary focus-ring focus:border-transparent transition-all"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && resultCount !== undefined && (
            <Text
              variant="caption"
              as="span"
              className="bg-surface-inset px-2 py-1 rounded"
            >
              {resultCount}
            </Text>
          )}

          {query && (
            <IconButton
              size="sm"
              shape="circle"
              onClick={onClear}
              label={t("map.clearSearch")}
            >
              <X />
            </IconButton>
          )}
        </div>
      </div>

      {!query && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs text-text-secondary bg-surface-inset border border-divide rounded">
            /
          </kbd>
        </div>
      )}
    </div>
  );
}
