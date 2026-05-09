// src/frontend/features/site/docs/components/DocsQuickLinkCard.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

interface DocsQuickLinkCardProps {
  readonly href: string;
  readonly icon: LucideIcon;
  readonly label: string;
  readonly sub: string;
  readonly external?: boolean;
  readonly download?: boolean;
  readonly trailIcon?: LucideIcon;
}

export function DocsQuickLinkCard({
  href,
  icon: Icon,
  label,
  sub,
  external,
  download,
  trailIcon: TrailIcon,
}: DocsQuickLinkCardProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...(download ? { download: true } : {})}
      className="surface-subtle flex items-center gap-3 p-4 rounded-card border border-divide shadow-card hover:shadow-card-hover transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface"
    >
      <Icon className="w-6 h-6 text-text-body" aria-hidden />
      <div className="flex flex-col">
        <Text variant="label">{label}</Text>
        <Text variant="muted">{sub}</Text>
      </div>
      {TrailIcon && (
        <TrailIcon className="w-4 h-4 ml-auto text-text-muted" aria-hidden />
      )}
    </a>
  );
}
