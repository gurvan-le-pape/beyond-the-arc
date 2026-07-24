// src/frontend/app/[locale]/(public)/map/page.tsx
import { serverClubsService } from "@/features/organizations/clubs/api";
import { ClubsMapClient } from "@/features/organizations/clubs/components";
import { Header } from "@/shared/components/layout";
import { handleServerError } from "@/shared/utils";

export default async function MapPage() {
  // Pre-fetch initial regions data server-side
  const [initialRegions, initialDepartments, initialClubs] = await Promise.all([
    serverClubsService.getStatsByRegion(),
    serverClubsService.getStatsByDepartment(),
    serverClubsService.getAllClubs(),
  ]).catch(handleServerError);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <main className="flex-1 relative">
        <ClubsMapClient
          initialRegions={initialRegions}
          initialDepartments={initialDepartments}
          initialClubs={initialClubs}
        />
      </main>
      {/* No footer - full screen map experience */}
    </div>
  );
}

// Rendered per request: the image build has no backend to prerender against.
// The three club datasets behind it are cached for 24h by fetchApi — including
// the 990 KB /clubs/all payload — so a render here is a cache read, not three
// queries.
export const dynamic = "force-dynamic";
