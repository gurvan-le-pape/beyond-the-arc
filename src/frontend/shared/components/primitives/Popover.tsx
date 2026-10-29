// src/frontend/shared/components/primitives/Popover.tsx
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

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

// The least room kept between an open panel and the edge of the viewport.
const VIEWPORT_MARGIN = 16;

/**
 * How far a panel has to move back toward the viewport to stay inside it.
 *
 * Measured from the parent's box and the panel's own width, neither of which
 * the panel's scale animation or a previous shift changes, so it gives the
 * same answer on every call.
 *
 * @param panel - the mounted panel
 * @param align - which edge of the parent the panel is aligned to
 * @returns the pixels to shift it by, toward the start for `start` and toward the end for `end`; 0 when it fits
 */
function overflowShift(panel: HTMLDivElement, align: "start" | "end"): number {
  const parent = panel.offsetParent?.getBoundingClientRect();
  if (!parent) return 0;
  // The body, not the root: `scrollbar-gutter: stable` on the root keeps the
  // scrollbar's room out of the body's width but not out of the root's
  // `clientWidth`, which would let a panel end under the scrollbar.
  const viewport = document.body.clientWidth;
  const width = panel.offsetWidth;

  if (align === "start") {
    const overflow = parent.left + width - (viewport - VIEWPORT_MARGIN);
    return Math.max(0, Math.min(overflow, parent.left - VIEWPORT_MARGIN));
  }
  const overflow = VIEWPORT_MARGIN - (parent.right - width);
  return Math.max(
    0,
    Math.min(overflow, viewport - VIEWPORT_MARGIN - parent.right),
  );
}

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
 * it. A `start` or `end` panel that would cross the far edge of the viewport
 * is shifted back inside it, as far as its own edge allows, and placed again
 * when the window resizes. That holds while it is closed too: a closed panel
 * is still in the layout, so one left past the edge widens the page and lets
 * it scroll sideways on a phone. It stays mounted and fades and
 * scales between states, and `inert` is what makes closed mean closed:
 * without it the panel's controls stay in the tab order and the accessibility
 * tree while invisible.
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
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [shift, setShift] = useState(0);
  const edge = align ?? "start";

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (edge === "stretch" || !panel) return;
    const place = () => setShift(overflowShift(panel, edge));
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open, edge]);

  const setRefs = (node: HTMLDivElement | null) => {
    panelRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  let offset: { left: number } | { right: number } | undefined;
  if (shift > 0) offset = edge === "end" ? { right: -shift } : { left: -shift };

  return (
    <div
      ref={setRefs}
      inert={!open}
      className={popoverVariants({ align, open })}
      style={offset}
      {...props}
    >
      {children}
    </div>
  );
}
