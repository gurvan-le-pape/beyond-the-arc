// src/frontend/app/[locale]/(chrome)/architecture/page.tsx
import { Code2, Database, Globe, Layers, Package, Server } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  ArchitectureArrow,
  ArchitectureDiagramNode,
  FeatureBadge,
  TechStackCard,
} from "@/features/site/architecture/components";
import { TECH_STACKS } from "@/features/site/architecture/constants";
import { PageHero, PageLayout } from "@/shared/components/layout";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
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
 * The architecture page: the stack, the request diagram, and the key properties.
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
    color: stack.color,
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
      <Card padding="lg">
        <Text variant="h2" className="mb-6 text-center text-xl">
          {t("architecture.systemArchitecture")}
        </Text>
        {/* Every `color` below is a decorative gradient, deliberately raw
            palette values rather than semantic tokens. */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <ArchitectureDiagramNode
            icon={Globe}
            title={t("architecture.diagram.client")}
            subtitle="Next.js + React"
            color="from-blue-500 to-cyan-500"
          />

          <ArchitectureArrow />

          <ArchitectureDiagramNode
            icon={Server}
            title={t("architecture.diagram.server")}
            subtitle="NestJS + REST"
            color="from-green-500 to-emerald-500"
          />

          <ArchitectureArrow />

          <ArchitectureDiagramNode
            icon={Database}
            title={t("architecture.diagram.database")}
            subtitle="PostgreSQL"
            color="from-purple-500 to-pink-500"
          />
        </div>

        {/* Key Features — icon badges use bg-surface-inset, resolves to surface-raised */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureBadge
            icon={Package}
            iconClassName="bg-tint-primary text-ink-primary"
            title={t("architecture.features.modular.title")}
            description={t("architecture.features.modular.description")}
          />
          <FeatureBadge
            icon={Code2}
            iconClassName="bg-success-subtle text-success"
            title={t("architecture.features.typeSafety.title")}
            description={t("architecture.features.typeSafety.description")}
          />
          <FeatureBadge
            icon={Layers}
            iconClassName="bg-clubs-subtle text-clubs"
            title={t("architecture.features.scalable.title")}
            description={t("architecture.features.scalable.description")}
          />
        </div>
      </Card>
    </PageLayout>
  );
}
