// src/frontend/shared/components/forms/fieldStyles.ts

/** The box of a text field: an `Input` or a `SearchInput`. */
export const FIELD_INPUT =
  "h-9 w-full rounded-input border border-divide bg-surface-inset px-4 text-sm text-text-heading " +
  "placeholder:text-text-secondary focus-ring focus:border-solid-primary " +
  "disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200";

/** A field's visible label, above it. */
export const FIELD_LABEL = "mb-2 block text-sm font-medium text-text-emphasis";

/** An icon at the start of a field: decorative, click-through. */
export const FIELD_ICON =
  "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted";
