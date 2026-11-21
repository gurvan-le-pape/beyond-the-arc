// src/frontend/shared/components/layout/header/CurrentSection.tsx
"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/navigation";
import { navItems } from "@/shared/constants";

import { isActivePath } from "./isActivePath";

/**
 * The current section on a phone, beside the mark: the desktop nav's active
 * pill, which the ☰ hides below `md`. The section pages open with their
 * content and leave their title to screen readers, so on a phone this is what
 * names the page. It links to the section's root, and renders nothing on a
 * page outside every section (home, the site pages, a 404).
 *
 * While it shows, the wordmark beside the mark is visually hidden (see
 * `Logo`): a phone's capsule has no room for both.
 */
export function CurrentSection() {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const section = navItems.find(({ href }) => isActivePath(pathname, href));
  if (!section) return null;
  const { href, labelKey, icon: Icon } = section;

  return (
    <Link
      href={href}
      data-current-section
      className="flex md:hidden items-center gap-1.5 h-9 px-3 min-w-0 rounded-full bg-tint-primary text-ink-primary text-sm font-medium whitespace-nowrap focus-ring"
    >
      <Icon aria-hidden="true" className="w-4 h-4 shrink-0" />
      <span className="truncate">{t(labelKey)}</span>
    </Link>
  );
}
