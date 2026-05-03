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
import { getTranslations } from "next-intl/server";
import React from "react";

import { PageHero, PageLayout } from "@/shared/components/layout";
import { Text } from "@/shared/components/typography";

export default async function ArchitecturePage({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });

  const techStacks = [
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
          name: "TypeScript 5.7",
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
          name: "i18next",
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
          name: "Prisma 6",
          icon: Database,
          description: t("architecture.backend.prismaDesc"),
        },
        {
          name: "PostgreSQL",
          icon: Database,
          description: t("architecture.backend.pgDesc"),
        },
        {
          name: "TypeScript 5.7",
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

      {/* Tech Stack Cards — sit on surface-base, so use surface-subtle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {techStacks.map((stack) => {
          const Icon = stack.icon;
          return (
            <div
              key={stack.title}
              className="bg-surface-subtle rounded-card border border-divide shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden"
            >
              {/* Card Header — decorative gradient, intentional */}
              <div className={`bg-gradient-to-r ${stack.color} p-6 text-white`}>
                <div className="flex items-center gap-3">
                  <Icon className="w-8 h-8" />
                  <Text variant="h2" className="text-white text-xl">
                    {stack.title}
                  </Text>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {stack.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={item.name}
                      className="flex items-start gap-3 p-3 rounded-button bg-surface-raised border border-transparent hover:border-divide transition-colors duration-200"
                    >
                      <ItemIcon className="w-5 h-5 text-text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <Text variant="h3" className="text-base">
                          {item.name}
                        </Text>
                        <Text variant="caption">{item.description}</Text>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Architecture Diagram */}
      <div className="bg-surface-subtle rounded-card border border-divide shadow-card p-8">
        <Text variant="h2" className="mb-6 text-center text-xl">
          {t("architecture.systemArchitecture")}
        </Text>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Client — decorative gradient, intentional */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-button p-6 w-48 text-center shadow-card">
              <Globe className="w-12 h-12 mx-auto mb-3" />
              <Text variant="h3" className="text-white">
                {t("architecture.diagram.client")}
              </Text>
              <p className="text-sm mt-2">Next.js + React</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:block text-text-muted">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Server — decorative gradient, intentional */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-button p-6 w-48 text-center shadow-card">
              <Server className="w-12 h-12 mx-auto mb-3" />
              <Text variant="h3" className="text-white">
                {t("architecture.diagram.server")}
              </Text>
              <p className="text-sm mt-2">NestJS + REST</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:block text-text-muted">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Database — decorative gradient, intentional */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-button p-6 w-48 text-center shadow-card">
              <Database className="w-12 h-12 mx-auto mb-3" />
              <Text variant="h3" className="text-white">
                {t("architecture.diagram.database")}
              </Text>
              <p className="text-sm mt-2">PostgreSQL</p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-button bg-primary-subtle text-primary-600 mb-3">
              <Package className="w-6 h-6" />
            </div>
            <Text variant="h3" className="mb-2 text-base">
              {t("architecture.features.modular.title")}
            </Text>
            <Text variant="caption">
              {t("architecture.features.modular.description")}
            </Text>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-button bg-success-subtle text-success mb-3">
              <Code2 className="w-6 h-6" />
            </div>
            <Text variant="h3" className="mb-2 text-base">
              {t("architecture.features.typeSafety.title")}
            </Text>
            <Text variant="caption">
              {t("architecture.features.typeSafety.description")}
            </Text>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-button bg-clubs-subtle text-clubs mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <Text variant="h3" className="mb-2 text-base">
              {t("architecture.features.scalable.title")}
            </Text>
            <Text variant="caption">
              {t("architecture.features.scalable.description")}
            </Text>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
