// src/frontend/app/[locale]/(chrome)/about/page.tsx
import { Target } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import {
  type AboutLink,
  AboutLinks,
  AboutSection,
} from "@/features/site/about/components";
import { statsService } from "@/features/stats/api";
import { withServerErrorState } from "@/shared/components/feedback";
import { PageHero, PageLayout } from "@/shared/components/layout";
import { TextLink } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { GITLAB_REPO_URL } from "@/shared/constants";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError } from "@/shared/utils";

// Fetches server-side, so it stays out of the prerender pass - the image build
// has no backend. The counts are cached by `request`, so a render here is a
// cache read, not a query.
export const dynamic = "force-dynamic";

type LinkKey = "product" | "architecture" | "docs" | "source";

/** `t.rich` renderer linking a message's chunk to the architecture page. */
function architectureLink(chunks: ReactNode) {
  return <TextLink href="/architecture">{chunks}</TextLink>;
}

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
  const { national, regional, departmental } = stats.championshipsByLevel;

  const linkCopy = (key: LinkKey) => ({
    label: t(`about.links.${key}.label`),
    description: t(`about.links.${key}.description`),
  });

  const links: AboutLink[] = [
    { href: "/product", ...linkCopy("product") },
    { href: "/architecture", ...linkCopy("architecture") },
    { href: "/docs", ...linkCopy("docs") },
    { href: GITLAB_REPO_URL, external: true, ...linkCopy("source") },
  ];

  return (
    <PageLayout contentClassName="max-w-3xl">
      <PageHero
        title={t("about.title")}
        lead={t("about.intro")}
        icon={Target}
      />

      <div className="space-y-6">
        <AboutSection title={t("about.data.title")}>
          <Text>
            {t("about.data.real", {
              leagues: stats.leagues,
              committees: stats.committees,
              clubs: stats.clubs,
            })}
          </Text>
          <Text>
            {t("about.data.simulated", {
              championships: national + regional + departmental,
              teams: stats.teams,
              players: stats.players,
            })}
          </Text>
        </AboutSection>

        <AboutSection title={t("about.stack.title")}>
          <Text>{t("about.stack.body")}</Text>
          <Text>
            {t.rich("about.stack.more", {
              link: architectureLink,
            })}
          </Text>
        </AboutSection>

        <AboutSection title={t("about.links.title")}>
          <AboutLinks links={links} />
        </AboutSection>
      </div>
    </PageLayout>
  );
}

export default withServerErrorState(AboutPage);
