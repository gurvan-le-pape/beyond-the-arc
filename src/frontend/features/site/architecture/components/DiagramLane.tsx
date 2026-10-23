// src/frontend/features/site/architecture/components/DiagramLane.tsx
import type { ReactNode } from "react";

import { Text } from "@/shared/components/typography";

interface DiagramLaneProps {
  /** What flows along the lane ("A page request"). */
  readonly label: string;
  /** Its nodes and the arrows between them, in flow order. */
  readonly children: ReactNode;
}

/**
 * One path through the architecture diagram: a label over its nodes, which run
 * down the page below `lg` and across it from there.
 */
export function DiagramLane({ label, children }: DiagramLaneProps) {
  return (
    <div>
      <Text variant="label" as="p" className="mb-3 text-center">
        {label}
      </Text>
      <div className="flex flex-col items-center justify-center gap-3 lg:flex-row lg:items-stretch">
        {children}
      </div>
    </div>
  );
}
