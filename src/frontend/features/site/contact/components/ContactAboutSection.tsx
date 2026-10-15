// src/frontend/features/site/contact/components/ContactAboutSection.tsx
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

const TECH_STACK = [
  { name: "Next.js", color: "bg-tint-primary text-ink-primary" },
  { name: "NestJS", color: "bg-success-subtle text-success-strong" },
  { name: "TypeScript", color: "bg-info-subtle text-info-strong" },
  { name: "PostgreSQL", color: "bg-tint-secondary text-ink-secondary" },
] as const;

interface ContactAboutSectionProps {
  readonly title: string;
  readonly description: string;
}

/**
 * The prose block beneath the contact methods.
 *
 * Copy only — both strings arrive already translated, so this holds no message
 * keys and renders identically in every locale it is given.
 */
export function ContactAboutSection({
  title,
  description,
}: ContactAboutSectionProps) {
  return (
    <Card padding="lg">
      <Text variant="h2" className="mb-4 text-xl">
        {title}
      </Text>
      <Text variant="body" className="mb-4">
        {description}
      </Text>
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
    </Card>
  );
}
