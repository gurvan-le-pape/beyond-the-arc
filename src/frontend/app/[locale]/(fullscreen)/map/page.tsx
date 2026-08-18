// src/frontend/app/[locale]/(fullscreen)/map/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { serverClubsService } from "@/features/organizations/clubs/api/clubs.server";
import { ClubsMapClient } from "@/features/organizations/clubs/components";
import { withServerErrorState } from "@/shared/components/feedback";
import { Text } from "@/shared/components/typography";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError } from "@/shared/utils";

/**
 * Metadata for the clubs map.
 *
 * Next calls this separately from the page, so a fetch failure here is not caught by the page's own error handling — hence the `withServerErrorMetadata` wrapper where one fetches.
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "clubs" });

  return {
    title: tMeta("map.pageTitle"),
    description: tMeta("map.description"),
  };
}

async function MapPage({ params }: LocalePageProps) {
  // Locale passed explicitly rather than left to next-intl's request fallback:
  // this page never calls `setRequestLocale`, and the fallback reads `headers()`.
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "clubs" });

  // Pre-fetch initial regions data server-side
  const [initialRegions, initialDepartments, initialClubs] = await Promise.all([
    serverClubsService.getStatsByRegion(),
    serverClubsService.getStatsByDepartment(),
    serverClubsService.getAllClubs(),
  ]).catch(handleServerError);

  // The header and the viewport-height shell come from `(fullscreen)/layout.tsx`;
  // this page contributes the `main` the map fills.
  return (
    <main id="main-content" className="flex-1 relative">
      {/* The map is the page; this is the document's heading. */}
      <Text variant="pageTitle" className="sr-only">
        {t("map.pageTitle")}
      </Text>

      <ClubsMapClient
        initialRegions={initialRegions}
        initialDepartments={initialDepartments}
        initialClubs={initialClubs}
      />
    </main>
  );
}

// Rendered per request: the image build has no backend to prerender against.
// The three club datasets behind it are cached for 24h by fetchApi — including
// the 990 KB /clubs/all payload — so a render here is a cache read, not three
// queries.
export const dynamic = "force-dynamic";

export default withServerErrorState(MapPage);
