// src/frontend/features/site/architecture/constants/stackTones.ts

/** The tone a layer of the stack is drawn in, on the architecture page. */
export type StackTone = "primary" | "secondary" | "category";

/**
 * Fill and text for a layer's header or diagram box: the tone's solid role
 * with the text that is guaranteed to read on it. Spelled out per tone, since
 * Tailwind only generates classes it can see written whole.
 */
export const STACK_TONE_CLASSES: Record<StackTone, string> = {
  primary: "bg-solid-primary text-on-solid-primary",
  secondary: "bg-solid-secondary text-on-solid-secondary",
  category: "bg-solid-category text-on-solid-category",
};
