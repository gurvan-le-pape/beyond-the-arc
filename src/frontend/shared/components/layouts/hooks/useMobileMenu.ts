// src/frontend/shared/components/layouts/hooks/useMobileMenu.ts
"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";

export function useMobileMenu(refs: {
  menu: RefObject<HTMLDivElement | null>;
  button: RefObject<HTMLButtonElement | null>;
}) {
  const [open, setOpen] = useState(false);

  // Click-away to close
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        refs.menu.current &&
        !refs.menu.current.contains(e.target as Node) &&
        refs.button.current &&
        !refs.button.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, refs]);

  // Focus trap
  useEffect(() => {
    if (!open || !refs.menu.current) return;
    const focusable = refs.menu.current.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length) focusable[0].focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Tab" && focusable.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, refs]);

  return { menuOpen: open, setMenuOpen: setOpen };
}
