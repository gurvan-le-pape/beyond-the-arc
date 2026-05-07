// src/frontend/features/organizations/clubs/components/map/SearchBar.tsx
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Text } from "@/shared/components/typography";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  resultCount?: number;
}

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

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        {/* Search Icon */}
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

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2.5 bg-surface-inset border border-divide rounded-lg text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 ring-offset-surface focus:border-transparent transition-all"
        />

        {/* Result Count & Clear Button */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && resultCount !== undefined && (
            <Text
              variant="muted"
              as="span"
              className="bg-surface-inset px-2 py-1 rounded"
            >
              {resultCount}
            </Text>
          )}

          {query && (
            <button
              onClick={onClear}
              className="p-1.5 hover:bg-surface-inset rounded-full transition-colors"
              aria-label={t("map.clearSearch")}
            >
              <svg
                className="w-4 h-4 text-text-secondary"
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
          )}
        </div>
      </div>

      {/* Keyboard hint */}
      {!query && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs text-text-muted bg-surface-inset border border-divide rounded">
            /
          </kbd>
        </div>
      )}
    </div>
  );
}
