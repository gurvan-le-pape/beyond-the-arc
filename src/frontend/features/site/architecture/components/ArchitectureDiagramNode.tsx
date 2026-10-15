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
 * One box in the architecture diagram: icon, title, and a technology subtitle.
 */
export function ArchitectureDiagramNode({
  icon: Icon,
  title,
  subtitle,
  tone,
}: ArchitectureDiagramNodeProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`${STACK_TONE_CLASSES[tone]} rounded-button p-6 w-48 text-center shadow-card`}
      >
        <Icon className="w-12 h-12 mx-auto mb-3" />
        <Text variant="h3" className="text-inherit">
          {title}
        </Text>
        <p className="text-sm mt-2">{subtitle}</p>
      </div>
    </div>
  );
}
