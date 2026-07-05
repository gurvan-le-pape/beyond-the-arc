// src/frontend/features/site/docs/components/sections/DocsDatabaseSection.tsx
"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import { Button } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

const DATABASE_TABLES = [
  { name: "Championships", descKey: "docs.database.tables.championships" },
  { name: "Teams", descKey: "docs.database.tables.teams" },
  { name: "Players", descKey: "docs.database.tables.players" },
  { name: "Matches", descKey: "docs.database.tables.matches" },
  { name: "Clubs", descKey: "docs.database.tables.clubs" },
  { name: "Stats", descKey: "docs.database.tables.stats" },
] as const;

interface DocsDatabaseSectionProps {
  readonly content: string;
}

export function DocsDatabaseSection({ content }: DocsDatabaseSectionProps) {
  const t = useTranslations("landing");

  return (
    <div className="space-y-6">
      <Text variant="body">{content}</Text>

      {/* Database Diagram — establishes surface-raised context */}
      <div className="surface-raised rounded-button p-6 border border-divide">
        <div className="flex justify-between items-center mb-4">
          <Text variant="h3">{t("docs.database.diagramTitle")}</Text>
          <div className="flex gap-2">
            <a
              href="/docs/data-model.pdf"
              download
              className="px-3 py-1 bg-primary-strong text-white rounded-button text-sm hover:bg-primary-bold transition-colors duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface"
            >
              <Download className="w-4 h-4" aria-hidden />
              PDF
            </a>
            <a
              href="/docs/data-model.svg"
              download
              className="px-3 py-1 bg-success text-white rounded-button text-sm hover:bg-success-strong transition-colors duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 ring-offset-surface"
            >
              <Download className="w-4 h-4" aria-hidden />
              SVG
            </a>
          </div>
        </div>

        {/* Image wrapper — sits inside surface-raised, inset stays at raised (ceiling) */}
        <div className="bg-surface-inset rounded-button overflow-hidden">
          <TransformWrapper
            initialScale={0.8}
            minScale={0.2}
            maxScale={3}
            wheel={{ step: 0.001 }}
            centerOnInit
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="flex gap-2 mb-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => zoomIn(0.1)}
                    aria-label={t("docs.database.zoomIn")}
                  >
                    +
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => zoomOut(0.1)}
                    aria-label={t("docs.database.zoomOut")}
                  >
                    -
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => resetTransform()}
                    aria-label={t("docs.reset")}
                  >
                    {t("docs.reset")}
                  </Button>
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
          {DATABASE_TABLES.map((table) => (
            <div
              key={table.name}
              className="p-3 bg-surface-inset rounded-button border border-divide"
            >
              <code className="text-sm font-mono text-primary-strong block">
                {table.name}
              </code>
              <Text variant="muted" className="mt-1 block">
                {t(table.descKey)}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
