// src/frontend/app/[locale]/(fullscreen)/map/page.tsx
import { serverClubsService } from "@/features/organizations/clubs/api";
import { ClubsMapClient } from "@/features/organizations/clubs/components";
import { handleServerError } from "@/shared/utils";

export default async function MapPage() {
  // Pre-fetch initial regions data server-side
  const [initialRegions, initialDepartments, initialClubs] = await Promise.all([
    serverClubsService.getStatsByRegion(),
    serverClubsService.getStatsByDepartment(),
    serverClubsService.getAllClubs(),
  ]).catch(handleServerError);

  // The header and the viewport-height shell come from `(fullscreen)/layout.tsx`;
  // this page contributes the `main` the map fills.
  return (
    <main className="flex-1 relative">
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
