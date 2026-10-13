// src/frontend/shared/components/primitives/dropdownTriggerBase.ts
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
  "border border-divide",
  // Background
  "bg-surface-inset",
  // Text
  "text-text-heading",
  // Focus
  "focus-ring focus:border-primary",
  // States
  "disabled:opacity-50 disabled:cursor-not-allowed",
  "transition-colors duration-200",
].join(" ");
