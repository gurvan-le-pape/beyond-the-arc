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

import { Footer, Header } from "@/shared/components/layouts";

export default function DocsPage() {
  const t = useTranslations("footer");
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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-button bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-4 shadow-card">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t("docs.title")}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("docs.intro")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <a
              href="https://github.com/gurvan-le-pape/beyond-the-arc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-card border border-gray-200 dark:border-gray-700 shadow-card hover:shadow-card-hover dark:shadow-card-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            >
              <Github className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {t("docs.quickLinks.github")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("docs.quickLinks.viewSource")}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
            </a>

            <a
              href="/docs/data-model.pdf"
              download
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-card border border-gray-200 dark:border-gray-700 shadow-card hover:shadow-card-hover dark:shadow-card-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            >
              <Download className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {t("docs.quickLinks.dataModel")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF</p>
              </div>
            </a>

            <a
              href="http://localhost:4000/api"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-card border border-gray-200 dark:border-gray-700 shadow-card hover:shadow-card-hover dark:shadow-card-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            >
              <BookOpen className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {t("docs.quickLinks.apiDocs")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Swagger
                </p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
            </a>

            <a
              href="mailto:gurvan.lepape@hotmail.fr"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-card border border-gray-200 dark:border-gray-700 shadow-card hover:shadow-card-hover dark:shadow-card-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            >
              <div className="w-6 h-6 text-gray-600 dark:text-gray-400">📧</div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {t("docs.quickLinks.contact")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("docs.quickLinks.getHelp")}
                </p>
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
                  className="bg-white dark:bg-gray-800 rounded-card border border-gray-200 dark:border-gray-700 shadow-card dark:shadow-card-dark overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setActiveSection(isActive ? null : section.id)
                    }
                    className="w-full flex items-center gap-4 p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-button bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 className="flex-grow text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                      {section.title}
                    </h2>
                    {isActive ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 transition-transform duration-200" />
                    )}
                  </button>

                  {isActive && (
                    <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                      <div className="prose prose-gray dark:prose-invert max-w-none">
                        {section.id === "database" && (
                          <div className="space-y-6">
                            <p className="text-body text-gray-600 dark:text-gray-400">
                              {section.content}
                            </p>

                            {/* Database Diagram */}
                            <div className="bg-gray-100 dark:bg-gray-900 rounded-button p-6 border border-gray-200 dark:border-gray-700">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                  {t("docs.database.diagramTitle")}
                                </h3>
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
                              <div className="bg-white dark:bg-gray-800 rounded-button overflow-hidden">
                                <img
                                  src="/docs/data-model.svg"
                                  alt={t("docs.database.diagramAlt")}
                                  className="w-full h-auto"
                                />
                              </div>
                            </div>

                            {/* Key Tables */}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                {t("docs.database.keyTables")}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                  {
                                    name: "Championships",
                                    desc: t(
                                      "docs.database.tables.championships",
                                    ),
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
                                ].map((table, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-button border border-gray-200 dark:border-gray-700"
                                  >
                                    <code className="text-sm font-mono text-primary-600 dark:text-primary-400">
                                      {table.name}
                                    </code>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                      {table.desc}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {section.id === "structure" && (
                          <div className="space-y-6">
                            <p className="text-body text-gray-600 dark:text-gray-400">
                              {section.content}
                            </p>

                            {/* Backend Structure */}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                {t("docs.structure.backend")}
                              </h3>
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
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                {t("docs.structure.frontend")}
                              </h3>
                              <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-6 rounded-button overflow-x-auto text-sm">
                                {t("docs.structure.frontendCode")}
                              </pre>
                              <ul className="list-disc pl-6 text-sm text-gray-400 dark:text-gray-500 mt-2 space-y-1">
                                <li>
                                  {t("docs.structure.routingExplanation")}
                                </li>
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
                            <p className="text-body text-gray-600 dark:text-gray-400">
                              {section.content}
                            </p>
                            <ul className="space-y-3">
                              {[
                                t("docs.bestPractices.modular"),
                                t("docs.bestPractices.typeScript"),
                                t("docs.bestPractices.testing"),
                                t("docs.bestPractices.documentation"),
                                t("docs.bestPractices.gitWorkflow"),
                                t("docs.bestPractices.codeReview"),
                              ].map((practice, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-3"
                                >
                                  <div className="flex-shrink-0 w-6 h-6 rounded-button bg-success-light/20 dark:bg-success-dark/20 flex items-center justify-center mt-0.5">
                                    <span className="text-success-dark dark:text-success-light text-sm">
                                      ✓
                                    </span>
                                  </div>
                                  <span className="text-body text-gray-600 dark:text-gray-400">
                                    {practice}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {section.id === "getting-started" && (
                          <div className="space-y-4">
                            <p className="text-body text-gray-600 dark:text-gray-400">
                              {section.content}
                            </p>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
