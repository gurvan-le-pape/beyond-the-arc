// src/frontend/app/[locale]/(chrome)/about/page.tsx
import { Target } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  AboutCtaSection,
  PrincipleCard,
} from "@/features/site/about/components";
import { PRINCIPLES } from "@/features/site/about/constants";
import { PageHero, PageLayout } from "@/shared/components/layout";
import type { LocalePageProps } from "@/shared/types";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "landing" });

  return { title: tMeta("about.title"), description: tMeta("about.intro") };
}

export default async function AboutPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "landing" });

  const principles = PRINCIPLES.map((p) => ({
    icon: p.icon,
    color: p.color,
    title: t(`about.${p.principleKey}.title`),
    description: t(`about.${p.principleKey}.description`),
  }));

  return (
    <PageLayout>
      <PageHero
        title={t("about.title")}
        lead={t("about.intro")}
        icon={Target}
      />

      {/* Engineering Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {principles.map((principle) => (
          <PrincipleCard key={principle.title} {...principle} />
        ))}
      </div>

      {/* Call to Action */}
      <AboutCtaSection
        title={t("about.exploreTitle")}
        description={t("about.explore")}
        productLabel={t("about.viewProduct")}
        architectureLabel={t("about.viewArchitecture")}
      />
    </PageLayout>
  );
}
