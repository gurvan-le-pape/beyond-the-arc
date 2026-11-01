// src/frontend/shared/components/layout/header/Header.tsx
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogTrigger, Popover } from "react-aria-components";

import { usePathname } from "@/navigation";
import { IconButton } from "@/shared/components/primitives";

import { HamburgerButton } from "./HamburgerButton";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

/**
 * The sticky site header: wordmark, navigation, language and theme switches,
 * and the mobile menu.
 *
 * The mobile menu is a dialog dropping out of the header row at its full
 * width, on React Aria's DialogTrigger: focus moves into it and Tab stays
 * inside; Escape or a click outside closes it and returns focus to the ☰
 * button.
 *
 * **Closes the mobile menu on every route change.** Next keeps this component
 * mounted across navigations, and back or forward while the menu is open
 * clicks none of its links, so without that the menu would stay open over the
 * page the user just moved to.
 *
 * Rendered by the `(chrome)` layout, so pages never mount it; a page that wants
 * no header belongs in a different route group.
 */
export function Header() {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const [menuOpen, setMenuOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="backdrop-blur-md bg-header border-b border-divide shadow-card sticky top-0 z-header transition-colors">
      {/* A plain row, not a landmark: the links inside are the navigation
          (NavLinks renders the labelled <nav>); the logo and theme toggle
          around them are not. Two nested navs under one name read as two
          regions to a screen reader. It anchors the mobile menu, which drops
          out of it at its full width. */}
      <div
        ref={rowRef}
        className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16"
      >
        <Logo />

        <div className="hidden md:flex items-center gap-1">
          <NavLinks />
        </div>

        <div className="hidden md:flex items-center gap-2">
          <LocaleSwitcher variant="compact" />
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          {/* Around the ☰ alone: the trigger wires the pressable inside it,
              and the theme button shares this row. */}
          <DialogTrigger isOpen={menuOpen} onOpenChange={setMenuOpen}>
            <IconButton
              size="lg"
              label={menuOpen ? t("header.closeMenu") : t("header.openMenu")}
            >
              <HamburgerButton open={menuOpen} />
            </IconButton>
            <Popover
              triggerRef={rowRef}
              placement="bottom start"
              offset={0}
              containerPadding={0}
              className="z-dropdown w-[--trigger-width] origin-top border-b border-divide bg-surface-base shadow-card-hover data-[entering]:animate-popover-in data-[exiting]:animate-popover-out"
            >
              <Dialog
                aria-label={t("header.menu")}
                className="md:hidden flex flex-col py-4 px-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide focus-visible:outline-none"
              >
                <NavLinks asList onClick={() => setMenuOpen(false)} />
                <div className="flex items-center justify-between gap-4 border-t border-divide mt-3 pt-4 px-4">
                  <span className="text-text-body">{t("header.language")}</span>
                  <LocaleSwitcher variant="full" />
                </div>
              </Dialog>
            </Popover>
          </DialogTrigger>
        </div>
      </div>
    </header>
  );
}
