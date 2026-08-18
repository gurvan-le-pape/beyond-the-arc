// src/frontend/shared/components/typography/Text.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { type ElementType, type HTMLAttributes } from "react";

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

      // Supporting text. There is no `muted` variant, deliberately:
      // `text-text-muted` is 2.05:1 on surface-raised and cannot be darkened to
      // AA without collapsing into `text-text-secondary`, so it is reserved for
      // decorative icons, separators and disabled controls. Text that a reader
      // is meant to read starts here. See the text scale in globals.css.
      caption: "text-sm text-text-secondary",

      // UI labels — defaults to <span> intentionally.
      // If you need a real <label>, pass as="label" htmlFor="input-id".
      // Never render a bare <label> without htmlFor — it's an a11y violation.
      label: "text-sm font-medium text-text-emphasis",

      // Small-caps section label. `text-text-body`, not `text-text-secondary`:
      // #6b7280 on surface-subtle (#f3f4f6) is 4.39:1, under the 4.5:1 AA needs
      // for 12px semibold — and this variant is 12px semibold by definition, so
      // the pairing failed wherever an overline sat on a Card. #4b5563 is
      // 6.87:1 there and 6.11:1 on surface-raised, and stays recessive against
      // the `text-text-emphasis` content it labels.
      overline:
        "text-xs font-semibold uppercase tracking-widest text-text-body",
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
  label: "span",
  overline: "span",
};

interface TextProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
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
  ref?: React.Ref<HTMLElement>;
}

/**
 * Every piece of text in the app. `variant` picks the type scale *and* the
 * element it renders as, so headings land on real heading tags without the
 * caller choosing one; `as` overrides the element alone, leaving the styling.
 *
 * **Colour belongs to the variant, not to the caller.** Each variant carries
 * its own text token — `overline` is `text-text-body` because at 12px semibold
 * it needs the full 4.5:1 and `text-text-secondary` misses it on every Card in
 * the app. That token sits on this component's own element, so a colour set on
 * a *parent* is merely inherited and loses to it. To recolour text, pass
 * `className` here; styling the wrapper will silently do nothing.
 */
export const Text = ({
  className,
  variant = "body",
  as,
  ref,
  ...props
}: TextProps) => {
  const Tag = as ?? variantTagMap[variant ?? "body"] ?? "p";

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={cn(textVariants({ variant }), className)}
      {...props}
    />
  );
};
