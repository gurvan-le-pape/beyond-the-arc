// src/frontend/shared/components/forms/DebouncedInput.tsx
"use client";

import { useEffect, useRef, useState } from "react";

import { Input, type InputProps } from "./Input";

export interface DebouncedInputProps extends Omit<InputProps, "onChange"> {
  onChange: (value: string) => void;
  debounceMs?: number;
}

/**
 * A text input that reports its value only once typing settles.
 *
 * **`onChange` receives the string, not the event**, and fires after
 * `debounceMs` (400 by default) — the one difference from `Input`, whose other
 * props all pass through.
 *
 * Changing `value` from outside **cancels any pending callback**. That is what
 * makes a "reset all" hold: without it the timer armed a moment earlier would
 * still fire and re-apply the filter the user had just cleared.
 *
 * Clearing is immediate and not debounced, so the clear button feels instant
 * while typing stays cheap.
 */
export const DebouncedInput = ({
  value: externalValue,
  onChange,
  debounceMs = 400,
  ref,
  ...props
}: DebouncedInputProps) => {
  const [localValue, setLocalValue] = useState(externalValue ?? "");
  const [lastExternalValue, setLastExternalValue] = useState(externalValue);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Adjust during render rather than in an effect. An effect that only sets
  // state from a prop is a computed value in disguise, and it also renders
  // once with the stale value first.
  //
  // Cancelling the pending timer here is the part that matters: without it,
  // "Reset all" blanked the box and the timer armed a moment earlier still
  // fired, calling onChange with the pre-reset text ~400 ms later — so the
  // filter the user had just cleared re-applied itself.
  if (externalValue !== lastExternalValue) {
    setLastExternalValue(externalValue);
    setLocalValue(externalValue ?? "");
    clearTimeout(timeoutRef.current);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onChange(newValue), debounceMs);
  };

  // When variant="search" and onClear is provided, clear both local state
  // and the external value immediately (no debounce on clear — it's instant).
  const handleClear = props.onClear
    ? () => {
        setLocalValue("");
        clearTimeout(timeoutRef.current);
        onChange("");
        props.onClear?.();
      }
    : undefined;

  return (
    <Input
      ref={ref}
      {...props}
      value={localValue}
      onChange={handleChange}
      onClear={handleClear}
    />
  );
};
