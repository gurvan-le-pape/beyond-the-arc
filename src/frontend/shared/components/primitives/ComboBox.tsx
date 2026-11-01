// src/frontend/shared/components/primitives/ComboBox.tsx
"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  Button,
  ComboBox as AriaComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";

import { cn } from "@/shared/utils";

import {
  DROPDOWN_EMPTY,
  DROPDOWN_LABEL,
  DROPDOWN_LIST,
  DROPDOWN_OPTION,
  DROPDOWN_POPUP,
  DROPDOWN_TRIGGER_BASE,
} from "./dropdownStyles";
import { SelectChevron } from "./SelectChevron";

/** A picker's value: an id, a code, or an enum member. */
export type OptionValue = string | number;

/**
 * One choice in a picker. `value: undefined` is the "all"/"none" choice, which
 * is selected while the picker's own value is `undefined`.
 */
export interface ComboBoxOption<V extends OptionValue = OptionValue> {
  value: V | undefined;
  label: string;
}

export interface ComboBoxProps<V extends OptionValue = OptionValue> {
  readonly label: string;
  /** Shown in the empty field. */
  readonly placeholder?: string;
  /** The results of the latest search. */
  readonly options: ComboBoxOption<NoInfer<V>>[];
  readonly value: V | undefined;
  /**
   * The field's text while `value` is set and nobody is typing. The results of
   * a search seldom include the chosen option, so it cannot be read from them.
   */
  readonly selectedLabel: string | undefined;
  /** Called with the picked option's value, or `undefined` when cleared. */
  readonly onChange: (value: V | undefined) => void;
  /** Called with what is typed, and with "" when the typing is abandoned. */
  readonly onSearchChange: (search: string) => void;
  /** The latest search is in flight. */
  readonly isLoading?: boolean;
}

/**
 * An autocomplete over a server-side search, on React Aria's ComboBox: the
 * field is the search, and its results open below it as you type, or from the
 * chevron.
 *
 * Picking an option reports it and shows `selectedLabel` in the field. Leaving
 * the field without picking puts `selectedLabel` back, and the search with it;
 * leaving it emptied, or pressing ✕, clears the value. React Aria owns the
 * keyboard (↓/↑ through the results, Enter picks, Escape closes then reverts),
 * the virtual focus on the options, and the announcements.
 *
 * @example
 * <ComboBox
 *   label="Clubs"
 *   placeholder="All clubs"
 *   options={results}
 *   value={clubId}
 *   selectedLabel={clubName}
 *   onChange={setClubId}
 *   onSearchChange={setSearch}
 *   isLoading={isLoading}
 * />
 */
export function ComboBox<V extends OptionValue>({
  label,
  placeholder,
  options,
  value,
  selectedLabel,
  onChange,
  onSearchChange,
  isLoading = false,
}: ComboBoxProps<V>) {
  const t = useTranslations("common");
  // What is typed, or null while the field shows the chosen option.
  const [draft, setDraft] = useState<string | null>(null);
  const shownText = draft ?? (value === undefined ? "" : (selectedLabel ?? ""));

  const type = (text: string) => {
    setDraft(text);
    onSearchChange(text);
  };

  const settle = () => {
    setDraft(null);
    onSearchChange("");
  };

  const pick = (picked: V | undefined) => {
    settle();
    onChange(picked);
  };

  return (
    <AriaComboBox
      className="relative w-full"
      items={options.map((option) => ({ ...option, id: option.value }))}
      // React Aria keys cannot be undefined; options standing for "all" are
      // not offered in a search.
      value={value ?? null}
      onChange={(key) => {
        // React Aria commits the selection again when the field loses focus;
        // the same value is no change, and the search's results may no
        // longer hold its label.
        if (key === null || key === value) settle();
        else pick(key as V);
      }}
      inputValue={shownText}
      // React Aria also writes the input when it resets it, to the text of an
      // option it may not have; the field's text is ours, from typing.
      onInputChange={() => {}}
      allowsEmptyCollection
    >
      {({ isOpen }) => (
        <>
          <Label className={cn(DROPDOWN_LABEL, "mb-2 block")}>{label}</Label>

          <div className="relative">
            <Input
              placeholder={placeholder}
              className={cn(
                DROPDOWN_TRIGGER_BASE,
                value !== undefined && "pr-16",
                "truncate placeholder:text-text-secondary",
              )}
              onChange={(event) => type(event.target.value)}
              onBlur={() => {
                if (draft === "" && value !== undefined) pick(undefined);
                else settle();
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") settle();
              }}
            />

            <span className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
              {value !== undefined && (
                <button
                  type="button"
                  className="rounded p-1 text-text-muted hover:text-text-heading focus-ring"
                  aria-label={t("clearSelection")}
                  onClick={() => pick(undefined)}
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
              <Button className="rounded p-1 focus-ring">
                <SelectChevron open={isOpen} />
              </Button>
            </span>
          </div>

          <Popover
            placement="bottom start"
            offset={4}
            containerPadding={16}
            className={DROPDOWN_POPUP}
          >
            <ListBox
              className={DROPDOWN_LIST}
              renderEmptyState={() => (
                <p className={DROPDOWN_EMPTY}>
                  {isLoading ? t("loading") : t("empty")}
                </p>
              )}
            >
              {(option: ComboBoxOption<V>) => (
                <ListBoxItem
                  id={option.value}
                  textValue={option.label}
                  className={DROPDOWN_OPTION}
                >
                  {option.label}
                </ListBoxItem>
              )}
            </ListBox>
          </Popover>
        </>
      )}
    </AriaComboBox>
  );
}
