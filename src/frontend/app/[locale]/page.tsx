// src/frontend/app/[locale]/page.tsx
import { getTranslations } from "next-intl/server";

import { ExploreCard, LevelRow } from "@/features/site/home/components";
import { serverStatsService } from "@/features/stats/api";
import { Link } from "@/navigation";
import { Footer, Header } from "@/shared/components/layout";
import { buttonVariants } from "@/shared/components/primitives";
import { StatCell } from "@/shared/components/stats";
import { Text } from "@/shared/components/typography";

export default async function Home({
  params,
}: {
  readonly params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const stats = await serverStatsService.getStats();

  const formatCount = (n: number): string => n.toLocaleString("fr-FR");

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
      count: `${stats.championshipsByLevel.national} ${championshipsLabel}`,
      href: "/championships?tab=national",
    },
    {
      dot: "bg-regional",
      name: t("levels.regional.name"),
      detail: `${stats.leagues} ${t("stats.leagues")}`,
      count: `${stats.championshipsByLevel.regional} ${championshipsLabel}`,
      href: "/championships?tab=regional",
    },
    {
      dot: "bg-departmental",
      name: t("levels.departmental.name"),
      detail: `${stats.committees} ${t("stats.committees")}`,
      count: `${stats.championshipsByLevel.departmental} ${championshipsLabel}`,
      href: "/championships?tab=departmental",
    },
  ] as const;

  const mapStats = [
    { value: formatCount(stats.clubs), label: t("stats.clubs") },
    { value: formatCount(stats.committees), label: t("stats.departments") },
    { value: formatCount(stats.leagues), label: t("stats.regions") },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen surface-base">
      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto w-full">
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
              <em className="not-italic text-primary">
                {t("hero.titleEmphasis")}
              </em>
            </Text>

            <Text variant="lead" className="max-w-lg">
              {t("hero.subtitle")}
            </Text>
          </section>

          {/* ── Stats band ───────────────────────────────────────── */}
          <div className="grid grid-cols-3 md:grid-cols-6 border-b border-divide">
            {statsBand.map((s, i) => (
              <div
                key={s.label}
                className={i < 5 ? "border-r border-divide" : ""}
              >
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
            <Text variant="overline" className="text-clubs">
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
                <StatCell
                  key={s.label}
                  value={s.value}
                  label={s.label}
                  compact
                />
              ))}
            </div>
            <Link
              href="/map"
              className={
                buttonVariants({ variant: "clubs", size: "sm" }) + " mt-5"
              }
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
