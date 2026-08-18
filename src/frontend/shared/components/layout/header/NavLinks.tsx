// src/frontend/shared/components/layout/header/NavLinks.tsx
"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { Link, usePathname } from "@/navigation";
import { navItems } from "@/shared/constants";
import { cn } from "@/shared/utils";

interface NavLinksProps {
  onClick?: () => void;
  asList?: boolean;
  className?: string;
}

/**
 * The site navigation links, marking the current section.
 *
 * **`asList` changes semantics, not just layout.** As a list it renders
 * `<ul>`/`<li>` with `role="menuitem"` links for the mobile menu; otherwise it
 * renders them inline for the desktop bar. Pick it to match the surrounding
 * structure, not the appearance you want.
 *
 * A link is active on an exact path match **or** on a path beneath it, so a
 * championship detail page keeps "Championships" highlighted while `/searchfoo`
 * never matches `/search`.
 *
 * The link set comes from the `navItems` constant rather than props — adding a
 * destination is a change there, and it appears in both layouts at once.
 * `onClick` exists so the mobile menu can close itself on navigation.
 */
export function NavLinks({
  onClick,
  asList = false,
  className = "",
}: NavLinksProps) {
  const pathname = usePathname();
  const t = useTranslations("navigation");

  const renderLink = React.useCallback(
    (item: (typeof navItems)[number]) => {
      // The trailing slash is what keeps "/championships/12" active without
      // letting "/search" also match a sibling like "/searchfoo".
      const isActive =
        pathname === item.href || pathname.startsWith(`${item.href}/`);

      const mobileStyles = cn(
        "block w-full text-left px-4 py-3 text-lg rounded-button transition-all duration-200",
        isActive
          ? "bg-primary-subtle text-primary-strong font-semibold border-l-4 border-primary"
          : "text-text-emphasis hover:bg-surface-inset hover:text-text-heading",
      );

      const desktopStyles = cn(
        "px-4 py-2 rounded-button font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        "focus:ring-offset-2 ring-offset-surface",
        isActive
          ? "bg-primary-subtle text-primary-strong font-semibold shadow-sm"
          : "text-text-emphasis hover:bg-surface-inset hover:text-text-heading",
      );

      const linkProps: React.ComponentProps<typeof Link> & {
        "aria-current"?: string;
        role?: string;
        "data-testid"?: string;
        onClick?: () => void;
      } = {
        href: item.href,
        className: asList ? mobileStyles : desktopStyles,
        "aria-current": isActive ? "page" : undefined,
        role: asList ? "menuitem" : undefined,
        "data-testid": `nav-link-${item.href.replace("/", "-") || "home"}`,
      };

      if (onClick) linkProps.onClick = onClick;

      return <Link {...linkProps}>{t(item.labelKey)}</Link>;
    },
    [pathname, t, onClick, asList],
  );

  const links = navItems.map((item) =>
    asList ? (
      <li key={item.href} role="none">
        {renderLink(item)}
      </li>
    ) : (
      <React.Fragment key={item.href}>{renderLink(item)}</React.Fragment>
    ),
  );

  return (
    <nav aria-label={t("header.mainNavAriaLabel")}>
      {asList ? (
        <ul className={cn("space-y-1", className)} data-testid="nav-list">
          {links}
        </ul>
      ) : (
        <div className={cn(className)} data-testid="nav-inline">
          {links}
        </div>
      )}
    </nav>
  );
}

export default NavLinks;
