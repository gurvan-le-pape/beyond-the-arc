// src/frontend/shared/components/layout/header/Header.tsx
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { usePathname } from "@/navigation";
import {
  IconButton,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/primitives";

import { HamburgerButton } from "./HamburgerButton";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

/**
 * The sticky site header: wordmark, navigation, language and theme switches,
 * and the mobile menu.
 *
 * The mobile menu is a non-modal popover dropping out of the header row:
 * Radix closes it on Escape or a click outside, and returns focus to the ☰
 * button. Opening leaves focus on the button, and the next Tab enters the
 * first link; inside, Tab cycles through the menu's links until it closes.
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="backdrop-blur-md bg-header border-b border-divide shadow-card sticky top-0 z-header transition-colors">
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        {/* A plain row, not a landmark: the links inside are the navigation
            (NavLinks renders the labelled <nav>); the logo and theme toggle
            around them are not. Two nested navs under one name read as two
            regions to a screen reader. It anchors the mobile menu, which
            drops out of it at its full width. */}
        <PopoverAnchor asChild>
          <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16">
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
              <PopoverTrigger asChild>
                <IconButton
                  size="lg"
                  label={
                    menuOpen ? t("header.closeMenu") : t("header.openMenu")
                  }
                  // Radix announces a dialog; this opens a list of links.
                  aria-haspopup={undefined}
                >
                  <HamburgerButton open={menuOpen} />
                </IconButton>
              </PopoverTrigger>
            </div>
          </div>
        </PopoverAnchor>

        <PopoverContent
          align="sheet"
          role={undefined}
          // Radix would focus the panel itself — it skips links when choosing
          // what to focus — leaving a screen reader on an unlabelled <div>.
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="md:hidden flex flex-col py-4 px-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
            <NavLinks asList onClick={() => setMenuOpen(false)} />
            <div className="flex items-center justify-between gap-4 border-t border-divide mt-3 pt-4 px-4">
              <span className="text-text-body">{t("header.language")}</span>
              <LocaleSwitcher variant="full" />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
}
