// src/frontend/shared/components/layout/header/NavLinks.tsx
"use client";

import { useTranslations } from "next-intl";
import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";

import { Link, usePathname } from "@/navigation";
import { navItems } from "@/shared/constants";
import { cn } from "@/shared/utils";

import { isActivePath } from "./isActivePath";

/**
 * The desktop navigation: the four sections in one row, the current one on a
 * tinted pill that slides to the next section on navigation.
 *
 * **The pill is measured, so the server cannot draw it.** Until the first
 * measurement the active link paints its own pill, so the server's HTML is
 * already right and nothing jumps at hydration. From then on one shared pill
 * is positioned under the active link and moves with it; a ResizeObserver
 * re-measures when fonts load or the row reflows. On a page outside every
 * section (home, a 404) there is no pill at all.
 *
 * These are page links inside a labelled `<nav>`, not an ARIA menu.
 */
export function NavLinks() {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const rowRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<CSSProperties | null>(null);
  const [measured, setMeasured] = useState(false);

  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const place = () => {
      const active = row.querySelector<HTMLElement>('[aria-current="page"]');
      setPill(
        active ? { left: active.offsetLeft, width: active.offsetWidth } : null,
      );
      setMeasured(true);
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(row);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav aria-label={t("header.mainNavAriaLabel")}>
      <div ref={rowRef} className="relative flex items-center gap-0.5">
        {measured && pill && (
          <span
            aria-hidden="true"
            style={pill}
            className="absolute inset-y-0 rounded-full bg-tint-primary transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
          />
        )}
        {navItems.map(({ href, labelKey, icon: Icon }) => {
          const isActive = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              data-testid={`nav-link-${href.replace("/", "-")}`}
              className={cn(
                "relative flex items-center gap-2 h-10 px-4 rounded-full whitespace-nowrap text-sm font-medium transition-colors duration-200 focus-ring",
                isActive
                  ? "text-ink-primary"
                  : "text-text-emphasis hover:text-text-heading hover:bg-surface-raised",
                isActive && !measured && "bg-tint-primary",
              )}
            >
              <Icon aria-hidden="true" className="w-4 h-4 shrink-0" />
              {t(labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
