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
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import { PageHero, PageLayout } from "@/shared/components/layout";
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
      <PageHero
        title={t("docs.title")}
        lead={t("docs.intro")}
        icon={BookOpen}
      />

      {/* Quick Links — sit on surface-base, establish surface-subtle context */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          {
            href: "https://github.com/gurvan-le-pape/beyond-the-arc",
            external: true,
            icon: <Github className="w-6 h-6 text-text-body" />,
            label: t("docs.quickLinks.github"),
            sub: t("docs.quickLinks.viewSource"),
            trail: <ExternalLink className="w-4 h-4 ml-auto text-text-muted" />,
          },
          {
            href: "/docs/data-model.pdf",
            download: true,
            icon: <Download className="w-6 h-6 text-text-body" />,
            label: t("docs.quickLinks.dataModel"),
            sub: "PDF",
          },
          {
            href: `${process.env.NEXT_PUBLIC_API_URL?.replace(
              "/api",
              "",
            )}/docs`,
            external: true,
            icon: <BookOpen className="w-6 h-6 text-text-body" />,
            label: t("docs.quickLinks.apiDocs"),
            sub: "Swagger",
            trail: <ExternalLink className="w-4 h-4 ml-auto text-text-muted" />,
          },
          {
            href: "mailto:gurvan.lepape@hotmail.fr",
            icon: <span className="w-6 h-6">📧</span>,
            label: t("docs.quickLinks.contact"),
            sub: t("docs.quickLinks.getHelp"),
          },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            {...(link.download ? { download: true } : {})}
            className="surface-subtle flex items-center gap-3 p-4 rounded-card border border-divide shadow-card hover:shadow-card-hover transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface"
          >
            {link.icon}
            <div className="flex flex-col">
              <Text variant="label">{link.label}</Text>
              <Text variant="muted">{link.sub}</Text>
            </div>
            {link.trail}
          </a>
        ))}
      </div>

      {/* Documentation Sections */}
      <div className="space-y-4 mb-12">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <div
              key={section.id}
              className="surface-subtle rounded-card border border-divide shadow-card overflow-hidden"
            >
              {/* Accordion button — hover steps up to surface-raised via inset */}
              <button
                onClick={() => setActiveSection(isActive ? null : section.id)}
                className="w-full flex items-center gap-4 p-6 text-left hover:bg-surface-inset transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-button bg-primary-subtle flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-strong" />
                </div>
                <Text
                  variant="label"
                  as="span"
                  className="flex-grow text-lg md:text-xl"
                >
                  {section.title}
                </Text>
                {isActive ? (
                  <ChevronDown className="w-5 h-5 text-text-muted transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-text-muted transition-transform duration-200" />
                )}
              </button>

              {isActive && (
                <div className="px-6 pb-6 border-t border-divide pt-6">
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    {section.id === "database" && (
                      <div className="space-y-6">
                        <Text variant="body">{section.content}</Text>

                        {/* Database Diagram — establishes surface-raised context */}
                        <div className="surface-raised rounded-button p-6 border border-divide">
                          <div className="flex justify-between items-center mb-4">
                            <Text variant="h3">
                              {t("docs.database.diagramTitle")}
                            </Text>
                            <div className="flex gap-2">
                              <a
                                href="/docs/data-model.pdf"
                                download
                                className="px-3 py-1 bg-primary-strong text-white rounded-button text-sm hover:bg-primary-bold transition-colors duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface"
                              >
                                <Download className="w-4 h-4" />
                                PDF
                              </a>
                              <a
                                href="/docs/data-model.svg"
                                download
                                className="px-3 py-1 bg-success text-white rounded-button text-sm hover:bg-success-strong transition-colors duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 ring-offset-surface"
                              >
                                <Download className="w-4 h-4" />
                                SVG
                              </a>
                            </div>
                          </div>
                          {/* Image wrapper — sits inside surface-raised, inset stays at raised (ceiling) */}
                          <div className="bg-surface-inset rounded-button overflow-hidden">
                            <TransformWrapper
                              initialScale={0.5}
                              minScale={0.2}
                              maxScale={3}
                            >
                              {({ zoomIn, zoomOut, resetTransform }) => (
                                <>
                                  <div className="flex gap-2 mb-2">
                                    <button
                                      onClick={() => zoomIn()}
                                      className="px-3 py-1 bg-primary-strong text-white rounded-button text-sm"
                                    >
                                      +
                                    </button>
                                    <button
                                      onClick={() => zoomOut()}
                                      className="px-3 py-1 bg-primary-strong text-white rounded-button text-sm"
                                    >
                                      -
                                    </button>
                                    <button
                                      onClick={() => resetTransform()}
                                      className="px-3 py-1 bg-primary-strong text-white rounded-button text-sm"
                                    >
                                      {t("docs.reset")}
                                    </button>
                                  </div>
                                  <TransformComponent
                                    wrapperStyle={{
                                      width: "100%",
                                      height: "500px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <img
                                      src="/docs/data-model.svg"
                                      alt={t("docs.database.diagramAlt")}
                                    />
                                  </TransformComponent>
                                </>
                              )}
                            </TransformWrapper>
                          </div>
                        </div>

                        {/* Key Tables — sit inside surface-subtle, inset resolves to surface-raised */}
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
                                className="p-3 bg-surface-inset rounded-button border border-divide"
                              >
                                <code className="text-sm font-mono text-primary-strong block">
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

                        <div>
                          <Text variant="h3" className="mb-3">
                            {t("docs.structure.backend")}
                          </Text>
                          {/* Code block — intentional dark bg for readability */}
                          <pre className="bg-gray-900 text-gray-100 p-6 rounded-button overflow-x-auto text-sm">
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

                        <div>
                          <Text variant="h3" className="mb-3">
                            {t("docs.structure.frontend")}
                          </Text>
                          {/* Code block — intentional dark bg for readability */}
                          <pre className="bg-gray-900 text-gray-100 p-6 rounded-button overflow-x-auto text-sm">
                            {t("docs.structure.frontendCode")}
                          </pre>
                          <ul className="list-disc pl-6 text-sm text-text-secondary mt-2 space-y-1">
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
                              <div className="flex-shrink-0 w-6 h-6 rounded-button bg-success-subtle flex items-center justify-center mt-0.5">
                                <span className="text-success-strong text-sm">
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
                        {/* Code block — intentional dark bg for readability */}
                        <div className="bg-gray-900 text-gray-100 p-6 rounded-button">
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
