// src/frontend/shared/components/primitives/dropdownStyles.ts

/**
 * The trigger of every picker (Select, ComboBox, MultiSelect): the button, or
 * the input of an autocomplete. Room on the right for the chevron.
 */
export const DROPDOWN_TRIGGER_BASE = [
  "h-9 w-full px-4 pr-9 text-sm",
  "rounded-input border border-divide bg-surface-inset text-text-heading",
  "focus-ring focus:border-solid-primary",
  "disabled:opacity-50 disabled:cursor-not-allowed",
  "transition-colors duration-200",
].join(" ");

/** A picker's label, above its trigger. */
export const DROPDOWN_LABEL = "text-sm font-medium text-text-emphasis";

/**
 * The floating panel of a React Aria picker: as wide as its trigger, opening
 * and closing with the popover animation.
 */
export const DROPDOWN_POPUP = [
  "z-dropdown w-[--trigger-width] overflow-hidden",
  "surface-raised border border-divide rounded-input shadow-card-hover",
  "origin-top data-[entering]:animate-popover-in data-[exiting]:animate-popover-out",
].join(" ");

/**
 * A floating panel sized by its content rather than its trigger, such as a
 * MultiSelect's columns of checkboxes, kept inside the viewport's width.
 */
export const DROPDOWN_PANEL = [
  "z-dropdown w-max min-w-44 max-w-[90vw] overflow-hidden",
  "surface-raised border border-divide rounded-input shadow-card-hover",
  "origin-top data-[entering]:animate-popover-in data-[exiting]:animate-popover-out",
].join(" ");

/**
 * The listbox inside the panel. Focus, real or virtual, sits on an option, so
 * the list draws no outline of its own.
 */
export const DROPDOWN_LIST =
  "max-h-60 overflow-y-auto scrollbar-hide py-1 focus-visible:outline-none";

/**
 * One option. The highlighted background is the focus indicator, so the global
 * focus-visible outline is turned off; the selected option keeps a bar on its
 * leading edge.
 */
export const DROPDOWN_OPTION = [
  "cursor-pointer px-4 py-2 text-sm text-text-heading transition-colors duration-150 focus-visible:outline-none",
  "data-[selected]:border-l-2 data-[selected]:border-solid-primary data-[selected]:bg-tint-primary data-[selected]:font-semibold data-[selected]:text-ink-primary",
  "data-[focused]:bg-tint-primary data-[focused]:text-ink-primary",
].join(" ");

/** The line a list shows instead of options: loading, or nothing found. */
export const DROPDOWN_EMPTY = "px-4 py-2 text-sm text-text-secondary";
