// src/frontend/shared/components/blocks/Section.tsx
import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

import { Card } from "../primitives/Card";
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
  readonly variant?: "default" | "highlighted";
  readonly className?: string;
}

/**
 * Section — a titled Card block.
 *
 * Sits at surface-subtle elevation (Card). Content inside should use
 * surface-raised components (InfoBox, Input) — not another Card.
 */
export function Section({
  title,
  children,
  variant = "default",
  className,
}: SectionProps) {
  return (
    <Card variant={variant} padding="lg" className={className}>
      {title && <SectionTitle title={title} />}
      {children}
    </Card>
  );
}
