// src/frontend/shared/components/forms/Select.tsx
"use client";

import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
} from "react-aria-components";

import type {
  ComboBoxOption,
  OptionValue,
} from "@/shared/components/primitives";
import {
  DROPDOWN_TRIGGER_BASE,
  SelectChevron,
} from "@/shared/components/primitives";
import { cn } from "@/shared/utils";

/** The key of the option whose value is `undefined`: React Aria keys cannot be. */
const NO_VALUE_KEY = "__select-no-value__";

export interface SelectProps<V extends OptionValue = OptionValue> {
  readonly options: ComboBoxOption<NoInfer<V>>[];
  readonly value: V | undefined;
  readonly onChange: (value: V | undefined) => void;
  readonly label?: string;
  /**
   * Keep the label for screen readers but hide it visually, for a picker whose
   * purpose is plain from its surroundings. Default: false.
   */
  readonly hideLabel?: boolean;
  /**
   * Shown when no option stands for `value`. Without one the trigger is blank,
   * as a native `<select>` is.
   */
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly testId?: string;
}

/**
 * A single-value picker over a short, fixed list of options, on React Aria's
 * Select.
 *
 * The trigger is a button showing the selected option's label, or
 * `placeholder` when no option stands for `value`; an option whose value is
 * `undefined` is the "all"/"none" choice. React Aria owns the keyboard (arrows,
 * Home/End, typeahead, Enter/Space, Escape), focus, which moves into the list
 * while it is open and back to the trigger after, and the labelling.
 *
 * The list is portalled to `<body>`, or into the nearest `BottomSheet`, which
 * provides its `<dialog>` as the portal container.
 *
 * @example
 * <Select
 *   label="Category"
 *   value={category}
 *   onChange={setCategory}
 *   options={CATEGORY_LIST.map((c) => ({ value: c, label: t(`category.${c}`) }))}
 *   placeholder="All categories"
 * />
 */
export function Select<V extends OptionValue>({
  options,
  value,
  onChange,
  label,
  hideLabel = false,
  placeholder,
  disabled = false,
  className,
  testId,
}: SelectProps<V>) {
  const keyOf = (optionValue: V | undefined) => optionValue ?? NO_VALUE_KEY;
  const selectedKey = options.some((option) => option.value === value)
    ? keyOf(value)
    : null;

  return (
    <AriaSelect
      value={selectedKey}
      onChange={(key) => {
        const picked = options.find((option) => keyOf(option.value) === key);
        if (picked) onChange(picked.value);
      }}
      isDisabled={disabled}
      placeholder={placeholder ?? ""}
      aria-label={label ? undefined : placeholder}
      className={cn("relative", !className && "w-full", className)}
      data-testid={testId}
    >
      {({ isOpen }) => (
        <>
          {label && (
            <Label
              className={cn(
                "text-sm font-medium text-text-emphasis",
                hideLabel ? "sr-only" : "mb-2 block",
              )}
            >
              {label}
            </Label>
          )}

          <Button
            className={cn(
              DROPDOWN_TRIGGER_BASE,
              "relative flex items-center text-left",
            )}
          >
            <SelectValue className="block truncate data-[placeholder]:text-text-secondary" />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <SelectChevron open={isOpen} />
            </span>
          </Button>

          <Popover
            placement="bottom start"
            offset={4}
            containerPadding={16}
            className={cn(
              "z-dropdown w-[--trigger-width] overflow-hidden surface-raised border border-divide rounded-input shadow-card-hover",
              "origin-top data-[entering]:animate-popover-in data-[exiting]:animate-popover-out",
            )}
          >
            <ListBox className="max-h-60 overflow-y-auto scrollbar-hide py-1 focus-visible:outline-none">
              {options.map((option) => (
                <ListBoxItem
                  key={keyOf(option.value)}
                  id={keyOf(option.value)}
                  textValue={option.label}
                  className={cn(
                    "cursor-pointer px-4 py-2 text-sm text-text-heading transition-colors duration-150 focus-visible:outline-none",
                    "data-[selected]:border-l-2 data-[selected]:border-solid-primary data-[selected]:bg-tint-primary data-[selected]:font-semibold data-[selected]:text-ink-primary",
                    "data-[focused]:bg-tint-primary data-[focused]:text-ink-primary",
                  )}
                >
                  {option.label}
                </ListBoxItem>
              ))}
            </ListBox>
          </Popover>
        </>
      )}
    </AriaSelect>
  );
}
