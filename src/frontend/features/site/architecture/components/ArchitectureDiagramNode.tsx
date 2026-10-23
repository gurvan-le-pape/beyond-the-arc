// src/frontend/features/site/architecture/components/ArchitectureDiagramNode.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

import { STACK_TONE_CLASSES, type StackTone } from "../constants";

interface ArchitectureDiagramNodeProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly subtitle: string;
  readonly tone: StackTone;
}

/**
 * One box in the architecture diagram: icon, its role, and the technology
 * that fills it. Narrow enough for five in a row from `lg`.
 */
export function ArchitectureDiagramNode({
  icon: Icon,
  title,
  subtitle,
  tone,
}: ArchitectureDiagramNodeProps) {
  return (
    <div
      className={`${STACK_TONE_CLASSES[tone]} flex w-32 shrink-0 flex-col items-center justify-center rounded-button p-4 text-center shadow-card`}
    >
      <Icon aria-hidden="true" className="mb-2 h-8 w-8" />
      <Text variant="h3" as="p" className="text-base text-inherit">
        {title}
      </Text>
      <p className="mt-1 text-xs">{subtitle}</p>
    </div>
  );
}
