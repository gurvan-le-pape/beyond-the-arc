// src/frontend/shared/components/ui/composite/Section.tsx
import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

import { Card } from "../primitives/Card";

interface SectionTitleProps {
  title: ReactNode;
  className?: string;
}

/**
 * Internal: Section title component
 * Not exported - use Section's title prop instead
 */
function SectionTitle({ title, className }: SectionTitleProps) {
  return (
    <h2
      className={cn(
        "text-xl font-bold text-gray-900 dark:text-gray-100 mb-6",
        className,
      )}
    >
      {title}
    </h2>
  );
}

interface SectionProps {
  title?: ReactNode;
  children: ReactNode;
  variant?: "default" | "highlighted";
  className?: string;
}

/**
 * Section component
 * Wraps content in a Card with optional title
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
