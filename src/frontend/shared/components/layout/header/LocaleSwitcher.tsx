// src/frontend/shared/components/layout/header/LocaleSwitcher.tsx
"use client";

import { useLocale, useTranslations } from "next-intl";
import type { MouseEvent } from "react";

import { type Locale, LOCALES } from "@/locales";
import { Link, usePathname, useRouter } from "@/navigation";
import { cn } from "@/shared/utils";

/**
 * Each language named in itself — "Français" to an English reader too — so a
 * reader finds their own language whichever one the page is in. That is why
 * these are not catalogue strings: a catalogue entry is translated, and these
 * must not be.
 */
const LOCALE_NAMES: Record<
  Locale,
  { readonly short: string; readonly full: string }
> = {
  en: { short: "EN", full: "English" },
  fr: { short: "FR", full: "Français" },
};

interface LocaleSwitcherProps {
  /**
   * `compact` is the header bar's two-letter pair; `full` names each language
   * in words, for the mobile menu where there is room.
   */
  readonly variant: "compact" | "full";
}

/**
 * Links to the current page in each locale, the active one marked.
 *
 * The `href` is the page's path, so a link works without JavaScript; a click
 * also carries the query string over (`?pool=` on a championship), which the
 * path alone would drop. The query is read at click time rather than through
 * `useSearchParams`, which would opt every page under the header out of static
 * rendering.
 */
export function LocaleSwitcher({ variant }: LocaleSwitcherProps) {
  const t = useTranslations("navigation");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo =
    (locale: Locale) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (locale === activeLocale) {
        event.preventDefault();
        return;
      }
      const { search } = globalThis.location;
      if (search) {
        event.preventDefault();
        router.replace(`${pathname}${search}`, { locale });
      }
    };

  return (
    <nav
      aria-label={t("header.languageAriaLabel")}
      className="flex items-center rounded-button border border-divide p-0.5"
    >
      {LOCALES.map((locale) => {
        const isActive = locale === activeLocale;
        const name = LOCALE_NAMES[locale];
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            lang={locale}
            hrefLang={locale}
            aria-current={isActive ? "true" : undefined}
            onClick={switchTo(locale)}
            className={cn(
              "rounded-[6px] font-semibold transition-colors duration-200 focus-ring",
              variant === "compact"
                ? "px-2.5 py-1.5 text-sm"
                : "px-4 py-2.5 text-base",
              isActive
                ? "bg-tint-primary text-ink-primary font-bold"
                : "text-text-body hover:bg-surface-inset hover:text-text-heading",
            )}
          >
            {variant === "compact" ? (
              <abbr title={name.full} className="no-underline">
                {name.short}
              </abbr>
            ) : (
              name.full
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default LocaleSwitcher;
