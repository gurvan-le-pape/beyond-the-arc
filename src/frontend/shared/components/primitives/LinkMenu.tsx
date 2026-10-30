// src/frontend/shared/components/primitives/LinkMenu.tsx
"use client";

import { ChevronDown } from "lucide-react";
import { type ReactNode, useState } from "react";

import { Link } from "@/navigation";
import { cn } from "@/shared/utils";

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "./Popover";

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
 * A disclosure, not an ARIA `menu`: the button shows and hides a list of real
 * links, so Tab moves through them and every one keeps prefetch, middle-click
 * and the back button. Escape closes and returns focus to the trigger; a click
 * outside, focus leaving, or following a link closes too.
 *
 * Size and weight come from the text around it, so it sits in a heading as
 * easily as in a sentence. Takes no `className`.
 */
export function LinkMenu({ label, icon, ariaLabel, items }: LinkMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* The anchor, so the panel lines up with the text rather than with the
          button's negative margin; inline-block around a block-level button. */}
      <PopoverAnchor asChild>
        <span className="inline-block">
          <PopoverTrigger
            // A disclosure of links, not a dialog.
            aria-haspopup={undefined}
            className={cn(
              "-mx-1 flex items-center gap-1 rounded-button px-1 transition-colors duration-150",
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
          </PopoverTrigger>
          <PopoverContent
            role={undefined}
            // Focus stays on the trigger; Tab moves on into the links.
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <nav aria-label={ariaLabel}>
              <ul className="py-1">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={item.isCurrent ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block px-3 py-2 text-sm font-normal tracking-normal transition-colors duration-150",
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
            </nav>
          </PopoverContent>
        </span>
      </PopoverAnchor>
    </Popover>
  );
}
