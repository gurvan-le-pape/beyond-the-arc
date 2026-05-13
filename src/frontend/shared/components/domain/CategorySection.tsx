// src/frontend/shared/components/domain/CategorySection.tsx

import type { Category } from "@/shared/constants";
import { cn } from "@/shared/utils";

import { NavButton } from "../primitives";
import { Text } from "../typography";

function ChevronRight({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn("w-5 h-5", className)}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

interface CategorySectionProps<T extends { id: number | string }> {
  readonly category: Category;
  readonly items: T[];
  readonly categoryKey: string;
  readonly isExpanded: boolean;
  readonly toggleCategory: (key: string) => void;
  readonly renderItem: (item: T, index: number) => React.ReactNode;
  readonly emptyMessage: string;
}

/**
 * CategorySection
 *
 * An expandable/collapsible section that displays a list of items under a
 * category header. Used within GenderCategorizedList to organize items by
 * category (e.g., "U11", "U13", "U15").
 *
 * @template T - The type of items being displayed
 *
 * @example
 * <CategorySection
 *   category="U11"
 *   items={u11Teams}
 *   categoryKey="female-U11"
 *   isExpanded={true}
 *   toggleCategory={handleToggle}
 *   renderItem={(team, index) => <TeamListItem team={team} />}
 *   emptyMessage="No teams in this category"
 * />
 *
 * Features:
 * - Click header to expand/collapse
 * - Item count badge
 * - Chevron icon animation
 * - Customizable empty state message
 * - Fully accessible (ARIA attributes)
 * - Dark mode support
 */
export function CategorySection<T extends { id: number | string }>({
  category,
  items,
  categoryKey,
  isExpanded,
  toggleCategory,
  renderItem,
  emptyMessage,
}: CategorySectionProps<T>) {
  const contentId = `items-list-${categoryKey}`;

  return (
    <div>
      {/* Toggle header */}
      <NavButton
        variant="categoryHeader"
        size="auto"
        onClick={() => toggleCategory(categoryKey)}
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        <ChevronRight
          className={cn(
            "text-text-muted transition-transform duration-200",
            isExpanded && "rotate-90",
          )}
        />
        <Text variant="h4" as="span">
          {category}
        </Text>
        <Text
          variant="caption"
          as="span"
          className="font-medium bg-surface-inset rounded-full px-2 py-0.5"
        >
          {items.length}
        </Text>
      </NavButton>

      {/* Collapsible body */}
      {isExpanded && (
        <div
          id={contentId}
          className="mt-2 ml-7 rounded-card border border-divide surface-raised shadow-card overflow-hidden"
        >
          {items.length > 0 ? (
            <ul>
              {items.map((item, i) => (
                <li
                  key={item.id}
                  className="border-b border-divide last:border-b-0"
                >
                  {renderItem(item, i)}
                </li>
              ))}
            </ul>
          ) : (
            <Text variant="muted" as="p" className="py-5 px-4 text-center">
              {emptyMessage}
            </Text>
          )}
        </div>
      )}
    </div>
  );
}
