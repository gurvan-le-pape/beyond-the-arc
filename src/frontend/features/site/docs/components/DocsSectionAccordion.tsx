// src/frontend/features/site/docs/components/DocsSectionAccordion.tsx
import type { LucideIcon } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Text } from "@/shared/components/typography";

interface DocsSectionAccordionProps {
  readonly id: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly isActive: boolean;
  readonly onToggle: (id: string) => void;
  readonly children: React.ReactNode;
}

export function DocsSectionAccordion({
  id,
  icon: Icon,
  title,
  isActive,
  onToggle,
  children,
}: DocsSectionAccordionProps) {
  return (
    <div className="surface-subtle rounded-card border border-divide shadow-card overflow-hidden">
      {/* Accordion button — hover steps up to surface-raised via inset */}
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center gap-4 p-6 text-left hover:bg-surface-inset transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
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
    </div>
  );
}
