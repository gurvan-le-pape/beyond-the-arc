// src/frontend/shared/components/layout/header/NavTiles.tsx
"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/navigation";
import { navItems } from "@/shared/constants";
import { cn } from "@/shared/utils";

import { isActivePath } from "./isActivePath";

interface NavTilesProps {
  /** Called on every tile press, so the menu holding the tiles can close. */
  readonly onNavigate: () => void;
}

/**
 * The mobile menu's navigation: the four sections as a two-by-two grid of
 * large tiles, each with its icon and a line on what it holds, the current one
 * tinted. A list of links in a labelled `<nav>`, as on desktop.
 */
export function NavTiles({ onNavigate }: NavTilesProps) {
  const pathname = usePathname();
  const t = useTranslations("navigation");

  return (
    <nav aria-label={t("header.mainNavAriaLabel")}>
      <ul className="grid grid-cols-2 gap-3">
        {navItems.map(({ href, labelKey, hintKey, icon: Icon }) => {
          const isActive = isActivePath(pathname, href);
          return (
            <li key={href} className="flex">
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-1 flex-col gap-3 rounded-2xl p-4 transition-colors focus-ring",
                  isActive
                    ? "bg-tint-primary text-ink-primary"
                    : "bg-surface-subtle text-text-heading",
                )}
              >
                <span
                  className={cn(
                    "grid place-items-center w-9 h-9 rounded-xl",
                    isActive
                      ? "bg-solid-primary text-on-solid-primary"
                      : "bg-surface-base text-text-emphasis",
                  )}
                >
                  <Icon aria-hidden="true" className="w-5 h-5" />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-semibold">{t(labelKey)}</span>
                  <span
                    className={cn(
                      "text-xs",
                      isActive ? "text-ink-primary" : "text-text-secondary",
                    )}
                  >
                    {t(hintKey)}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
