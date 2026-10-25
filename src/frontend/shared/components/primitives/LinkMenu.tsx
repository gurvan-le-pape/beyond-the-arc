// src/frontend/shared/components/primitives/LinkMenu.tsx
"use client";

import { ChevronDown } from "lucide-react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";

import { Link } from "@/navigation";
import { cn } from "@/shared/utils";

import { Popover } from "./Popover";

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
  const containerRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    // A click or focus landing outside closes; so does Escape, from anywhere.
    const onOutside = (e: Event) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("focusin", onOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("focusin", onOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    // inline-block around a block-level button: the panel, placed by flow,
    // starts under the trigger rather than beside it.
    <span ref={containerRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
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
      </button>
      <Popover id={listId} open={open}>
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
      </Popover>
    </span>
  );
}

export default LinkMenu;
