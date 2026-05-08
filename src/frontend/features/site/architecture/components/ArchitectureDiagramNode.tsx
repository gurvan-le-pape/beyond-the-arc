// src/frontend/features/site/architecture/components/ArchitectureDiagramNode.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

interface ArchitectureDiagramNodeProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly subtitle: string;
  readonly color: string;
}

export function ArchitectureDiagramNode({
  icon: Icon,
  title,
  subtitle,
  color,
}: ArchitectureDiagramNodeProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`bg-gradient-to-br ${color} text-white rounded-button p-6 w-48 text-center shadow-card`}
      >
        <Icon className="w-12 h-12 mx-auto mb-3" />
        <Text variant="h3" className="text-white">
          {title}
        </Text>
        <p className="text-sm mt-2">{subtitle}</p>
      </div>
    </div>
  );
}
