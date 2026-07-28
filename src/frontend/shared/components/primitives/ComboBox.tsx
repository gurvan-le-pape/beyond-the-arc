// src/frontend/shared/components/primitives/ComboBox.tsx
//
// ComboBox — single-value picker, optionally searchable.
//
// searchable=true  (default) — shows a filter input in the popover.
//                              Use for long/dynamic lists (clubs, players…).
// searchable=false            — no filter input, pure custom dropdown.
//                              Use via <Select> for short static lists.
"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/shared/utils";

import { Text } from "../typography";
import { DROPDOWN_TRIGGER_BASE } from "./DropdownTriggerBase";
import { SelectChevron } from "./SelectChevron";

export interface ComboBoxOption {
  value: string | number;
  label: string;
}

export interface ComboBoxProps {
  options?: ComboBoxOption[];
  value: string | number | undefined;
  onChange: (value: string | number | undefined) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  testId?: string;
  /** Show a search/filter input inside the popover. Default: true. */
  searchable?: boolean;
  /** Provide to handle search externally (e.g. server-side). */
  onSearchChange?: (value: string) => void;
  isLoading?: boolean;
  error?: string;
  helperText?: string;
}

function getFilteredOptions(
  options: ComboBoxOption[],
  search: string,
  searchable: boolean,
  onSearchChange: ((value: string) => void) | undefined,
): ComboBoxOption[] {
  if (!searchable || onSearchChange) return options;
  if (search)
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()),
    );
  return options;
}

/**
 * ComboBox — single-value picker with optional search.
 *
 * @example
 * // Searchable (default) — long/dynamic lists
 * <ComboBox options={clubOptions} value={clubId} onChange={setClubId} />
 *
 * // Not searchable — short static lists (used internally by Select)
 * <ComboBox searchable={false} options={categoryOptions} value={category} onChange={setCategory} />
 */
export const ComboBox: React.FC<ComboBoxProps> = ({
  options = [],
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  className,
  testId,
  searchable = true,
  onSearchChange,
  isLoading = false,
  error,
  helperText,
}) => {
  const t = useTranslations("common");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();

  const inputId = label
    ? `combobox-${label.toLowerCase().replaceAll(/\s+/g, "-")}`
    : `combobox-${generatedId}`;

  const filteredOptions = getFilteredOptions(
    options,
    search,
    searchable,
    onSearchChange,
  );

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
    if (open && searchable) {
      searchRef.current?.focus();
    }
    if (!open) {
      setSearch("");
      onSearchChange?.("");
    }
  }, [open, searchable, onSearchChange]);

  const selectedOption = options.find((opt) => opt.value === value);

  const renderOptions = () => {
    if (isLoading) {
      return (
        <li className="px-4 py-2 text-sm text-text-secondary">{t("loading")}</li>
      );
    }

    if (filteredOptions.length === 0) {
      return (
        <li className="px-4 py-2 text-sm text-text-secondary">{t("empty")}</li>
      );
    }

    return filteredOptions.map((opt) => (
      <li key={opt.value}>
        <button
          type="button"
          className={cn(
            "w-full text-left px-4 py-2 text-sm transition-colors duration-150",
            value === opt.value
              ? "bg-primary-subtle font-semibold text-primary-strong border-l-2 border-primary"
              : "text-text-heading hover:bg-primary-subtle hover:text-primary-strong",
          )}
          onClick={() => {
            onChange(opt.value);
            setOpen(false);
          }}
          aria-current={value === opt.value ? "true" : undefined}
        >
          {opt.label}
        </button>
      </li>
    ));
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", !className && "w-full", className)}
      data-testid={testId}
    >
      {label && (
        <Text
          variant="label"
          as="label"
          htmlFor={inputId}
          className="mb-2 block"
        >
          {label}
        </Text>
      )}

      <div className="relative">
        <button
          id={inputId}
          type="button"
          className={cn(
            DROPDOWN_TRIGGER_BASE,
            "text-left",
            selectedOption && value !== "" && "border-primary",
            error && "border-error focus:ring-error focus:border-error",
          )}
          onClick={() => setOpen((o) => !o)}
          disabled={disabled}
          aria-describedby={error ? `${inputId}-error` : undefined}
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={`${inputId}-listbox`}
        >
          <span className="truncate block">
            {selectedOption ? (
              selectedOption.label
            ) : (
              <span className="text-text-secondary">
                {placeholder || t("table.filterName")}
              </span>
            )}
          </span>
        </button>

        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <SelectChevron open={open} />
        </span>
      </div>

      {/* Popover — always mounted, toggled via opacity/scale */}
      <div
        id={`${inputId}-listbox`}
        className={cn(
          "absolute z-10 mt-1 w-full",
          "surface-raised",
          "border border-divide",
          "rounded-input shadow-card-hover overflow-hidden",
          "transition-all duration-150 origin-top",
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none",
        )}
      >
        {searchable && (
          <input
            ref={searchRef}
            type="text"
            className="w-full px-3 py-2 border-b border-divide bg-surface-inset text-text-heading placeholder:text-text-secondary focus:outline-none text-sm"
            placeholder={t("table.filter")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearchChange?.(e.target.value);
            }}
          />
        )}

        <ul className="max-h-60 overflow-y-auto scrollbar-hide py-1">
          {renderOptions()}
        </ul>
      </div>

      {error && (
        <Text
          variant="caption"
          as="p"
          id={`${inputId}-error`}
          className="mt-2 text-error"
          role="alert"
        >
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text variant="caption" as="p" className="mt-2">
          {helperText}
        </Text>
      )}
    </div>
  );
};

export default ComboBox;
