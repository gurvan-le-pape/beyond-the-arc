// src/frontend/features/site/docs/components/sections/DocsDatabaseSection.tsx
"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import { Button, Grid } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";

const DATABASE_TABLES = [
  { name: "Championships", descKey: "docs.database.tables.championships" },
  { name: "Teams", descKey: "docs.database.tables.teams" },
  { name: "Players", descKey: "docs.database.tables.players" },
  { name: "Matches", descKey: "docs.database.tables.matches" },
  { name: "Clubs", descKey: "docs.database.tables.clubs" },
  { name: "MatchEvents", descKey: "docs.database.tables.matchEvents" },
] as const;

interface DocsDatabaseSectionProps {
  readonly content: string;
}

/**
 * The database chapter of the docs page: the ERD image and its explanation.
 *
 * `content` is a single already-translated string; this adds no copy of its
 * own. The diagram is a static asset, so a schema change updates the image
 * separately from this component and the two can drift.
 */
export function DocsDatabaseSection({ content }: DocsDatabaseSectionProps) {
  const t = useTranslations("landing");

  return (
    <div className="space-y-6">
      <Text variant="body">{content}</Text>

      {/* Database Diagram — establishes surface-raised context */}
      <div className="surface-raised rounded-button p-6 border border-divide">
        <div className="flex justify-between items-center mb-4">
          <Text variant="h3" as="h3">
            {t("docs.database.diagramTitle")}
          </Text>
          <div className="flex gap-2">
            <a
              href="/docs/data-model.pdf"
              download
              className="px-3 py-1 bg-solid-primary text-on-solid-primary rounded-button text-sm hover:bg-solid-primary-hover transition-colors duration-200 flex items-center gap-1 focus-ring"
            >
              <Download className="w-4 h-4" aria-hidden />
              PDF
            </a>
            <a
              href="/docs/data-model.svg"
              download
              className="px-3 py-1 bg-solid-success text-on-solid-success rounded-button text-sm hover:bg-solid-success-hover transition-colors duration-200 flex items-center gap-1 focus-ring"
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
                    onPress={() => zoomIn(0.1)}
                    aria-label={t("docs.database.zoomIn")}
                  >
                    +
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onPress={() => zoomOut(0.1)}
                    aria-label={t("docs.database.zoomOut")}
                  >
                    -
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onPress={() => resetTransform()}
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
                  {/* SVG served as-is: next/image cannot optimize SVG without
                      dangerouslyAllowSVG, and this one is pan/zoomed by
                      react-zoom-pan-pinch at its intrinsic size. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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

      {/* Key Tables */}
      <div>
        <Text variant="h3" as="h3" className="mb-3">
          {t("docs.database.keyTables")}
        </Text>
        <Grid columns={{ base: 1, md: 2 }} gap={3}>
          {DATABASE_TABLES.map((table) => (
            <div
              key={table.name}
              className="p-3 bg-surface-inset rounded-button border border-divide"
            >
              <code className="text-sm font-mono text-ink-primary block">
                {table.name}
              </code>
              <Text variant="caption" className="mt-1 block">
                {t(table.descKey)}
              </Text>
            </div>
          ))}
        </Grid>
      </div>
    </div>
  );
}
