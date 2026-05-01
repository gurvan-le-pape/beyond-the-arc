// src/frontend/shared/components/primitives/DropdownTriggerBase.tsx
//
// Single source of truth for the visual contract shared by ALL dropdown-style
// controls: Select, ComboBox, MultiSelectDropdown.
//
// Every control that looks like a "picker" must use these classes on its
// trigger element so they are pixel-identical across the UI.

export const DROPDOWN_TRIGGER_BASE = [
  // Layout
  "h-9 w-full px-4 pr-9 text-sm",
  // Shape
  "rounded-input",
  // Border
  "border border-divide-light dark:border-divide-dark",
  // Background
  "bg-surface-raised dark:bg-surface-raised-dark",
  // Text
  "text-text-heading dark:text-text-heading-dark",
  // Focus
  "focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500",
  // States
  "disabled:opacity-50 disabled:cursor-not-allowed",
  "transition-colors duration-200",
].join(" ");
