// src/frontend/features/site/contact/components/ContactAboutSection.tsx
import { Text } from "@/shared/components/typography";

const TECH_STACK = [
  { name: "Next.js", color: "bg-primary-subtle text-primary-strong" },
  { name: "NestJS", color: "bg-success-subtle text-success-strong" },
  { name: "TypeScript", color: "bg-info-subtle text-info-strong" },
  { name: "PostgreSQL", color: "bg-secondary-faint text-secondary-bold" },
] as const;

interface ContactAboutSectionProps {
  readonly title: string;
  readonly description: string;
}

export function ContactAboutSection({
  title,
  description,
}: ContactAboutSectionProps) {
  return (
    <div className="surface-subtle rounded-card border border-divide shadow-card p-8">
      <Text variant="h2" className="mb-4 text-xl">
        {title}
      </Text>
      <Text variant="body" className="mb-4">
        {description}
      </Text>
      {/* Tech stack chips */}
      <div className="flex flex-wrap gap-2">
        {TECH_STACK.map((tech) => (
          <span
            key={tech.name}
            className={`px-3 py-1 rounded-button text-sm font-medium border border-divide ${tech.color}`}
          >
            {tech.name}
          </span>
        ))}
      </div>
    </div>
  );
}
