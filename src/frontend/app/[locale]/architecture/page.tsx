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

import { Footer, Header } from "@/shared/components/layouts";

export default async function ArchitecturePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });

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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-title md:text-display font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t("architecture.title")}
            </h1>
            <p className="text-body-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("architecture.subtitle")}
            </p>
          </div>

          {/* Tech Stack Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {techStacks.map((stack, idx) => {
              const Icon = stack.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-card border border-gray-200 dark:border-gray-700 shadow-card hover:shadow-card-hover dark:shadow-card-dark transition-all duration-200 overflow-hidden"
                >
                  {/* Card Header */}
                  <div
                    className={`bg-gradient-to-r ${stack.color} p-6 text-white`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-8 h-8" />
                      <h2 className="text-subtitle font-bold">{stack.title}</h2>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {stack.items.map((item, itemIdx) => {
                      const ItemIcon = item.icon;
                      return (
                        <div
                          key={itemIdx}
                          className="flex items-start gap-3 p-3 rounded-button bg-gray-50 dark:bg-gray-700/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-colors duration-200"
                        >
                          <ItemIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {item.name}
                            </h3>
                            <p className="text-body-sm text-gray-600 dark:text-gray-400">
                              {item.description}
                            </p>
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
          <div className="bg-white dark:bg-gray-800 rounded-card border border-gray-200 dark:border-gray-700 shadow-card dark:shadow-card-dark p-8">
            <h2 className="text-subtitle font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
              {t("architecture.systemArchitecture")}
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Client */}
              <div className="flex flex-col items-center">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-button p-6 w-48 text-center shadow-card">
                  <Globe className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="font-bold text-body-lg">
                    {t("architecture.diagram.client")}
                  </h3>
                  <p className="text-body-sm mt-2">Next.js + React</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:block text-gray-400 dark:text-gray-600">
                <svg
                  className="w-12 h-12"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Server */}
              <div className="flex flex-col items-center">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-button p-6 w-48 text-center shadow-card">
                  <Server className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="font-bold text-body-lg">
                    {t("architecture.diagram.server")}
                  </h3>
                  <p className="text-body-sm mt-2">NestJS + REST</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:block text-gray-400 dark:text-gray-600">
                <svg
                  className="w-12 h-12"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Database */}
              <div className="flex flex-col items-center">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-button p-6 w-48 text-center shadow-card">
                  <Database className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="font-bold text-body-lg">
                    {t("architecture.diagram.database")}
                  </h3>
                  <p className="text-body-sm mt-2">PostgreSQL</p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-button bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mb-3">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t("architecture.features.modular.title")}
                </h3>
                <p className="text-body-sm text-gray-600 dark:text-gray-400">
                  {t("architecture.features.modular.description")}
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-button bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 mb-3">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t("architecture.features.typeSafety.title")}
                </h3>
                <p className="text-body-sm text-gray-600 dark:text-gray-400">
                  {t("architecture.features.typeSafety.description")}
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-button bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 mb-3">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {t("architecture.features.scalable.title")}
                </h3>
                <p className="text-body-sm text-gray-600 dark:text-gray-400">
                  {t("architecture.features.scalable.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
