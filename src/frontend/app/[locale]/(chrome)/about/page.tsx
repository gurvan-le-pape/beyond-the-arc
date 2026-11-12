// src/frontend/app/[locale]/(chrome)/about/page.tsx
import { Target } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  AboutData,
  AboutLinks,
  AboutStack,
} from "@/features/site/about/components";
import { statsService } from "@/features/stats/api";
import { withServerErrorState } from "@/shared/components/feedback";
import { PageHero, PageLayout } from "@/shared/components/layout";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError } from "@/shared/utils";

// Fetches server-side, so it stays out of the prerender pass - the image build
// has no backend. The counts are cached by `request`, so a render here is a
// cache read, not a query.
export const dynamic = "force-dynamic";

/**
 * Metadata for the about page.
 *
 * Next calls this separately from the page, so a fetch failure here is not caught by the page's own error handling — hence the `withServerErrorMetadata` wrapper where one fetches.
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "landing" });

  return { title: tMeta("about.title"), description: tMeta("about.intro") };
}

/**
 * The about page: what the project is, which of its data is real and which is
 * simulated, how it is built, and where to read more.
 *
 * The counts come from `/stats`, so they follow the data rather than going
 * stale in the copy.
 */
async function AboutPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "landing" });

  const stats = await statsService.getStats().catch(handleServerError);

  return (
    <PageLayout contentClassName="max-w-3xl">
      <PageHero
        title={t("about.title")}
        lead={t("about.intro")}
        icon={Target}
      />

      <div className="space-y-6">
        <AboutData stats={stats} />
        <AboutStack />
        <AboutLinks />
      </div>
    </PageLayout>
  );
}

export default withServerErrorState(AboutPage);
