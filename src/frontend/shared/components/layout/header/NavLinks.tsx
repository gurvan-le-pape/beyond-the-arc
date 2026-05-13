// src/frontend/shared/components/layout/header/NavLinks.tsx
"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { Link, usePathname } from "@/navigation";
import { navItems } from "@/shared/constants";
import type { NavItem } from "@/shared/types";
import { cn } from "@/shared/utils";

interface NavLinksProps {
  onClick?: () => void;
  asList?: boolean;
  className?: string;
}

export const NavLinks: React.FC<NavLinksProps> = ({
  onClick,
  asList = false,
  className = "",
}) => {
  const pathname = usePathname();
  const t = useTranslations("navigation");

  const renderLink = React.useCallback(
    (item: NavItem) => {
      const isActive =
        pathname === item.href ||
        (item.href !== "/" && pathname.startsWith(item.href));

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

  const links = navItems.map((item: NavItem) =>
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
        <ul className={cn(className, "space-y-1")} data-testid="nav-list">
          {links}
        </ul>
      ) : (
        <div className={className} data-testid="nav-inline">
          {links}
        </div>
      )}
    </nav>
  );
};

export default NavLinks;
