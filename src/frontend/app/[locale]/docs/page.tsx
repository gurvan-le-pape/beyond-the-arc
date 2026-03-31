// src/frontend/app/[locale]/docs/page.tsx
"use client";

import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Database,
  Download,
  ExternalLink,
  FolderTree,
  Github,
  Lightbulb,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { PageLayout } from "@/shared/components/layout";
import { Text } from "@/shared/components/typography";

export default function DocsPage() {
  const t = useTranslations("landing");
  const [activeSection, setActiveSection] = useState<string | null>("database");

  const sections = [
    {
      id: "getting-started",
      icon: BookOpen,
      title: t("docs.sections.gettingStarted.title"),
      content: t("docs.sections.gettingStarted.content"),
    },
    {
      id: "database",
      icon: Database,
      title: t("docs.sections.database.title"),
      content: t("docs.sections.database.content"),
    },
    {
      id: "structure",
      icon: FolderTree,
      title: t("docs.sections.structure.title"),
      content: t("docs.sections.structure.content"),
    },
    {
      id: "best-practices",
      icon: Lightbulb,
      title: t("docs.sections.bestPractices.title"),
      content: t("docs.sections.bestPractices.content"),
    },
  ];

  return (
    <PageLayout>
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-button bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-4 shadow-card">
          <BookOpen className="w-8 h-8" />
        </div>
        <Text variant="h1" className="mb-4">
          {t("docs.title")}
        </Text>
        <Text variant="lead" className="max-w-2xl mx-auto">
          {t("docs.intro")}
        </Text>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <a
          href="https://github.com/gurvan-le-pape/beyond-the-arc"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 bg-surface-subtle dark:bg-surface-subtle-dark rounded-card border border-divide-light dark:border-divide-dark shadow-card hover:shadow-card-hover dark:shadow-card-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        >
          <Github className="w-6 h-6 text-text-body dark:text-text-body-dark" />
          <div className="flex flex-col">
            <Text variant="label">{t("docs.quickLinks.github")}</Text>
            <Text variant="muted">{t("docs.quickLinks.viewSource")}</Text>
          </div>
          <ExternalLink className="w-4 h-4 ml-auto text-text-muted dark:text-text-muted-dark" />
        </a>

        <a
          href="/docs/data-model.pdf"
          download
          className="flex items-center gap-3 p-4 bg-surface-subtle dark:bg-surface-subtle-dark rounded-card border border-divide-light dark:border-divide-dark shadow-card hover:shadow-card-hover dark:shadow-card-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        >
          <Download className="w-6 h-6 text-text-body dark:text-text-body-dark" />
          <div className="flex flex-col">
            <Text variant="label">{t("docs.quickLinks.dataModel")}</Text>
            <Text variant="muted">PDF</Text>
          </div>
        </a>

        <a
          href="http://localhost:4000/api"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 bg-surface-subtle dark:bg-surface-subtle-dark rounded-card border border-divide-light dark:border-divide-dark shadow-card hover:shadow-card-hover dark:shadow-card-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        >
          <BookOpen className="w-6 h-6 text-text-body dark:text-text-body-dark" />
          <div className="flex flex-col">
            <Text variant="label">{t("docs.quickLinks.apiDocs")}</Text>
            <Text variant="muted">Swagger</Text>
          </div>
          <ExternalLink className="w-4 h-4 ml-auto text-text-muted dark:text-text-muted-dark" />
        </a>

        <a
          href="mailto:gurvan.lepape@hotmail.fr"
          className="flex items-center gap-3 p-4 bg-surface-subtle dark:bg-surface-subtle-dark rounded-card border border-divide-light dark:border-divide-dark shadow-card hover:shadow-card-hover dark:shadow-card-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        >
          <div className="w-6 h-6 text-text-body dark:text-text-body-dark">
            📧
          </div>
          <div className="flex flex-col">
            <Text variant="label">{t("docs.quickLinks.contact")}</Text>
            <Text variant="muted">{t("docs.quickLinks.getHelp")}</Text>
          </div>
        </a>
      </div>

      {/* Documentation Sections */}
      <div className="space-y-4 mb-12">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <div
              key={section.id}
              className="bg-surface-subtle dark:bg-surface-subtle-dark rounded-card border border-divide-light dark:border-divide-dark shadow-card dark:shadow-card-dark overflow-hidden"
            >
              <button
                onClick={() => setActiveSection(isActive ? null : section.id)}
                className="w-full flex items-center gap-4 p-6 text-left hover:bg-surface-subtle dark:hover:bg-surface-raised-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-button bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <Text
                  variant="label"
                  as="span"
                  className="flex-grow text-lg md:text-xl"
                >
                  {section.title}
                </Text>
                {isActive ? (
                  <ChevronDown className="w-5 h-5 text-text-muted dark:text-text-muted-dark transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-text-muted dark:text-text-muted-dark transition-transform duration-200" />
                )}
              </button>

              {isActive && (
                <div className="px-6 pb-6 border-t border-divide-light dark:border-divide-dark pt-6">
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    {section.id === "database" && (
                      <div className="space-y-6">
                        <Text variant="body">{section.content}</Text>

                        {/* Database Diagram */}
                        <div className="bg-surface-subtle dark:bg-surface-raised-dark rounded-button p-6 border border-divide-light dark:border-divide-dark">
                          <div className="flex justify-between items-center mb-4">
                            <Text variant="h3">
                              {t("docs.database.diagramTitle")}
                            </Text>
                            <div className="flex gap-2">
                              <a
                                href="/docs/data-model.pdf"
                                download
                                className="px-3 py-1 bg-primary-600 text-white rounded-button text-sm hover:bg-primary-700 transition-colors duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                              >
                                <Download className="w-4 h-4" />
                                PDF
                              </a>
                              <a
                                href="/docs/data-model.svg"
                                download
                                className="px-3 py-1 bg-success-DEFAULT text-white rounded-button text-sm hover:bg-success-dark transition-colors duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-success-DEFAULT"
                              >
                                <Download className="w-4 h-4" />
                                SVG
                              </a>
                            </div>
                          </div>
                          <div className="bg-surface-subtle dark:bg-surface-subtle-dark rounded-button overflow-hidden">
                            <img
                              src="/docs/data-model.svg"
                              alt={t("docs.database.diagramAlt")}
                              className="w-full h-auto"
                            />
                          </div>
                        </div>

                        {/* Key Tables */}
                        <div>
                          <Text variant="h3" className="mb-3">
                            {t("docs.database.keyTables")}
                          </Text>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                              {
                                name: "Championships",
                                desc: t("docs.database.tables.championships"),
                              },
                              {
                                name: "Teams",
                                desc: t("docs.database.tables.teams"),
                              },
                              {
                                name: "Players",
                                desc: t("docs.database.tables.players"),
                              },
                              {
                                name: "Matches",
                                desc: t("docs.database.tables.matches"),
                              },
                              {
                                name: "Clubs",
                                desc: t("docs.database.tables.clubs"),
                              },
                              {
                                name: "Stats",
                                desc: t("docs.database.tables.stats"),
                              },
                            ].map((table) => (
                              <div
                                key={table.name}
                                className="p-3 bg-surface-subtle dark:bg-surface-raised-dark rounded-button border border-divide-light dark:border-divide-dark"
                              >
                                <code className="text-sm font-mono text-primary-600 dark:text-primary-400 block">
                                  {table.name}
                                </code>
                                <Text variant="muted" className="mt-1 block">
                                  {table.desc}
                                </Text>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {section.id === "structure" && (
                      <div className="space-y-6">
                        <Text variant="body">{section.content}</Text>

                        {/* Backend Structure */}
                        <div>
                          <Text variant="h3" className="mb-3">
                            {t("docs.structure.backend")}
                          </Text>
                          <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-6 rounded-button overflow-x-auto text-sm">
                            {`backend/
├── modules/
│   ├── competitions/    # Championships & tournaments
│   ├── geography/       # Regions & departments
│   ├── matches/         # Match management
│   ├── organizations/   # Leagues, committees, clubs
│   ├── players/         # Player management
│   └── teams/           # Team management
├── common/              # Shared utilities
├── prisma/              # Prisma service
└── config/              # Configuration`}
                          </pre>
                        </div>

                        {/* Frontend Structure */}
                        <div>
                          <Text variant="h3" className="mb-3">
                            {t("docs.structure.frontend")}
                          </Text>
                          <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-6 rounded-button overflow-x-auto text-sm">
                            {t("docs.structure.frontendCode")}
                          </pre>
                          <ul className="list-disc pl-6 text-sm text-text-secondary dark:text-text-secondary-dark mt-2 space-y-1">
                            <li>{t("docs.structure.routingExplanation")}</li>
                            <li>{t("docs.structure.featurePrinciple")}</li>
                            <li>{t("docs.structure.sharedExplanation")}</li>
                            <li>{t("docs.structure.libExplanation")}</li>
                            <li>{t("docs.structure.stylesExplanation")}</li>
                            <li>{t("docs.structure.publicExplanation")}</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {section.id === "best-practices" && (
                      <div className="space-y-4">
                        <Text variant="body">{section.content}</Text>
                        <ul className="space-y-3">
                          {[
                            t("docs.bestPractices.modular"),
                            t("docs.bestPractices.typeScript"),
                            t("docs.bestPractices.testing"),
                            t("docs.bestPractices.documentation"),
                            t("docs.bestPractices.gitWorkflow"),
                            t("docs.bestPractices.codeReview"),
                          ].map((practice) => (
                            <li
                              key={practice}
                              className="flex items-start gap-3"
                            >
                              <div className="flex-shrink-0 w-6 h-6 rounded-button bg-success-light/20 dark:bg-success-dark/20 flex items-center justify-center mt-0.5">
                                <span className="text-success-dark dark:text-success-light text-sm">
                                  ✓
                                </span>
                              </div>
                              <Text variant="body" as="span">
                                {practice}
                              </Text>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {section.id === "getting-started" && (
                      <div className="space-y-4">
                        <Text variant="body">{section.content}</Text>
                        <div className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-6 rounded-button">
                          <pre className="text-sm overflow-x-auto">
                            {`# Clone the repository
git clone https://github.com/gurvan-le-pape/beyond-the-arc.git

# Install dependencies
cd beyond-the-arc
npm install

# Setup database
docker-compose up -d
npm run prisma:migrate

# Start development server
npm run dev`}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
