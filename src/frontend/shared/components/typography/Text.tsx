// src/frontend/shared/components/typography/Text.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { type ElementType, forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/shared/utils";

const textVariants = cva("", {
  variants: {
    variant: {
      h1: "text-2xl md:text-3xl font-bold tracking-tight text-text-heading",
      h2: "text-xl md:text-2xl font-semibold text-text-heading",
      h3: "text-lg md:text-xl font-semibold text-text-heading",
      h4: "text-base md:text-lg font-medium text-text-heading",

      // Page title — use for route-level list pages (appears after a Breadcrumb,
      // before a grid or table). One step smaller than h1 — intentional.
      // For hero headings with a lead subtitle, use h1 instead.
      pageTitle: "text-xl md:text-2xl font-bold text-text-heading",

      // Body
      body: "text-base font-normal text-text-body",

      // Lead text — used for page subtitles and entity descriptors.
      // Always appears subordinate to an h1, never standalone.
      lead: "text-lg font-normal text-text-body",

      // Supporting text
      caption: "text-sm text-text-secondary",
      muted: "text-sm text-text-muted",

      // UI labels — defaults to <span> intentionally.
      // If you need a real <label>, pass as="label" htmlFor="input-id".
      // Never render a bare <label> without htmlFor — it's an a11y violation.
      label: "text-sm font-medium text-text-emphasis",

      overline:
        "text-xs font-semibold uppercase tracking-widest text-text-secondary",
    },
  },
  defaultVariants: { variant: "body" },
});

// Maps each variant to its most semantically appropriate HTML tag.
//
// Heading variants use their matching heading element for correct document
// outline and screen-reader navigation.
//
// label defaults to "span" — not "label" — because a bare <label> without
// htmlFor creates accidental form associations. Use as="label" + htmlFor
// explicitly when you actually need a form label.
const variantTagMap: Record<string, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  pageTitle: "h1",
  body: "p",
  lead: "p",
  caption: "span",
  muted: "span",
  label: "span",
  overline: "span",
};

interface TextProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  /**
   * Override the rendered HTML tag.
   *
   * Examples:
   *   <Text variant="body" as="span" />   → inline, not a block <p>
   *   <Text variant="label" as="label" htmlFor="email" />  → real form label
   *   <Text variant="h2" as="h3" />       → h2 styles, h3 semantics (avoid if possible)
   */
  as?: ElementType;
  htmlFor?: string;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  ({ className, variant = "body", as, ...props }, ref) => {
    const Tag = as ?? variantTagMap[variant ?? "body"] ?? "p";

    return (
      <Tag
        ref={ref as React.Ref<HTMLElement>}
        className={cn(textVariants({ variant }), className)}
        {...props}
      />
    );
  },
);

Text.displayName = "Text";
