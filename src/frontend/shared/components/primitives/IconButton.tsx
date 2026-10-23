// src/frontend/shared/components/primitives/IconButton.tsx
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

const iconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center transition-colors duration-200 focus-ring " +
    "disabled:pointer-events-none disabled:opacity-30",
  {
    variants: {
      variant: {
        ghost:
          "text-text-body hover:bg-surface-inset hover:text-text-heading aria-expanded:bg-surface-inset",
        outline:
          "border border-divide surface-raised text-text-muted hover:bg-tint-primary hover:text-ink-primary",
        // On a `bg-solid-*` fill, such as a modal's coloured header.
        onSolid:
          "bg-on-solid-primary/10 text-on-solid-primary hover:bg-on-solid-primary/20",
      },
      size: {
        sm: "h-8 w-8 [&_svg]:h-4 [&_svg]:w-4",
        md: "h-9 w-9 [&_svg]:h-5 [&_svg]:w-5",
        lg: "h-10 w-10 [&_svg]:h-5 [&_svg]:w-5",
      },
      shape: {
        square: "rounded-button",
        circle: "rounded-full",
      },
    },
    defaultVariants: { variant: "ghost", size: "md", shape: "square" },
  },
);

interface IconButtonProps
  extends
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      "className" | "style" | "children" | "aria-label"
    >,
    VariantProps<typeof iconButtonVariants> {
  /** The accessible name — the icon says nothing to a screen reader. */
  readonly label: string;
  /** The icon, sized by `size`. */
  readonly children: ReactNode;
  readonly ref?: Ref<HTMLButtonElement>;
}

/**
 * A button whose only content is an icon: close, clear, expand, scroll.
 *
 * `label` is required and becomes the accessible name, since the icon carries
 * none. An `aria-expanded` button shows its open state with the hover fill.
 *
 * Takes no `className`: the variants are the whole of its look. Position it by
 * wrapping it.
 */
export function IconButton({
  label,
  variant,
  size,
  shape,
  children,
  ref,
  ...props
}: Readonly<IconButtonProps>) {
  return (
    <button
      ref={ref}
      // Before the spread: a caller can still opt into "submit".
      type="button"
      aria-label={label}
      className={iconButtonVariants({ variant, size, shape })}
      {...props}
    >
      {children}
    </button>
  );
}

export default IconButton;
