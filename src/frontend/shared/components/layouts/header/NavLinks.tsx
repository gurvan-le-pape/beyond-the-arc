// src/frontend/shared/components/layouts/header/NavLinks.tsx
"use client";

import classNames from "classnames";
import { useTranslations } from "next-intl";
import React from "react";

import { usePathname } from "@/navigation";
import { Link } from "@/navigation";
import { navItems } from "@/shared/constants/navConfig";
import type { NavItem } from "@/shared/types";

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

  // Renders a single navigation link with correct styles and accessibility
  const renderLink = React.useCallback(
    (item: NavItem) => {
      const isActive =
        pathname === item.href ||
        (item.href !== "/" && pathname.startsWith(item.href));

      const mobileStyles = classNames(
        "block w-full text-left px-4 py-3 text-lg rounded-button transition-all duration-200",
        {
          "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold border-l-4 border-primary-600 dark:border-primary-400":
            isActive,
          "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100":
            !isActive,
        },
      );

      const desktopStyles = classNames(
        "px-4 py-2 rounded-button font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
        {
          "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-semibold shadow-sm":
            isActive,
          "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100":
            !isActive,
        },
      );

      // Build props for the Link component
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

  // No need for useMemo, map directly
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
    <nav aria-label="Main navigation">
      {asList ? (
        <ul
          className={classNames(className, "space-y-1")}
          data-testid="nav-list"
        >
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
