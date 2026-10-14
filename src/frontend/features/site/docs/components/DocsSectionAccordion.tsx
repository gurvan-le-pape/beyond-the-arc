// src/frontend/features/site/docs/components/DocsSectionAccordion.tsx
import type { LucideIcon } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface DocsSectionAccordionProps {
  readonly id: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly isActive: boolean;
  readonly onToggle: (id: string) => void;
  readonly children: React.ReactNode;
}

/**
 * One collapsible documentation section.
 *
 * **Fully controlled** — `isActive` and `onToggle` live in the parent, which is
 * what lets it enforce one-open-at-a-time. Wiring `onToggle` to local state
 * instead gives independent sections and loses that.
 *
 * `id` is not just a key: it is echoed into `aria-controls`, so it must match
 * the panel's id or the button announces a relationship to nothing.
 */
export function DocsSectionAccordion({
  id,
  icon: Icon,
  title,
  isActive,
  onToggle,
  children,
}: DocsSectionAccordionProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      {/* Accordion button — hover steps up to surface-raised via inset */}
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center gap-4 p-6 text-left hover:bg-surface-inset transition-colors duration-200 focus-ring-inset"
        aria-expanded={isActive}
        aria-controls={`docs-section-${id}`}
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-button bg-primary-subtle flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-strong" aria-hidden />
        </div>
        <Text
          variant="label"
          as="span"
          className="flex-grow text-lg md:text-xl"
        >
          {title}
        </Text>
        {isActive ? (
          <ChevronDown
            className="w-5 h-5 text-text-muted transition-transform duration-200"
            aria-hidden
          />
        ) : (
          <ChevronRight
            className="w-5 h-5 text-text-muted transition-transform duration-200"
            aria-hidden
          />
        )}
      </button>

      {isActive && (
        <div
          id={`docs-section-${id}`}
          className="px-6 pb-6 border-t border-divide pt-6"
        >
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {children}
          </div>
        </div>
      )}
    </Card>
  );
}
