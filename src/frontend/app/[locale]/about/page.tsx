// src/frontend/app/[locale]/about/page.tsx
import {
  Boxes,
  FileCode2,
  Globe,
  Recycle,
  Target,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  AboutCtaSection,
  PrincipleCard,
} from "@/features/site/about/components";
import { PageHero, PageLayout } from "@/shared/components/layout";
import type { LocalePageProps } from "@/shared/types";

const PRINCIPLES_CONFIG = [
  { icon: Boxes, principleKey: "modular", color: "from-blue-500 to-cyan-500" },
  {
    icon: FileCode2,
    principleKey: "separation",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Recycle,
    principleKey: "reusability",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    principleKey: "scalability",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Users,
    principleKey: "readability",
    color: "from-indigo-500 to-blue-500",
  },
  { icon: Globe, principleKey: "i18n", color: "from-cyan-500 to-teal-500" },
  {
    icon: Wrench,
    principleKey: "tooling",
    color: "from-yellow-500 to-orange-500",
  },
] as const;

export default async function AboutPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "landing" });

  const principles = PRINCIPLES_CONFIG.map((p) => ({
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
        featuresLabel={t("about.viewFeatures")}
        architectureLabel={t("about.viewArchitecture")}
        locale={locale}
      />
    </PageLayout>
  );
}
