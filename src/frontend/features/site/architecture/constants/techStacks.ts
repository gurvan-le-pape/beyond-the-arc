// src/frontend/features/site/architecture/constants/techStacks.ts
import type { LucideIcon } from "lucide-react";
import {
  Code2,
  Container,
  Database,
  GitBranch,
  Globe,
  Layers,
  Server,
  TestTube,
  Wrench,
} from "lucide-react";

import type { StackTone } from "./stackTones";

/**
 * The static half of a tech-stack column: everything that is not translated.
 *
 * `TechStackItemConfig` (in the components barrel) is the *resolved* shape the
 * card receives, with `description` already a string. This is the shape before
 * the page resolves it, so the two are deliberately not the same type.
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
 * The versions are the ones the manifests lock; bump them here when a major
 * lands, since nothing checks this against `package.json`.
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
        icon: Wrench,
        descriptionKey: "architecture.frontend.tailwindDesc",
      },
      {
        name: "React Query",
        icon: Database,
        descriptionKey: "architecture.frontend.reactQueryDesc",
      },
      {
        name: "next-intl",
        icon: Globe,
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
        icon: Database,
        descriptionKey: "architecture.backend.prismaDesc",
      },
      {
        name: "PostgreSQL",
        icon: Database,
        descriptionKey: "architecture.backend.pgDesc",
      },
      {
        name: "TypeScript 6",
        icon: Code2,
        descriptionKey: "architecture.backend.tsDesc",
      },
      {
        name: "RESTful API",
        icon: GitBranch,
        descriptionKey: "architecture.backend.restDesc",
      },
    ],
  },
  {
    titleKey: "architecture.devopsTitle",
    icon: Wrench,
    tone: "category",
    items: [
      {
        name: "Docker",
        icon: Container,
        descriptionKey: "architecture.devops.dockerDesc",
      },
      {
        name: "Docker Compose",
        icon: Layers,
        descriptionKey: "architecture.devops.composeDesc",
      },
      {
        name: "Jest",
        icon: TestTube,
        descriptionKey: "architecture.devops.jestDesc",
      },
      {
        name: "ESLint & Prettier",
        icon: Wrench,
        descriptionKey: "architecture.devops.lintDesc",
      },
      {
        name: "GitLab CI",
        icon: GitBranch,
        descriptionKey: "architecture.devops.cicdDesc",
      },
    ],
  },
  // `as const` rather than a type annotation: next-intl types message keys as a
  // literal union, so widening `descriptionKey` to `string` makes `t()` reject
  // it. `satisfies` still checks the shape without erasing the literals.
] as const satisfies readonly TechStackSpec[];
