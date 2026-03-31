// src/frontend/shared/components/primitives/SearchableDropdown.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

import { Text } from "../typography";

interface Option {
  value: string | number;
  label: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string | number | undefined;
  onChange: (value: string | number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  testId?: string;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  className = "",
  testId,
}) => {
  const t = useTranslations("common");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search
  const filteredOptions = search
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search when closed
  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      data-testid={testId}
    >
      {/* Trigger button */}
      <button
        type="button"
        className="w-full px-4 py-2 border border-divide-light dark:border-divide-dark rounded-button bg-white dark:bg-surface-raised-dark text-left focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-text-heading dark:text-text-heading-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between gap-2"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
      >
        <span className="truncate">
          {selectedOption ? (
            selectedOption.label
          ) : (
            <Text variant="muted" as="span">
              {placeholder || t("table.filterName")}
            </Text>
          )}
        </span>
        <svg
          className={`w-3.5 h-3.5 flex-shrink-0 text-text-muted dark:text-text-muted-dark transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-surface-raised-dark border border-divide-light dark:border-divide-dark rounded-button shadow-card-hover overflow-hidden">
          {/* Search input */}
          <input
            type="text"
            className="w-full px-3 py-2 border-b border-divide-light dark:border-divide-dark bg-white dark:bg-surface-raised-dark text-text-heading dark:text-text-heading-dark placeholder:text-text-muted dark:placeholder:text-text-muted-dark focus:outline-none text-sm"
            placeholder={t("table.filter")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />

          {/* Options list */}
          <ul className="max-h-60 overflow-y-auto scrollbar-hide py-1">
            {filteredOptions.length === 0 && (
              <li className="px-4 py-2 text-sm text-text-muted dark:text-text-muted-dark">
                {t("empty")}
              </li>
            )}
            {filteredOptions.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                    value === opt.value
                      ? "bg-primary-50 dark:bg-primary-900/30 font-semibold text-primary-700 dark:text-primary-300"
                      : "text-text-heading dark:text-text-heading-dark hover:bg-surface-subtle dark:hover:bg-surface-subtle-dark hover:text-primary-700 dark:hover:text-primary-400"
                  }`}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
