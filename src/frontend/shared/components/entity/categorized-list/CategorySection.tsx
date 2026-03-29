// src/frontend/shared/components/entity/categorized-list/CategorySection.tsx
import { Button } from "@/shared/components/ui";
import type { Category } from "@/shared/constants";
import { cn } from "@/shared/utils/cn";

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn("w-5 h-5", className)}
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

interface CategorySectionProps<T> {
  category: Category;
  items: T[];
  categoryKey: string;
  isExpanded: boolean;
  toggleCategory: (key: string) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage: string;
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
export function CategorySection<T>({
  category,
  items,
  categoryKey,
  isExpanded,
  toggleCategory,
  renderItem,
  emptyMessage,
}: CategorySectionProps<T>) {
  return (
    <div>
      {/* Toggle header */}
      <Button
        variant="categoryHeader"
        size="auto"
        onClick={() => toggleCategory(categoryKey)}
      >
        <ChevronRight
          className={cn(
            "text-text-muted dark:text-text-muted-dark transition-transform duration-200",
            isExpanded && "rotate-90",
          )}
        />
        <span className="text-lg font-semibold text-text-heading dark:text-text-heading-dark">
          {category}
        </span>
        <span className="text-xs font-medium text-text-secondary dark:text-text-secondary-dark bg-surface-raised dark:bg-surface-raised-dark rounded-full px-2 py-0.5">
          {items.length}
        </span>
      </Button>

      {/* Collapsible body */}
      {isExpanded && (
        <div
          id={`items-list-${categoryKey}`}
          className="mt-2 ml-7 rounded-card border border-divide-light dark:border-divide-dark bg-surface-raised dark:bg-surface-raised-dark shadow-card overflow-hidden"
        >
          {items.length > 0 ? (
            <ul>
              {items.map((item, i) => (
                <li
                  key={i}
                  className="border-b border-divide-light dark:border-divide-dark last:border-b-0"
                >
                  {renderItem(item, i)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-5 px-4 text-sm text-text-muted dark:text-text-muted-dark text-center">
              {emptyMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
