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
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  testId?: string;
  onSearchChange?: (value: string) => void;
  isLoading?: boolean;
}

export const SelectChevron = ({
  open,
  className = "",
}: {
  open?: boolean;
  className?: string;
}) => (
  <svg
    className={`w-3.5 h-3.5 flex-shrink-0 text-text-muted dark:text-text-muted-dark transition-transform duration-200 ${
      open ? "rotate-180" : ""
    } ${className}`}
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
);

function getFilteredOptions(
  options: Option[],
  search: string,
  onSearchChange: ((value: string) => void) | undefined,
) {
  if (onSearchChange) return options;
  if (search)
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()),
    );
  return options;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  className = "",
  testId,
  onSearchChange,
  isLoading = false,
}) => {
  const t = useTranslations("common");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = getFilteredOptions(options, search, onSearchChange);

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

  useEffect(() => {
    if (!open) {
      setSearch("");
      onSearchChange?.("");
    }
  }, [open]);

  const selectedOption = options.find((opt) => opt.value === value);

  const renderOptions = () => {
    if (isLoading) {
      return (
        <li className="px-4 py-2 text-sm text-text-muted dark:text-text-muted-dark">
          {t("loading")}
        </li>
      );
    }
    if (filteredOptions.length === 0) {
      return (
        <li className="px-4 py-2 text-sm text-text-muted dark:text-text-muted-dark">
          {t("empty")}
        </li>
      );
    }
    return filteredOptions.map((opt) => (
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
    ));
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      data-testid={testId}
    >
      {label && (
        <Text variant="label" as="label" className="mb-2 block">
          {label}
        </Text>
      )}

      <div className="relative">
        <button
          type="button"
          className="w-full px-4 py-2.5 border border-divide-light dark:border-divide-dark rounded-input bg-surface-raised dark:bg-surface-raised-dark text-left focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 text-text-heading dark:text-text-heading-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 pr-9"
          onClick={() => setOpen((o) => !o)}
          disabled={disabled}
        >
          <span className="truncate block">
            {selectedOption ? (
              selectedOption.label
            ) : (
              <span className="text-text-muted dark:text-text-muted-dark">
                {placeholder || t("table.filterName")}
              </span>
            )}
          </span>
        </button>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <SelectChevron open={open} />
        </span>
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-surface-raised dark:bg-surface-raised-dark border border-divide-light dark:border-divide-dark rounded-input shadow-card-hover overflow-hidden">
          <input
            type="text"
            className="w-full px-3 py-2 border-b border-divide-light dark:border-divide-dark bg-surface-raised dark:bg-surface-raised-dark text-text-heading dark:text-text-heading-dark placeholder:text-text-muted dark:placeholder:text-text-muted-dark focus:outline-none text-sm"
            placeholder={t("table.filter")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearchChange?.(e.target.value);
            }}
            autoFocus
          />

          <ul className="max-h-60 overflow-y-auto scrollbar-hide py-1">
            {renderOptions()}
          </ul>
        </div>
      )}
    </div>
  );
};
