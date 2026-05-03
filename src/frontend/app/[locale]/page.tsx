// src/frontend/app/[locale]/page.tsx
import { getTranslations } from "next-intl/server";

import { serverStatsService } from "@/features/stats/api/stats.server";
import { Footer, Header } from "@/shared/components/layout";
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
      href: `/${locale}/search?tab=players`,
      badgeClass: "bg-players-subtle text-players-strong",
      badge: t("explore.players.badge"),
      title: t("explore.players.title"),
      desc: t("explore.players.desc"),
      count: formatCount(stats.players),
      countLabel: t("explore.players.count"),
    },
    {
      href: `/${locale}/search?tab=teams`,
      badgeClass: "bg-teams-subtle text-teams-strong",
      badge: t("explore.teams.badge"),
      title: t("explore.teams.title"),
      desc: t("explore.teams.desc"),
      count: formatCount(stats.teams),
      countLabel: t("explore.teams.count"),
    },
    {
      href: `/${locale}/search?tab=matches`,
      badgeClass: "bg-matches-subtle text-matches-strong",
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
      href: `/${locale}/championships?tab=national`,
    },
    {
      dot: "bg-regional",
      name: t("levels.regional.name"),
      detail: `${stats.leagues} ${t("stats.leagues")}`,
      count: `${stats.championshipsByLevel.regional} ${championshipsLabel}`,
      href: `/${locale}/championships?tab=regional`,
    },
    {
      dot: "bg-departmental",
      name: t("levels.departmental.name"),
      detail: `${stats.committees} ${t("stats.committees")}`,
      count: `${stats.championshipsByLevel.departmental} ${championshipsLabel}`,
      href: `/${locale}/championships?tab=departmental`,
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
              className="inline-flex items-center gap-1.5 text-primary-500 bg-primary-50 px-3 py-1 rounded mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              {t("hero.eyebrow")}
            </Text>

            <h1
              className="font-extrabold leading-none tracking-tight mb-5 text-text-heading"
              style={{ fontSize: "clamp(2.5rem, 6vw, 3.75rem)" }}
            >
              {t("hero.titleStart")}{" "}
              <em className="not-italic text-primary-500">
                {t("hero.titleEmphasis")}
              </em>
            </h1>

            <Text variant="lead" className="max-w-lg">
              {t("hero.subtitle")}
            </Text>
          </section>

          {/* ── Stats band ───────────────────────────────────────── */}
          <div className="grid grid-cols-3 md:grid-cols-6 border-b border-divide">
            {statsBand.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col items-center justify-center py-5 px-3 text-center ${
                  i < 5 ? "border-r border-divide" : ""
                }`}
              >
                <span className="text-2xl font-extrabold leading-none text-text-heading tabular-nums">
                  {s.value}
                </span>
                <Text variant="overline" className="mt-1">
                  {s.label}
                </Text>
              </div>
            ))}
          </div>

          {/* ── Search & explore ─────────────────────────────────── */}
          <div className="px-6 pt-7 pb-2 border-b border-divide">
            <Text variant="overline">{t("explore.sectionTitle")}</Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-b border-divide divide-y md:divide-y-0 md:divide-x divide-divide">
            {exploreCards.map((card) => (
              <a
                key={card.href}
                href={card.href}
                className="group flex flex-col gap-3 p-7 hover:bg-surface-inset transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded ${card.badgeClass}`}
                  >
                    {card.badge}
                  </span>
                  <span className="text-text-secondary group-hover:translate-x-0.5 transition-transform duration-150">
                    →
                  </span>
                </div>
                <Text variant="h3">{card.title}</Text>
                <Text variant="caption">{card.desc}</Text>
                <p className="text-[12px] font-bold text-text-secondary pt-3 border-t border-divide mt-auto">
                  <span className="text-text-heading">{card.count}</span>{" "}
                  {card.countLabel}
                </p>
              </a>
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
                <div
                  key={s.label}
                  className="flex flex-col gap-0.5 items-center"
                >
                  <span className="text-lg font-extrabold leading-none text-text-heading">
                    {s.value}
                  </span>
                  <Text variant="overline">{s.label}</Text>
                </div>
              ))}
            </div>
            <a
              href={`/${locale}/map`}
              className="mt-5 text-sm font-semibold bg-clubs hover:bg-clubs-strong text-white px-5 py-2.5 rounded-button transition-colors duration-150"
            >
              {t("map.cta")}
            </a>
          </div>

          {/* ── Competition levels ───────────────────────────────── */}
          <div className="px-6 pt-7 pb-2">
            <Text variant="overline">{t("levels.sectionTitle")}</Text>
          </div>

          <div className="flex flex-col gap-2 px-6 pb-10">
            {levelCards.map((level) => (
              <a
                key={level.name}
                href={level.href}
                className="flex items-center gap-4 px-4 py-3 border border-divide rounded-card hover:bg-surface-inset transition-colors duration-150"
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${level.dot}`}
                />
                <span className="text-sm font-bold flex-1 text-text-heading">
                  {level.name}
                </span>
                <Text variant="muted" className="hidden sm:block">
                  {level.detail}
                </Text>
                <Text variant="caption" className="hidden md:block font-bold">
                  {level.count}
                </Text>
                <span className="text-xs font-semibold text-primary-500">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
