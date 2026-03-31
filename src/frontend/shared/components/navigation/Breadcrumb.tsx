// src/frontend/shared/components/navigation/Breadcrumb.tsx
"use client";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { useRouter } from "@/navigation";

export interface BreadcrumbItem {
  label: string;
  href?: string; // If provided, it's clickable
  onClick?: () => void; // Alternative to href
  current?: boolean; // Last item in breadcrumb
}

interface BreadcrumbProps {
  readonly items: BreadcrumbItem[];
  readonly separator?: React.ReactNode;
  readonly className?: string;
}

/**
 * Generic Breadcrumb Component
 *
 * Renders a breadcrumb navigation trail with clickable links and current page indicator.
 *
 * @example
 * <Breadcrumb
 *   items={[
 *     { label: "France", href: "/clubs" },
 *     { label: "Bretagne", href: "/clubs/league/1" },
 *     { label: "Finistère", href: "/clubs/league/1/committee/29" },
 *     { label: "Club ABC", current: true }
 *   ]}
 * />
 */
export function Breadcrumb({
  items,
  separator,
  className = "",
}: BreadcrumbProps) {
  const router = useRouter();
  const tCommon = useTranslations("common");

  const defaultSeparator = (
    <ChevronRightIcon
      className="w-4 h-4 text-text-muted dark:text-text-muted-dark"
      aria-hidden="true"
    />
  );

  const handleClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <nav
      className={`mb-6 flex items-center gap-2 text-sm ${className}`}
      aria-label={tCommon("breadcrumbAriaLabel")}
    >
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.current || isLast;
          const isClickable = !isCurrent && (item.href || item.onClick);

          return (
            <li key={item.label} className="flex items-center gap-2">
              {/* Breadcrumb Item */}
              {isClickable ? (
                <button
                  onClick={() => handleClick(item)}
                  className="text-primary-600 hover:text-primary-700 hover:underline dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-surface-raised dark:focus:ring-offset-surface-raised-dark rounded-button"
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {item.label}
                </button>
              ) : (
                <span
                  className={
                    isCurrent
                      ? "text-text-heading dark:text-text-heading-dark font-semibold"
                      : "text-text-body dark:text-text-body-dark"
                  }
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}

              {/* Separator */}
              {!isLast && (
                <span className="flex items-center">
                  {separator || defaultSeparator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
