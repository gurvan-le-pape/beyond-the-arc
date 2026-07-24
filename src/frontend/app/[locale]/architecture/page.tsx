// src/frontend/app/[locale]/architecture/page.tsx
import {
  Code2,
  Container,
  Database,
  GitBranch,
  Globe,
  Layers,
  Package,
  Server,
  TestTube,
  Wrench,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { TechStackItemConfig } from "@/features/site/architecture/components";
import {
  ArchitectureArrow,
  ArchitectureDiagramNode,
  FeatureBadge,
  TechStackCard,
} from "@/features/site/architecture/components";
import { PageHero, PageLayout } from "@/shared/components/layout";
import { Text } from "@/shared/components/typography";
import type { LocalePageProps } from "@/shared/types";

interface TechStackConfig {
  title: string;
  icon: typeof Globe;
  color: string;
  items: TechStackItemConfig[];
}

export default async function ArchitecturePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "landing" });

  const techStacks: TechStackConfig[] = [
    {
      title: t("architecture.frontendTitle"),
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      items: [
        {
          name: "Next.js 15",
          icon: Layers,
          description: t("architecture.frontend.nextjsDesc"),
        },
        {
          name: "TypeScript 6",
          icon: Code2,
          description: t("architecture.frontend.tsDesc"),
        },
        {
          name: "Tailwind CSS 3",
          icon: Wrench,
          description: t("architecture.frontend.tailwindDesc"),
        },
        {
          name: "React Query",
          icon: Database,
          description: t("architecture.frontend.reactQueryDesc"),
        },
        {
          name: "next-intl",
          icon: Globe,
          description: t("architecture.frontend.i18nDesc"),
        },
      ],
    },
    {
      title: t("architecture.backendTitle"),
      icon: Server,
      color: "from-green-500 to-emerald-500",
      items: [
        {
          name: "NestJS 11",
          icon: Server,
          description: t("architecture.backend.nestjsDesc"),
        },
        {
          name: "Prisma 7",
          icon: Database,
          description: t("architecture.backend.prismaDesc"),
        },
        {
          name: "PostgreSQL",
          icon: Database,
          description: t("architecture.backend.pgDesc"),
        },
        {
          name: "TypeScript 6",
          icon: Code2,
          description: t("architecture.backend.tsDesc"),
        },
        {
          name: "RESTful API",
          icon: GitBranch,
          description: t("architecture.backend.restDesc"),
        },
      ],
    },
    {
      title: t("architecture.devopsTitle"),
      icon: Wrench,
      color: "from-purple-500 to-pink-500",
      items: [
        {
          name: "Docker",
          icon: Container,
          description: t("architecture.devops.dockerDesc"),
        },
        {
          name: "Docker Compose",
          icon: Layers,
          description: t("architecture.devops.composeDesc"),
        },
        {
          name: "Jest",
          icon: TestTube,
          description: t("architecture.devops.jestDesc"),
        },
        {
          name: "ESLint & Prettier",
          icon: Wrench,
          description: t("architecture.devops.lintDesc"),
        },
        {
          name: "GitHub Actions",
          icon: GitBranch,
          description: t("architecture.devops.cicdDesc"),
        },
      ],
    },
  ];

  return (
    <PageLayout>
      <PageHero
        title={t("architecture.title")}
        lead={t("architecture.subtitle")}
        icon={Layers}
        iconGradient="secondary"
      />

      {/* Tech Stack Cards — sit on surface-base, establish surface-subtle context */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {techStacks.map((stack) => (
          <TechStackCard
            key={stack.title}
            title={stack.title}
            icon={stack.icon}
            color={stack.color}
            items={stack.items}
          />
        ))}
      </div>

      {/* Architecture Diagram — sits on surface-base, establishes surface-subtle context */}
      <div className="surface-subtle rounded-card border border-divide shadow-card p-8">
        <Text variant="h2" className="mb-6 text-center text-xl">
          {t("architecture.systemArchitecture")}
        </Text>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Client — decorative gradient, intentional */}
          <ArchitectureDiagramNode
            icon={Globe}
            title={t("architecture.diagram.client")}
            subtitle="Next.js + React"
            color="from-blue-500 to-cyan-500"
          />

          {/* Arrow */}
          <ArchitectureArrow />

          {/* Server — decorative gradient, intentional */}
          <ArchitectureDiagramNode
            icon={Server}
            title={t("architecture.diagram.server")}
            subtitle="NestJS + REST"
            color="from-green-500 to-emerald-500"
          />

          {/* Arrow */}
          <ArchitectureArrow />

          {/* Database — decorative gradient, intentional */}
          <ArchitectureDiagramNode
            icon={Database}
            title={t("architecture.diagram.database")}
            subtitle="PostgreSQL"
            color="from-purple-500 to-pink-500"
          />
        </div>

        {/* Key Features — icon badges use bg-surface-inset, resolves to surface-raised */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Modular architecture — feature badge */}
          <FeatureBadge
            icon={Package}
            iconClassName="bg-primary-subtle text-primary-strong"
            title={t("architecture.features.modular.title")}
            description={t("architecture.features.modular.description")}
          />
          {/* Type safety — feature badge */}
          <FeatureBadge
            icon={Code2}
            iconClassName="bg-success-subtle text-success"
            title={t("architecture.features.typeSafety.title")}
            description={t("architecture.features.typeSafety.description")}
          />
          {/* Scalable design — feature badge */}
          <FeatureBadge
            icon={Layers}
            iconClassName="bg-clubs-subtle text-clubs"
            title={t("architecture.features.scalable.title")}
            description={t("architecture.features.scalable.description")}
          />
        </div>
      </div>
    </PageLayout>
  );
}
