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
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Section — a titled block of a detail page, laid flat on the page.
 *
 * The page's header is its one framed card; sections below it take their
 * structure from their title and the space between them, so their content
 * gets the full width of the page. Content inside sits on the page surface
 * and uses surface-raised components (InfoBox, Input) where it needs a fill.
 */
export function Section({ title, children, className }: SectionProps) {
  return (
    <section className={className}>
      {title && <SectionTitle title={title} />}
      {children}
    </section>
  );
}
