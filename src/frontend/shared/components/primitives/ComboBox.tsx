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
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/shared/utils";

import { Text } from "../typography";
import { DROPDOWN_TRIGGER_BASE } from "./dropdownTriggerBase";
import { Popover } from "./Popover";
import { SelectChevron } from "./SelectChevron";

export interface ComboBoxOption {
  value: string | number;
  label: string;
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
 * Whether `option` is the selected one. Compared as strings, as a native
 * `<select>` does: callers hold ids as numbers while building options from
 * `String(id)`, and a strict comparison then never matches, leaving the trigger
 * on its placeholder and no option selected.
 */
function isSelected(
  option: ComboBoxOption,
  value: string | number | undefined,
) {
  return value !== undefined && String(option.value) === String(value);
}

export interface ComboBoxProps {
  readonly options?: ComboBoxOption[];
  readonly value: string | number | undefined;
  readonly onChange: (value: string | number | undefined) => void;
  readonly label?: string;
  /**
   * Keep the label for screen readers but hide it visually, for a picker whose
   * purpose is plain from its surroundings. Default: false.
   */
  readonly hideLabel?: boolean;
  /**
   * Shown when no option matches `value` — while the options load, or for a
   * value that is not among them. Without one the trigger is blank, as a
   * native `<select>` is; there is no generic default, because no wording
   * fits every picker.
   */
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly testId?: string;
  /** Show a search/filter input inside the popover. Default: true. */
  readonly searchable?: boolean;
  /** Provide to handle search externally (e.g. server-side). */
  readonly onSearchChange?: (value: string) => void;
  readonly isLoading?: boolean;
  readonly error?: string;
  readonly helperText?: string;
}

/**
 * ComboBox — single-value picker with optional search.
 *
 * Follows the WAI-ARIA combobox pattern: the trigger is a `combobox` whose
 * accessible name is the label and whose value is the selected option, and the
 * popup is a `listbox` of `option`s with `aria-selected`. Focus never enters
 * the list — it stays on the trigger, or on the filter input when searchable —
 * and `aria-activedescendant` points at the highlighted option.
 *
 * Keyboard: ↓/↑/Enter/Space open; inside, ↓/↑ move, Home/End jump (not
 * searchable — in the filter input they move the caret), Enter (and Space when
 * not searchable) picks, Escape closes, Tab closes and moves on. Picking or
 * Escape returns focus to the trigger.
 *
 * Without a `label`, the trigger is named by its own value, which is what
 * screen readers announced before it was a combobox.
 *
 * @example
 * // Searchable (default) — long/dynamic lists
 * <ComboBox options={clubOptions} value={clubId} onChange={setClubId} />
 *
 * // Not searchable — short static lists (used internally by Select)
 * <ComboBox searchable={false} options={categoryOptions} value={category} onChange={setCategory} />
 */
export function ComboBox({
  options = [],
  value,
  onChange,
  label,
  hideLabel = false,
  placeholder,
  disabled = false,
  className,
  testId,
  searchable = true,
  onSearchChange,
  isLoading = false,
  error,
  helperText,
}: ComboBoxProps) {
  const t = useTranslations("common");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();

  // From useId, never from the label: the same labelled picker can be mounted
  // twice (one per breakpoint), and a label-derived id is then duplicated.
  const inputId = `combobox-${generatedId}`;
  const labelId = `${inputId}-label`;
  const valueId = `${inputId}-value`;
  const listboxId = `${inputId}-listbox`;
  const optionId = (index: number) => `${inputId}-option-${index}`;

  const filteredOptions = getFilteredOptions(
    options,
    search,
    searchable,
    onSearchChange,
  );
  const activeOption = isLoading ? undefined : filteredOptions[activeIndex];
  const activeDescendant =
    open && activeOption ? optionId(activeIndex) : undefined;

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

  useEffect(() => {
    if (activeDescendant) {
      document
        .getElementById(activeDescendant)
        ?.scrollIntoView({ block: "nearest" });
    }
  }, [activeDescendant]);

  const selectedOption = options.find((opt) => isSelected(opt, value));

  const openList = () => {
    const selectedIndex = filteredOptions.findIndex((opt) =>
      isSelected(opt, value),
    );
    setActiveIndex(Math.max(selectedIndex, 0));
    setOpen(true);
  };

  const close = (returnFocus: boolean) => {
    setOpen(false);
    setActiveIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  };

  const pick = (opt: ComboBoxOption) => {
    onChange(opt.value);
    close(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }

    const lastIndex = filteredOptions.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, lastIndex));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Home":
      case "End":
        if (searchable) break;
        event.preventDefault();
        setActiveIndex(event.key === "Home" ? 0 : lastIndex);
        break;
      case " ":
        if (searchable) break;
        event.preventDefault();
        if (activeOption) pick(activeOption);
        break;
      case "Enter":
        event.preventDefault();
        if (activeOption) pick(activeOption);
        break;
      case "Escape":
        event.preventDefault();
        close(true);
        break;
      case "Tab":
        close(false);
        break;
    }
  };

  const renderOptions = () => {
    if (isLoading) {
      return (
        <li
          role="option"
          aria-disabled="true"
          aria-selected="false"
          className="px-4 py-2 text-sm text-text-secondary"
        >
          {t("loading")}
        </li>
      );
    }

    if (filteredOptions.length === 0) {
      return (
        <li
          role="option"
          aria-disabled="true"
          aria-selected="false"
          className="px-4 py-2 text-sm text-text-secondary"
        >
          {t("empty")}
        </li>
      );
    }

    return filteredOptions.map((opt, index) => (
      // Keyboard interaction lives on the combobox, which owns focus;
      // an option only takes the pointer.
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <li
        key={opt.value}
        id={optionId(index)}
        role="option"
        aria-selected={isSelected(opt, value)}
        className={cn(
          "cursor-pointer px-4 py-2 text-sm transition-colors duration-150",
          isSelected(opt, value)
            ? "bg-tint-primary font-semibold text-ink-primary border-l-2 border-solid-primary"
            : "text-text-heading",
          index === activeIndex && "bg-tint-primary text-ink-primary",
        )}
        onClick={() => pick(opt)}
        onMouseMove={() => setActiveIndex(index)}
      >
        {opt.label}
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
          id={labelId}
          htmlFor={inputId}
          className={hideLabel ? "sr-only" : "mb-2 block"}
        >
          {label}
        </Text>
      )}

      <div className="relative">
        <button
          ref={triggerRef}
          id={inputId}
          type="button"
          role="combobox"
          className={cn(
            DROPDOWN_TRIGGER_BASE,
            "text-left",
            error && "border-solid-error focus-ring focus:border-solid-error",
          )}
          onClick={() => (open ? close(false) : openList())}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-labelledby={label ? labelId : valueId}
          aria-describedby={error ? `${inputId}-error` : undefined}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={searchable ? undefined : activeDescendant}
        >
          <span id={valueId} className="truncate block">
            {selectedOption
              ? selectedOption.label
              : placeholder && (
                  <span className="text-text-secondary">{placeholder}</span>
                )}
          </span>
        </button>

        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <SelectChevron open={open} />
        </span>
      </div>

      <Popover open={open} align="stretch">
        {searchable && (
          <input
            ref={searchRef}
            type="text"
            className="w-full px-3 py-2 border-b border-divide bg-surface-subtle text-text-heading placeholder:text-text-secondary text-sm focus-ring-inset"
            placeholder={t("table.filter")}
            aria-label={t("table.filter")}
            aria-controls={listboxId}
            aria-activedescendant={activeDescendant}
            aria-autocomplete="list"
            value={search}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveIndex(0);
              onSearchChange?.(e.target.value);
            }}
          />
        )}

        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={label ? labelId : valueId}
          className="max-h-60 overflow-y-auto scrollbar-hide py-1"
        >
          {renderOptions()}
        </ul>
      </Popover>

      {error && (
        <Text
          variant="caption"
          as="p"
          id={`${inputId}-error`}
          className="mt-2 text-ink-error"
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
}

export default ComboBox;
