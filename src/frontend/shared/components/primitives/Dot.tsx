// src/frontend/shared/components/primitives/Dot.tsx
import { cva, type VariantProps } from "class-variance-authority";

const dotVariants = cva("inline-block shrink-0 rounded-full", {
  variants: {
    size: {
      sm: "h-1.5 w-1.5",
      md: "h-2 w-2",
      lg: "h-2.5 w-2.5",
    },
    tone: {
      primary: "bg-solid-primary",
      heading: "bg-text-heading",
      muted: "bg-text-muted",
      national: "bg-solid-national",
      regional: "bg-solid-regional",
      departmental: "bg-solid-departmental",
    },
  },
  defaultVariants: { size: "md", tone: "primary" },
});

type DotProps = VariantProps<typeof dotVariants>;

/**
 * A small filled circle: a marker before a label, a separator, a colour key.
 *
 * Decorative, so hidden from assistive technology: whatever it marks has to
 * be said by the text beside it.
 *
 * Takes no `className`: the variants are the whole of its look. Position or
 * animate it by wrapping it.
 */
export function Dot({ size, tone }: Readonly<DotProps>) {
  return <span aria-hidden="true" className={dotVariants({ size, tone })} />;
}
