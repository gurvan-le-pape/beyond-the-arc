// src/frontend/shared/components/layout/header/MobileMenu.tsx
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { usePathname } from "@/navigation";
import { BottomSheet, IconButton } from "@/shared/components/primitives";
import { useMediaQuery } from "@/shared/hooks";

import { HamburgerButton } from "./HamburgerButton";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { NavTiles } from "./NavTiles";
import { ThemePicker } from "./ThemePicker";

/**
 * The phone header's ☰ and the bottom sheet it opens: the sections as tiles,
 * then language and theme.
 *
 * **The sheet is gated on the viewport, not only hidden by CSS.** `BottomSheet`
 * is a modal `<dialog>`; left open while the window widens past `md` it would
 * keep the page inert behind a `display: none` element, so it closes as soon
 * as the viewport is wide.
 *
 * **Closes on every route change.** Next keeps the header mounted across
 * navigations, and back or forward while the sheet is open presses none of
 * its links, so without that the sheet would stay over the page the reader
 * just moved to.
 */
export function MobileMenu() {
  const t = useTranslations("navigation");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const isPhone = useMediaQuery("(max-width: 767px)", false);
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <IconButton
        size="lg"
        label={isOpen ? t("header.closeMenu") : t("header.openMenu")}
        aria-expanded={isOpen}
        onPress={() => setIsOpen((open) => !open)}
      >
        <HamburgerButton open={isOpen} />
      </IconButton>
      <BottomSheet
        isOpen={isOpen && isPhone}
        onClose={close}
        title={t("header.menu")}
        labels={{
          close: tCommon("close"),
          dragToClose: tCommon("dragToClose"),
        }}
      >
        <div className="flex flex-col gap-5 pb-2">
          <NavTiles onNavigate={close} />
          <div className="flex flex-col items-start gap-3 border-t border-divide pt-4">
            {/* Captions only: each control carries its own accessible name. */}
            <span aria-hidden="true" className="text-sm text-text-secondary">
              {t("header.language")}
            </span>
            <LocaleSwitcher />
            <span aria-hidden="true" className="text-sm text-text-secondary">
              {t("header.theme")}
            </span>
            <ThemePicker />
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
