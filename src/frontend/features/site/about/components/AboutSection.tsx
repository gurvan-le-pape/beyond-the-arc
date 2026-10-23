// src/frontend/features/site/about/components/AboutSection.tsx
import type { ReactNode } from "react";

import { Card } from "@/shared/components/primitives";

interface AboutSectionProps {
  readonly title: string;
  readonly children: ReactNode;
}

/** One titled block of the about page, its paragraphs as `children`. */
export function AboutSection({ title, children }: AboutSectionProps) {
  return (
    <Card padding="lg" heading={title}>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}
