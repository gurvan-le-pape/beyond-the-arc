// src/frontend/shared/components/blocks/Section.tsx
import type { ReactNode } from "react";

import { cn } from "@/shared/utils";

import { Text } from "../typography";

interface SectionTitleProps {
  readonly title: ReactNode;
  readonly className?: string;
}

function SectionTitle({ title, className }: SectionTitleProps) {
  // h2 = text-2xl font-semibold text-heading — right level for a page section
  return (
    <Text variant="h2" className={cn("mb-6", className)}>
      {title}
    </Text>
  );
}

interface SectionProps {
  readonly title?: ReactNode;
  /** Beside the title, at the far end: a link onward, such as "Full table". */
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Section — a titled block of a detail page, laid flat on the page.
 *
 * The page's header is its one filled card; sections below it take their
 * structure from their title and the space between them, so their content
 * gets the full width of the page. Content inside sits on the page surface
 * with a border at most — an InfoBox, a Card, a table draw their own frame,
 * which bounds them, not the section. A fill belongs only to what floats over
 * the page or takes input (an input, a dropdown, a modal).
 */
export function Section({ title, action, children, className }: SectionProps) {
  return (
    <section className={className}>
      {title && action ? (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-6">
          <SectionTitle title={title} className="mb-0" />
          {action}
        </div>
      ) : (
        title && <SectionTitle title={title} />
      )}
      {children}
    </section>
  );
}
