// src/frontend/shared/components/primitives/Popover.tsx
"use client";

import * as RadixPopover from "@radix-ui/react-popover";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const popoverContentVariants = cva(
  "z-dropdown overflow-hidden surface-raised border border-divide rounded-input shadow-card-hover " +
    "origin-[--radix-popover-content-transform-origin] " +
    "data-[state=open]:animate-popover-in data-[state=closed]:animate-popover-out",
  {
    variants: {
      align: {
        start: "w-max min-w-44 max-w-[90vw]",
        end: "w-max min-w-44 max-w-[90vw]",
        // As wide as the anchor, as a select's list is.
        stretch: "w-[--radix-popover-trigger-width]",
      },
    },
    defaultVariants: { align: "start" },
  },
);

/**
 * The root of a floating panel, on Radix Popover. Controlled by its caller
 * through `open` and `onOpenChange`; Radix asks to close on Escape, on a click
 * outside, and when focus leaves.
 */
export const Popover = RadixPopover.Root;

/**
 * The button that opens the panel. Radix gives it `aria-expanded`,
 * `aria-controls` and `aria-haspopup="dialog"`, toggles the panel on click,
 * and returns focus to it when the panel closes.
 */
export const PopoverTrigger = RadixPopover.Trigger;

/**
 * What the panel is placed against, when that is not the trigger: a combobox
 * with its own keyboard handling, an input, or a box wider than the button.
 */
export const PopoverAnchor = RadixPopover.Anchor;

interface PopoverContentProps
  extends
    Omit<
      ComponentProps<typeof RadixPopover.Content>,
      "className" | "style" | "align" | "side" | "sideOffset"
    >,
    VariantProps<typeof popoverContentVariants> {}

/**
 * The floating panel under a trigger: a select's list, a set of checkboxes, a
 * list of links, a search's results.
 *
 * It opens below its anchor, aligned to the anchor's start or end edge or
 * stretched across it, and Radix keeps it 16 px inside the viewport, flipping
 * above the anchor when there is no room below. Rendered in place, not
 * portalled: it follows the trigger in the tab order, and stays inside the
 * stacking context of whatever holds it. It is unmounted while closed.
 *
 * `role` defaults to `dialog`. A caller whose panel is something else — a
 * combobox's listbox, a disclosure of links — passes `role={undefined}`.
 *
 * The panel has no padding and clips its content to its corners. A scrolling
 * list caps its own height inside it.
 *
 * Takes no `className`: the variants are the whole of its look.
 */
export function PopoverContent({
  align,
  children,
  ...props
}: Readonly<PopoverContentProps>) {
  return (
    <RadixPopover.Content
      align={align === "end" ? "end" : "start"}
      side="bottom"
      sideOffset={4}
      collisionPadding={16}
      className={popoverContentVariants({ align })}
      {...props}
    >
      {children}
    </RadixPopover.Content>
  );
}
