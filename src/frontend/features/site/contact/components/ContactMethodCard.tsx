// src/frontend/features/site/contact/components/ContactMethodCard.tsx
import type { LucideIcon } from "lucide-react";

import { Text } from "@/shared/components/typography";

interface ContactMethodCardProps {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly value: string;
  readonly href: string;
  readonly color: string;
}

export function ContactMethodCard({
  icon: Icon,
  label,
  value,
  href,
  color,
}: ContactMethodCardProps) {
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="surface-subtle rounded-card border border-divide shadow-card hover:shadow-card-hover transition-all duration-200 p-6 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface"
    >
      {/* Contact icon — decorative gradient, intentional */}
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-button bg-gradient-to-br ${color} text-white mb-4 shadow-sm group-hover:scale-110 transition-transform duration-200`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <Text variant="h3" className="mb-2 text-base">
        {label}
      </Text>
      <Text variant="caption" className="break-all">
        {value}
      </Text>
    </a>
  );
}
