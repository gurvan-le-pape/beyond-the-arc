// src/frontend/app/[locale]/(chrome)/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ExploreCard, LevelRow } from "@/features/site/home/components";
import { serverStatsService } from "@/features/stats/api";
import { Link } from "@/navigation";
import { PageLayout } from "@/shared/components/layout";
import { buttonVariants } from "@/shared/components/primitives";
import { StatCell } from "@/shared/components/stats";
import { Text } from "@/shared/components/typography";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError } from "@/shared/utils";

// Rendered per request: the image build has no backend to fetch stats from.
// Home is dynamic today only by accident — it is the one page that never calls
// setRequestLocale, and next-intl's fallback to headers() is what keeps it out
// of the prerender pass. Saying so explicitly is what lets the locale layout
// adopt setRequestLocale without breaking the build.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "home" });

  // Absolute: the home page is the site, so it does not want the
  // "· Beyond The Arc" suffix every other route inherits.
  return {
    title: {
      absolute: `Beyond The Arc — ${tMeta("hero.titleStart")} ${tMeta("hero.titleEmphasis")}`,
    },
    description: tMeta("hero.subtitle"),
  };
}

export default async function Home({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const stats = await serverStatsService.getStats().catch(handleServerError);

  const formatCount = (n: number): string => n.toLocaleString(locale);

  const statsBand = [
    { value: formatCount(stats.clubs), label: t("stats.clubs") },
    { value: formatCount(stats.teams), label: t("stats.teams") },
    { value: formatCount(stats.players), label: t("stats.players") },
    { value: formatCount(stats.matches), label: t("stats.matches") },
    { value: formatCount(stats.leagues), label: t("stats.leagues") },
    { value: formatCount(stats.committees), label: t("stats.committees") },
  ] as const;

  const exploreCards = [
    {
      href: "/search?tab=players",
      badgeVariant: "players" as const,
      badge: t("explore.players.badge"),
      title: t("explore.players.title"),
      desc: t("explore.players.desc"),
      count: formatCount(stats.players),
      countLabel: t("explore.players.count"),
    },
    {
      href: "/search?tab=teams",
      badgeVariant: "teams" as const,
      badge: t("explore.teams.badge"),
      title: t("explore.teams.title"),
      desc: t("explore.teams.desc"),
      count: formatCount(stats.teams),
      countLabel: t("explore.teams.count"),
    },
    {
      href: "/search?tab=matches",
      badgeVariant: "matches" as const,
      badge: t("explore.matches.badge"),
      title: t("explore.matches.title"),
      desc: t("explore.matches.desc"),
      count: formatCount(stats.matches),
      countLabel: t("explore.matches.count"),
    },
  ] as const;

  const championshipsLabel = t("levels.championships");

  const levelCards = [
    {
      dot: "bg-national",
      name: t("levels.national.name"),
      detail: t("levels.national.detail"),
      count: `${formatCount(stats.championshipsByLevel.national)} ${championshipsLabel}`,
      href: "/championships?tab=national",
    },
    {
      dot: "bg-regional",
      name: t("levels.regional.name"),
      detail: `${formatCount(stats.leagues)} ${t("stats.leagues")}`,
      count: `${formatCount(stats.championshipsByLevel.regional)} ${championshipsLabel}`,
      href: "/championships?tab=regional",
    },
    {
      dot: "bg-departmental",
      name: t("levels.departmental.name"),
      detail: `${formatCount(stats.committees)} ${t("stats.committees")}`,
      count: `${formatCount(stats.championshipsByLevel.departmental)} ${championshipsLabel}`,
      href: "/championships?tab=departmental",
    },
  ] as const;

  const mapStats = [
    { value: formatCount(stats.clubs), label: t("stats.clubs") },
    { value: formatCount(stats.committees), label: t("stats.departments") },
    { value: formatCount(stats.leagues), label: t("stats.regions") },
  ] as const;

  return (
    <PageLayout edgeToEdge>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center px-6 py-16 border-b border-divide">
        <Text
          variant="overline"
          className="inline-flex items-center gap-1.5 text-primary bg-primary-ghost px-3 py-1 rounded mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          {t("hero.eyebrow")}
        </Text>

        <Text
          variant="h1"
          className="font-extrabold leading-none tracking-tight mb-5"
        >
          {t("hero.titleStart")}{" "}
          <em className="not-italic text-primary">{t("hero.titleEmphasis")}</em>
        </Text>

        <Text variant="lead" className="max-w-lg">
          {t("hero.subtitle")}
        </Text>
      </section>

      {/* ── Stats band ───────────────────────────────────────── */}
      <div className="grid grid-cols-3 md:grid-cols-6 border-b border-divide">
        {statsBand.map((s, i) => (
          <div key={s.label} className={i < 5 ? "border-r border-divide" : ""}>
            <StatCell value={s.value} label={s.label} />
          </div>
        ))}
      </div>

      {/* ── Search & explore ─────────────────────────────────── */}
      <div className="px-6 pt-7 pb-2 border-b border-divide">
        <Text variant="overline">{t("explore.sectionTitle")}</Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-divide divide-y md:divide-y-0 md:divide-x divide-divide">
        {exploreCards.map((card) => (
          <ExploreCard key={card.href} {...card} />
        ))}
      </div>

      {/* ── Clubs & map ──────────────────────────────────────── */}
      <div className="border-b border-divide px-8 py-16 flex flex-col items-center text-center">
        {/* -strong, not the mid tone: `text-clubs` (#a78bfa) is 2.60:1 on
            surface-base. The mid step of a category ramp is for icons and
            fills; category-coloured text takes -strong everywhere else. */}
        <Text variant="overline" className="text-clubs-strong">
          {t("map.eyebrow")}
        </Text>
        <Text variant="h2" className="mt-3 max-w-sm">
          {t("map.title")}
        </Text>
        <Text variant="caption" className="max-w-sm mt-2">
          {t("map.desc")}
        </Text>
        <div className="flex gap-8 pt-4 mt-4 border-t border-divide">
          {mapStats.map((s) => (
            <StatCell key={s.label} value={s.value} label={s.label} compact />
          ))}
        </div>
        <Link
          href="/map"
          className={buttonVariants({ variant: "clubs", size: "sm" }) + " mt-5"}
        >
          {t("map.cta")}
        </Link>
      </div>

      {/* ── Competition levels ───────────────────────────────── */}
      <div className="px-6 pt-7 pb-2">
        <Text variant="overline">{t("levels.sectionTitle")}</Text>
      </div>

      <div className="flex flex-col gap-2 px-6 pb-10">
        {levelCards.map((level) => (
          <LevelRow key={level.name} {...level} />
        ))}
      </div>
    </PageLayout>
  );
}
