// src/frontend/shared/components/navigation/Breadcrumb.tsx
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/shared/utils";

import { TextLink } from "../primitives/TextLink";

export interface BreadcrumbItem {
  label: string;
  /** Omit on the current page — the last item is treated as current anyway. */
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  readonly items: BreadcrumbItem[];
  readonly separator?: React.ReactNode;
  readonly className?: string;
}

/**
 * Breadcrumb trail.
 *
 * Every ancestor is a real page, so every ancestor is a real `<Link>`: the
 * trail is crawlable, middle-clickable and openable in a new tab, and none of
 * it needs to reach the browser as JavaScript. A server component — it renders
 * static markup and nothing else.
 *
 * @example
 * <Breadcrumb
 *   items={[
 *     { label: "Organizations", href: "/organizations" },
 *     { label: "Clubs", href: "/organizations/clubs" },
 *     { label: club.name, current: true },
 *   ]}
 * />
 */
export function Breadcrumb({
  items,
  separator,
  className = "",
}: BreadcrumbProps) {
  const tCommon = useTranslations("common");

  const defaultSeparator = (
    <ChevronRight className="w-4 h-4 text-text-muted" aria-hidden="true" />
  );

  return (
    <nav
      className={cn("mb-6 flex items-center gap-2 text-sm", className)}
      aria-label={tCommon("breadcrumbAriaLabel")}
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.current || isLast;

          return (
            // Keyed by link where there is one: a team without a number is
            // named exactly like its club, so two labels can repeat.
            <li
              key={item.href ?? item.label}
              className="flex items-center gap-2"
            >
              {isCurrent || !item.href ? (
                <span
                  className={
                    isCurrent
                      ? "text-text-heading font-semibold"
                      : "text-text-body"
                  }
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <TextLink href={item.href}>{item.label}</TextLink>
              )}

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
