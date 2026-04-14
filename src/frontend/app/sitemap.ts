// src/frontend/app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE_URL = process.env.FRONTEND_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const LOCALES = ["en", "fr"] as const;

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

/**
 * Fetches IDs from a NestJS backend endpoint.
 *
 * Handles the TransformInterceptor wrapper shape: { data: [{ id, ... }] }
 * as well as plain array responses.
 *
 * Returns [] on any failure — a broken endpoint never takes down
 * the entire sitemap build.
 */
async function fetchIds(endpoint: string): Promise<number[]> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return [];

    const json = await res.json();

    // TransformInterceptor wraps: { data: [...], meta, timestamp, ... }
    let items: { id: number }[];
    if (Array.isArray(json)) {
      items = json;
    } else if (Array.isArray(json?.data)) {
      items = json.data;
    } else {
      items = [];
    }

    return items.map((item) => item.id).filter(Boolean);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // --- Static routes -------------------------------------------------------
  const staticRoutes: MetadataRoute.Sitemap = [
    ...localizedUrls("", { changeFrequency: "daily", priority: 1 }),
    ...localizedUrls("/about", { changeFrequency: "monthly", priority: 0.5 }),
    ...localizedUrls("/features", {
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

  // --- Fetch all dynamic IDs in parallel -----------------------------------
  //
  // All endpoints return a flat array of IDs via dedicated /all routes,
  // wrapped by TransformInterceptor as { data: [{ id, ... }] }.
  //
  // Endpoint notes (all confirmed from controllers):
  // - GET /clubs/all          → flat array of all club IDs
  // - GET /leagues            → flat array of all league IDs
  // - GET /committees         → flat array of all committee IDs
  // - GET /championships      → flat array of all championship IDs
  // - GET /teams/all          → flat array of all team IDs
  // - GET /players/all        → flat array of all player IDs
  // - GET /matches/all        → flat array of all match IDs
  //
  const [
    clubIds,
    leagueIds,
    committeeIds,
    championshipIds,
    teamIds,
    playerIds,
    matchIds,
  ] = await Promise.all([
    fetchIds("/clubs/all"),
    fetchIds("/leagues"),
    fetchIds("/committees"),
    fetchIds("/championships"),
    fetchIds("/teams/all"),
    fetchIds("/players/all"),
    fetchIds("/matches/all"),
  ]);

  // --- Dynamic routes ------------------------------------------------------
  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...clubIds.flatMap((id) =>
      localizedUrls(`/organizations/clubs/${id}`, {
        changeFrequency: "weekly",
        priority: 0.6,
      }),
    ),
    ...leagueIds.flatMap((id) =>
      localizedUrls(`/organizations/leagues/${id}`, {
        changeFrequency: "weekly",
        priority: 0.6,
      }),
    ),
    ...committeeIds.flatMap((id) =>
      localizedUrls(`/organizations/committees/${id}`, {
        changeFrequency: "monthly",
        priority: 0.5,
      }),
    ),
    ...championshipIds.flatMap((id) =>
      localizedUrls(`/championships/${id}`, {
        changeFrequency: "daily",
        priority: 0.7,
      }),
    ),
    ...teamIds.flatMap((id) =>
      localizedUrls(`/teams/${id}`, {
        changeFrequency: "weekly",
        priority: 0.6,
      }),
    ),
    ...playerIds.flatMap((id) =>
      localizedUrls(`/players/${id}`, {
        changeFrequency: "weekly",
        priority: 0.6,
      }),
    ),
    // Matches: high volume, lower SEO value — deprioritized intentionally
    ...matchIds.flatMap((id) =>
      localizedUrls(`/matches/${id}`, {
        changeFrequency: "daily",
        priority: 0.4,
      }),
    ),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
