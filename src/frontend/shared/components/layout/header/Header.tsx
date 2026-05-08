// src/frontend/shared/components/layout/header/Header.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useRef } from "react";

import { usePathname } from "@/navigation";

import { useMobileMenu } from "../hooks/useMobileMenu";
import HamburgerButton from "./HamburgerButton";
import { Logo } from "./Logo";
import NavLinks from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export const Header: React.FC = () => {
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
    <header className="backdrop-blur-md bg-header border-b border-divide shadow-card sticky top-0 z-30 transition-colors">
      <nav
        className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16"
        role="navigation"
        aria-label={t("header.mainNavAriaLabel")}
      >
        <Logo />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLinks />
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            ref={hamburgerRef}
            type="button"
            aria-label={menuOpen ? t("header.closeMenu") : t("header.openMenu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center justify-center w-10 h-10 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface hover:bg-surface-inset transition-all duration-200"
          >
            <HamburgerButton open={menuOpen} />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className={`md:hidden absolute top-full left-0 right-0 bg-header backdrop-blur-lg border-b border-divide shadow-card-hover transition-all duration-300 ${
            menuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
          aria-hidden={!menuOpen}
        >
          <div className="flex flex-col py-4 px-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
            <NavLinks asList onClick={() => setMenuOpen(false)} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
