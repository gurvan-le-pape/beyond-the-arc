// src/frontend/shared/components/navigation/Breadcrumb.tsx
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/navigation";
import { cn } from "@/shared/utils";

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
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.current || isLast;

          return (
            <li key={item.label} className="flex items-center gap-2">
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
                <Link
                  href={item.href}
                  className="text-primary hover:text-primary-strong hover:underline transition-colors duration-200 focus-ring rounded-button"
                >
                  {item.label}
                </Link>
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

export default Breadcrumb;
