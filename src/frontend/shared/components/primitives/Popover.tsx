// src/frontend/shared/components/primitives/Popover.tsx
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode, Ref } from "react";

const popoverVariants = cva(
  "absolute z-dropdown mt-1 overflow-hidden surface-raised border border-divide rounded-input shadow-card-hover " +
    "transition-[opacity,transform] duration-200",
  {
    variants: {
      align: {
        start: "left-0 w-max min-w-44 max-w-[90vw] origin-top-left",
        end: "right-0 w-max min-w-44 max-w-[90vw] origin-top-right",
        // As wide as the positioned parent, as a select's list is.
        stretch: "inset-x-0 origin-top",
      },
      open: {
        true: "opacity-100 scale-100",
        false: "pointer-events-none opacity-0 scale-95",
      },
    },
    defaultVariants: { align: "start" },
  },
);

interface PopoverProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, "className" | "style" | "inert">,
    Omit<VariantProps<typeof popoverVariants>, "open"> {
  readonly open: boolean;
  readonly children: ReactNode;
  readonly ref?: Ref<HTMLDivElement>;
}

/**
 * The floating panel under a trigger: a select's list, a menu, a search's
 * results.
 *
 * Place it right after the trigger inside a `relative` parent; it opens below
 * the trigger, aligned to the parent's start or end edge or stretched across
 * it. It stays mounted and fades and scales between states, and `inert` is
 * what makes closed mean closed: without it the panel's controls stay in the
 * tab order and the accessibility tree while invisible.
 *
 * The panel has no padding and clips its content to its corners. A scrolling
 * list caps its own height inside it.
 *
 * Takes no `className`: the variants are the whole of its look.
 */
export function Popover({
  open,
  align,
  children,
  ref,
  ...props
}: Readonly<PopoverProps>) {
  return (
    <div
      ref={ref}
      inert={!open}
      className={popoverVariants({ align, open })}
      {...props}
    >
      {children}
    </div>
  );
}

export default Popover;
