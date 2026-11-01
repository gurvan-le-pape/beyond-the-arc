// src/frontend/shared/components/forms/SearchInput.tsx
"use client";

import { useTranslations } from "next-intl";
import type { ReactNode, Ref } from "react";
import {
  Button,
  Input as AriaInput,
  Label,
  SearchField,
} from "react-aria-components";

import { cn } from "@/shared/utils";

import { FIELD_ICON, FIELD_INPUT, FIELD_LABEL } from "./fieldStyles";

/** A search box is named by a visible label, or failing that an `aria-label`. */
export type SearchInputName =
  | { readonly label: string; readonly "aria-label"?: never }
  | { readonly label?: never; readonly "aria-label": string };

interface SearchInputFields {
  /** Controlled text; leave it out for a field a `<form>` submits by `name`. */
  readonly value?: string;
  readonly onChange?: (value: string) => void;
  /** After the clear button or Escape has emptied the field. */
  readonly onClear?: () => void;
  readonly placeholder?: string;
  readonly name?: string;
  readonly required?: boolean;
  /** `lg` for a search that leads the page, such as the home page's. */
  readonly size?: "md" | "lg";
  /**
   * At the end of the field while it is empty, where the clear button sits
   * once there is text: a keyboard shortcut's hint. Mark it `aria-hidden`.
   */
  readonly emptyHint?: ReactNode;
  readonly ref?: Ref<HTMLInputElement>;
}

function SearchIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export type SearchInputProps = SearchInputName & SearchInputFields;

/**
 * A search box, on React Aria's SearchField: a search icon, and a clear button
 * once there is text. Escape clears too, which is why React Aria leaves the
 * clear button out of the tab order.
 *
 * `onChange` receives the string. For a search that sends a request, use
 * `DebouncedSearchInput`.
 *
 * @example
 * <SearchInput aria-label="Search clubs" value={query} onChange={setQuery} placeholder="Club or city" />
 */
export function SearchInput({
  label,
  "aria-label": ariaLabel,
  value,
  onChange,
  onClear,
  placeholder,
  name,
  required,
  size = "md",
  emptyHint,
  ref,
}: SearchInputProps) {
  const t = useTranslations("common");

  return (
    <SearchField
      aria-label={ariaLabel}
      value={value}
      onChange={onChange}
      onClear={onClear}
      name={name}
      isRequired={required}
      className="group w-full"
    >
      {label && <Label className={FIELD_LABEL}>{label}</Label>}
      <div className="relative">
        <div className={FIELD_ICON}>
          <SearchIcon />
        </div>
        <AriaInput
          ref={ref}
          placeholder={placeholder}
          className={cn(
            FIELD_INPUT,
            "pl-10 pr-10 [&::-webkit-search-cancel-button]:appearance-none",
            !emptyHint && "group-data-[empty]:pr-4",
            size === "lg" && "h-12 text-base",
          )}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted">
          <Button
            aria-label={t("clearSearch")}
            className="cursor-pointer rounded-sm transition-colors hover:text-text-body group-data-[empty]:hidden"
          >
            <ClearIcon />
          </Button>
          {emptyHint && (
            <span className="hidden group-data-[empty]:inline-flex">
              {emptyHint}
            </span>
          )}
        </div>
      </div>
    </SearchField>
  );
}
