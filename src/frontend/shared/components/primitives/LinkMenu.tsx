// src/frontend/shared/components/primitives/LinkMenu.tsx
"use client";

import { ChevronDown } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";
import {
  Button as AriaButton,
  Dialog,
  DialogTrigger,
  Popover,
} from "react-aria-components";

import { Link } from "@/navigation";
import { cn } from "@/shared/utils";

import { DROPDOWN_PANEL } from "./dropdownStyles";

export interface LinkMenuItem {
  readonly label: string;
  readonly href: string;
  readonly isCurrent: boolean;
}

interface LinkMenuProps {
  /** The trigger's text: the current item, as it reads in the line around it. */
  readonly label: string;
  /** Before the label, sized to the text: an `aria-hidden` icon. */
  readonly icon?: ReactNode;
  /** Names the list of links, e.g. "Category". */
  readonly ariaLabel: string;
  readonly items: readonly LinkMenuItem[];
}

/**
 * A word in running text that opens a short list of pages to go to instead —
 * the current one marked. Built for a heading made of facets, where each facet
 * is the trigger for its own siblings.
 *
 * On React Aria's DialogTrigger: the panel is a dialog named by `ariaLabel`,
 * holding real links, so each keeps prefetch, middle-click and the back
 * button. Focus moves into it and Tab stays inside; Escape, a click outside
 * or following a link closes it and returns focus to the word.
 *
 * Size and weight come from the text around it, so it sits in a heading as
 * easily as in a sentence. Takes no `className`.
 */
export function LinkMenu({ label, icon, ariaLabel, items }: LinkMenuProps) {
  const [open, setOpen] = useState(false);
  // The panel lines up with the text rather than with the button's negative
  // margin; inline-block around the button so it has a box to measure.
  const anchorRef = useRef<HTMLSpanElement>(null);

  return (
    <DialogTrigger isOpen={open} onOpenChange={setOpen}>
      <span ref={anchorRef} className="inline-block">
        <AriaButton
          className={cn(
            "-mx-1 flex cursor-pointer items-center gap-1 rounded-button px-1 transition-colors duration-150 focus-ring",
            "underline decoration-dotted decoration-from-font underline-offset-4",
            open
              ? "bg-surface-subtle text-ink-primary"
              : "hover:bg-surface-subtle hover:text-ink-primary",
          )}
        >
          {icon}
          {label}
          <ChevronDown
            aria-hidden
            className={cn(
              "size-[0.7em] shrink-0 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </AriaButton>
      </span>
      <Popover
        triggerRef={anchorRef}
        placement="bottom start"
        offset={4}
        containerPadding={16}
        className={DROPDOWN_PANEL}
      >
        <Dialog aria-label={ariaLabel} className="focus-visible:outline-none">
          <ul className="py-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={item.isCurrent ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block px-3 py-2 text-sm font-normal tracking-normal transition-colors duration-150 focus-ring-inset",
                    item.isCurrent
                      ? "bg-solid-primary text-on-solid-primary"
                      : "text-text-body hover:bg-surface-subtle hover:text-text-heading",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
