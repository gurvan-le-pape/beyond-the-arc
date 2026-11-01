// src/frontend/shared/components/forms/DebouncedSearchInput.tsx
"use client";

import { useEffect, useRef, useState } from "react";

import {
  SearchInput,
  type SearchInputName,
  type SearchInputProps,
} from "./SearchInput";

export type DebouncedSearchInputProps = SearchInputName &
  Omit<SearchInputProps, "value" | "onChange" | keyof SearchInputName> & {
    readonly value: string;
    /** The text, once typing has settled for `debounceMs` (400 by default). */
    readonly onChange: (value: string) => void;
    readonly debounceMs?: number;
  };

/**
 * A `SearchInput` that reports its text only once typing settles, for a search
 * that sends a request.
 *
 * Changing `value` from outside **cancels any pending callback**. That is what
 * makes a "reset all" hold: without it the timer armed a moment earlier would
 * still fire and re-apply the filter the user had just cleared.
 *
 * Clearing, by the button or Escape, reports `""` at once, so it feels instant
 * while typing stays cheap.
 */
export function DebouncedSearchInput({
  value: externalValue,
  onChange,
  onClear,
  debounceMs = 400,
  ...props
}: DebouncedSearchInputProps) {
  const [localValue, setLocalValue] = useState(externalValue);
  const [lastExternalValue, setLastExternalValue] = useState(externalValue);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Adjusted during render rather than in an effect, which would render once
  // with the stale text first.
  if (externalValue !== lastExternalValue) {
    setLastExternalValue(externalValue);
    setLocalValue(externalValue);
    clearTimeout(timeoutRef.current);
  }

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleChange = (value: string) => {
    setLocalValue(value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onChange(value), debounceMs);
  };

  // React Aria reports the emptied text through onChange first, which arms the
  // timer; clearing cancels it and reports at once.
  const handleClear = () => {
    clearTimeout(timeoutRef.current);
    onChange("");
    onClear?.();
  };

  return (
    <SearchInput
      {...props}
      value={localValue}
      onChange={handleChange}
      onClear={handleClear}
    />
  );
}
