// src/frontend/features/site/architecture/components/tech-stacks/index.tsx
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bug,
  CalendarClock,
  Code2,
  Container,
  Database,
  FileCode2,
  GitBranch,
  Globe,
  Languages,
  Layers,
  Palette,
  RefreshCw,
  Server,
  Shield,
  Wrench,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Grid } from "@/shared/components/primitives";

import type { StackTone } from "../../constants";
import { TechStackCard } from "./TechStackCard";

/**
 * The static half of a tech-stack column: everything that is not translated.
 *
 * `TechStackItemConfig` (in `TechStackCard`) is the *resolved* shape the card
 * receives, with `description` already a string. This is the shape before
 * `TechStacks` resolves it, so the two are deliberately not the same type.
 */
interface TechStackItemSpec {
  readonly name: string;
  readonly icon: LucideIcon;
  readonly descriptionKey: string;
}

interface TechStackSpec {
  readonly titleKey: string;
  readonly icon: LucideIcon;
  readonly tone: StackTone;
  readonly items: readonly TechStackItemSpec[];
}

/**
 * The three stack columns, in display order.
 *
 * Product names (`Next.js 15`, `Prisma 7`) are deliberately untranslated — they
 * are proper nouns, not copy, so they live here rather than in the catalogue.
 * The versions are the ones the manifests and images lock; bump them here when
 * a major lands, since nothing checks this against `package.json` or the
 * compose file.
 */
export const TECH_STACKS = [
  {
    titleKey: "architecture.frontendTitle",
    icon: Globe,
    tone: "primary",
    items: [
      {
        name: "Next.js 15",
        icon: Layers,
        descriptionKey: "architecture.frontend.nextjsDesc",
      },
      {
        name: "TypeScript 6",
        icon: Code2,
        descriptionKey: "architecture.frontend.tsDesc",
      },
      {
        name: "Tailwind CSS 3",
        icon: Palette,
        descriptionKey: "architecture.frontend.tailwindDesc",
      },
      {
        name: "TanStack Query 5",
        icon: RefreshCw,
        descriptionKey: "architecture.frontend.reactQueryDesc",
      },
      {
        name: "next-intl 4",
        icon: Languages,
        descriptionKey: "architecture.frontend.i18nDesc",
      },
    ],
  },
  {
    titleKey: "architecture.backendTitle",
    icon: Server,
    tone: "secondary",
    items: [
      {
        name: "NestJS 11",
        icon: Server,
        descriptionKey: "architecture.backend.nestjsDesc",
      },
      {
        name: "Prisma 7",
        icon: Layers,
        descriptionKey: "architecture.backend.prismaDesc",
      },
      {
        name: "PostgreSQL 18",
        icon: Database,
        descriptionKey: "architecture.backend.pgDesc",
      },
      {
        name: "Python 3.14",
        icon: CalendarClock,
        descriptionKey: "architecture.backend.pythonDesc",
      },
      {
        name: "OpenAPI",
        icon: FileCode2,
        descriptionKey: "architecture.backend.openapiDesc",
      },
    ],
  },
  {
    titleKey: "architecture.devopsTitle",
    icon: Wrench,
    tone: "category",
    items: [
      {
        name: "Docker Compose",
        icon: Container,
        descriptionKey: "architecture.devops.composeDesc",
      },
      {
        name: "Cloudflare & Nginx",
        icon: Shield,
        descriptionKey: "architecture.devops.edgeDesc",
      },
      {
        name: "GitLab CI",
        icon: GitBranch,
        descriptionKey: "architecture.devops.cicdDesc",
      },
      {
        name: "Sentry",
        icon: Bug,
        descriptionKey: "architecture.devops.sentryDesc",
      },
      {
        name: "Grafana",
        icon: Activity,
        descriptionKey: "architecture.devops.grafanaDesc",
      },
    ],
  },
  // `as const` rather than a type annotation: next-intl types message keys as a
  // literal union, so widening `descriptionKey` to `string` makes `t()` reject
  // it. `satisfies` still checks the shape without erasing the literals.
] as const satisfies readonly TechStackSpec[];

/**
 * The stack, one card per layer: frontend, backend and data, infrastructure.
 *
 * Resolves each layer's title and each technology's description from the
 * catalogue; the product names stay as written in `TECH_STACKS`.
 */
export function TechStacks() {
  const t = useTranslations("landing");

  return (
    <div className="mb-12">
      <Grid columns={{ base: 1, lg: 3 }} gap={8}>
        {TECH_STACKS.map((stack) => (
          <TechStackCard
            key={stack.titleKey}
            title={t(stack.titleKey)}
            icon={stack.icon}
            tone={stack.tone}
            items={stack.items.map((item) => ({
              name: item.name,
              icon: item.icon,
              description: t(item.descriptionKey),
            }))}
          />
        ))}
      </Grid>
    </div>
  );
}
