// src/frontend/shared/components/entity/table/SearchableDropdown.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

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
      <button
        type="button"
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-left focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-gray-100"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
      >
        {selectedOption ? (
          selectedOption.label
        ) : (
          <span className="text-gray-400 dark:text-gray-400">
            {placeholder || t("table.filterName")}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
          <input
            type="text"
            className="w-full px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
            placeholder={t("table.filter")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 && (
              <li className="px-4 py-2 text-gray-400 dark:text-gray-400">
                {t("empty")}
              </li>
            )}
            {filteredOptions.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-blue-400 ${
                    value === opt.value
                      ? "bg-blue-100 dark:bg-blue-900 font-bold text-blue-700 dark:text-blue-400"
                      : "text-gray-900 dark:text-gray-100"
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
