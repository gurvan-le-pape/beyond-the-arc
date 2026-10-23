// src/frontend/shared/components/layout/header/Header.tsx
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { usePathname } from "@/navigation";
import { IconButton } from "@/shared/components/primitives";

import { useMobileMenu } from "../hooks/useMobileMenu";
import HamburgerButton from "./HamburgerButton";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import NavLinks from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

/**
 * The sticky site header: wordmark, navigation, language and theme switches,
 * and the mobile menu.
 *
 * **Closes the mobile menu on every route change.** Next keeps this component
 * mounted across navigations, so without that the menu would stay open over the
 * page the user just moved to.
 *
 * Owns the two refs `useMobileMenu` needs — the panel and the toggle — which is
 * why the open state lives here rather than inside the menu itself.
 *
 * Rendered by the `(chrome)` layout, so pages never mount it; a page that wants
 * no header belongs in a different route group.
 */
export function Header() {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const { menuOpen, setMenuOpen } = useMobileMenu({
    menu: mobileMenuRef,
    button: hamburgerRef,
  });

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  return (
    <header className="backdrop-blur-md bg-header border-b border-divide shadow-card sticky top-0 z-header transition-colors">
      {/* A plain row, not a landmark: the links inside are the navigation
          (NavLinks renders the labelled <nav>); the logo and theme toggle
          around them are not. Two nested navs under one name read as two
          regions to a screen reader. */}
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
          <IconButton
            ref={hamburgerRef}
            size="lg"
            label={menuOpen ? t("header.closeMenu") : t("header.openMenu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <HamburgerButton open={menuOpen} />
          </IconButton>
        </div>

        {/* Opaque, not the header's translucent fill: the header's own
            backdrop-filter makes it the backdrop root for anything inside it,
            so a blur here would see only the header, not the page, and the
            page's text would read through the links. */}
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className={`md:hidden absolute top-full left-0 right-0 bg-surface-base border-b border-divide shadow-card-hover transition-all duration-300 ${
            menuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
          // aria-hidden alone hides it from assistive tech but leaves every
          // link tabbable, which is the worse of the two states: a stop that
          // announces nothing. inert removes both.
          inert={!menuOpen}
          aria-hidden={!menuOpen}
        >
          <div className="flex flex-col py-4 px-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
            <NavLinks asList onClick={() => setMenuOpen(false)} />
            <div className="flex items-center justify-between gap-4 border-t border-divide mt-3 pt-4 px-4">
              <span className="text-text-body">{t("header.language")}</span>
              <LocaleSwitcher variant="full" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
