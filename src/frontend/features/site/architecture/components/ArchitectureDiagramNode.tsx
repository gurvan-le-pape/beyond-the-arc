// src/frontend/features/site/architecture/components/ArchitectureDiagramNode.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

interface ArchitectureDiagramNodeProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly subtitle: string;
  readonly color: string;
}

/**
 * One box in the architecture diagram: icon, title, and a technology subtitle.
 *
 * `color` is a **raw Tailwind gradient class pair** (`from-… to-…`), not a
 * semantic token, interpolated straight into the class string. It must be a
 * complete literal — Tailwind only generates classes it can see written out,
 * so a value assembled at runtime produces no gradient at all. Decorative by
 * design; the token system does not cover these.
 */
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
