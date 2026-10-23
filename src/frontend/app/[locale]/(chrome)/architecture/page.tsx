// src/frontend/app/[locale]/(chrome)/architecture/page.tsx
import {
  CalendarClock,
  Database,
  Eye,
  FileCode2,
  Globe,
  Layers,
  Monitor,
  Server,
  Shield,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  ArchitectureArrow,
  ArchitectureDiagramNode,
  DiagramLane,
  FeatureBadge,
  TechStackCard,
} from "@/features/site/architecture/components";
import { TECH_STACKS } from "@/features/site/architecture/constants";
import { PageHero, PageLayout } from "@/shared/components/layout";
import { Card } from "@/shared/components/primitives";
import type { LocalePageProps } from "@/shared/types";

/**
 * Metadata for the architecture page.
 *
 * Next calls this separately from the page, so a fetch failure here is not caught by the page's own error handling — hence the `withServerErrorMetadata` wrapper where one fetches.
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "landing" });

  return {
    title: tMeta("architecture.title"),
    description: tMeta("architecture.subtitle"),
  };
}

/**
 * The architecture page: the stack, the diagram of a page request and of the
 * match data, and three facts about how it runs.
 *
 * `params` is a Promise in Next 15 and is awaited here, so the feature
 * components below receive plain values.
 */
export default async function ArchitecturePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "landing" });

  const techStacks = TECH_STACKS.map((stack) => ({
    title: t(stack.titleKey),
    icon: stack.icon,
    tone: stack.tone,
    items: stack.items.map((item) => ({
      name: item.name,
      icon: item.icon,
      description: t(item.descriptionKey),
    })),
  }));

  return (
    <PageLayout>
      <PageHero
        title={t("architecture.title")}
        lead={t("architecture.subtitle")}
        icon={Layers}
      />

      {/* Tech Stack Cards — sit on surface-base, establish surface-subtle context */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {techStacks.map((stack) => (
          <TechStackCard
            key={stack.title}
            title={stack.title}
            icon={stack.icon}
            tone={stack.tone}
            items={stack.items}
          />
        ))}
      </div>

      {/* Architecture Diagram — sits on surface-base, establishes surface-subtle context */}
      <Card padding="lg" heading={t("architecture.systemArchitecture")}>
        <div className="space-y-8">
          <DiagramLane label={t("architecture.diagram.requestLane")}>
            <ArchitectureDiagramNode
              icon={Monitor}
              title={t("architecture.diagram.browser")}
              subtitle="beyondthearc.app"
              tone="neutral"
            />
            <ArchitectureArrow />
            <ArchitectureDiagramNode
              icon={Shield}
              title={t("architecture.diagram.proxy")}
              subtitle="Cloudflare + Nginx"
              tone="category"
            />
            <ArchitectureArrow />
            <ArchitectureDiagramNode
              icon={Globe}
              title={t("architecture.diagram.webServer")}
              subtitle="Next.js"
              tone="primary"
            />
            <ArchitectureArrow />
            <ArchitectureDiagramNode
              icon={Server}
              title={t("architecture.diagram.api")}
              subtitle="NestJS + Prisma"
              tone="secondary"
            />
            <ArchitectureArrow />
            <ArchitectureDiagramNode
              icon={Database}
              title={t("architecture.diagram.database")}
              subtitle="PostgreSQL"
              tone="secondary"
            />
          </DiagramLane>

          <DiagramLane label={t("architecture.diagram.dataLane")}>
            <ArchitectureDiagramNode
              icon={CalendarClock}
              title={t("architecture.diagram.scheduler")}
              subtitle="Python"
              tone="secondary"
            />
            <ArchitectureArrow />
            <ArchitectureDiagramNode
              icon={Database}
              title={t("architecture.diagram.database")}
              subtitle="PostgreSQL"
              tone="secondary"
            />
          </DiagramLane>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureBadge
            icon={FileCode2}
            title={t("architecture.features.contract.title")}
            description={t("architecture.features.contract.description")}
          />
          <FeatureBadge
            icon={Eye}
            title={t("architecture.features.readOnly.title")}
            description={t("architecture.features.readOnly.description")}
          />
          <FeatureBadge
            icon={Server}
            title={t("architecture.features.oneServer.title")}
            description={t("architecture.features.oneServer.description")}
          />
        </div>
      </Card>
    </PageLayout>
  );
}
