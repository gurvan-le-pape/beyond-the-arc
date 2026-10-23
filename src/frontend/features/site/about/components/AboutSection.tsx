// src/frontend/features/site/about/components/AboutSection.tsx
import type { ReactNode } from "react";

import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

interface AboutSectionProps {
  readonly title: string;
  readonly children: ReactNode;
}

/** One titled block of the about page, its paragraphs as `children`. */
export function AboutSection({ title, children }: AboutSectionProps) {
  return (
    <Card padding="lg">
      <Text variant="h2" className="mb-4">
        {title}
      </Text>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}
