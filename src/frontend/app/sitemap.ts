// src/frontend/app/sitemap.ts
import type { MetadataRoute } from "next";

import { serverClubsService } from "@/features/organizations/clubs/api/clubs.server";
import { serverCommitteesService } from "@/features/organizations/committees/api/committees.server";
import { serverLeaguesService } from "@/features/organizations/leagues/api/leagues.server";

import { LOCALES } from "../locales";

const BASE_URL = process.env.FRONTEND_URL;

/**
 * Generated per request, never at build.
 *
 * Prerendering this route means enumerating every club while the image is
 * being built — where the only reachable API is the public production origin,
 * over the internet, with no backend on the build network. A build that runs
 * while production is slow or down then bakes an empty sitemap into the image
 * and serves it until the next revalidation.
 *
 * Per-request generation is not the expensive half it looks like: the three
 * services below read through Next's Data Cache at `ServerRevalidate.REFERENCE`,
 * so this costs one backend call per endpoint per day however often the
 * sitemap is fetched — and it is correct the moment a deploy finishes.
 */
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function localizedUrls(
  path: string,
  options?: {
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
  },
): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}${path}`,
    changeFrequency: options?.changeFrequency ?? "weekly",
    priority: options?.priority ?? 0.7,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${BASE_URL}/${l}${path}`]),
      ),
    },
  }));
}

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------

/**
 * The sitemap Next generates: the static routes and the club, league and
 * committee pages, in every locale.
 *
 * **Championship, team, player and match pages are omitted** deliberately:
 * players and matches alone number in the hundreds of thousands, and all four
 * are generated on first request rather than pre-built. Organisations number
 * a few thousand and change once a season, so they are listed.
 *
 * Each entry carries `alternates.languages` for both locales, so a crawler
 * treats the two as translations of one page rather than as duplicates.
 *
 * @returns the sitemap entries Next serialises to `/sitemap.xml`
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // --- Static routes -------------------------------------------------------
  const staticRoutes: MetadataRoute.Sitemap = [
    ...localizedUrls("", { changeFrequency: "daily", priority: 1 }),
    ...localizedUrls("/about", { changeFrequency: "monthly", priority: 0.5 }),
    ...localizedUrls("/product", {
      changeFrequency: "monthly",
      priority: 0.5,
    }),
    ...localizedUrls("/docs", { changeFrequency: "weekly", priority: 0.6 }),
    ...localizedUrls("/contact", { changeFrequency: "monthly", priority: 0.4 }),
    ...localizedUrls("/map", { changeFrequency: "weekly", priority: 0.7 }),
    ...localizedUrls("/search", { changeFrequency: "weekly", priority: 0.7 }),
    ...localizedUrls("/championships", {
      changeFrequency: "daily",
      priority: 0.8,
    }),
    ...localizedUrls("/organizations/clubs", {
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    ...localizedUrls("/organizations/leagues", {
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    ...localizedUrls("/organizations/committees", {
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  ];

  // --- Dynamic routes ------------------------------------------------------
  // Each list degrades to [] on its own: one unavailable endpoint costs its own
  // entity's URLs, never the whole sitemap.
  const [clubs, leagues, committees] = await Promise.all([
    serverClubsService.getAllClubs().catch(() => []),
    serverLeaguesService.getAll().catch(() => []),
    serverCommitteesService.getAll().catch(() => []),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...clubs.flatMap((club) =>
      localizedUrls(`/organizations/clubs/${club.id}`, {
        changeFrequency: "weekly",
        priority: 0.6,
      }),
    ),
    ...leagues.flatMap((league) =>
      localizedUrls(`/organizations/leagues/${league.id}`, {
        changeFrequency: "weekly",
        priority: 0.6,
      }),
    ),
    ...committees.flatMap((committee) =>
      localizedUrls(`/organizations/committees/${committee.id}`, {
        changeFrequency: "monthly",
        priority: 0.5,
      }),
    ),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
