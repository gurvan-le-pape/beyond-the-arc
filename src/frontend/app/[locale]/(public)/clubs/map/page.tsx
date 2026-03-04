// src/frontend/app/[locale]/(public)/clubs/map/page.tsx
import { serverClubsService } from "@/features/organizations/clubs/api";
import { ClubsMapClient } from "@/features/organizations/clubs/components/map/ClubsMapClient";
import { Header } from "@/shared/components/layouts";

export default async function MapPage() {
  // Pre-fetch initial regions data server-side
  const initialRegions = await serverClubsService.getStatsByRegion();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <main className="flex-1 relative">
        <ClubsMapClient initialRegions={initialRegions} />
      </main>
      {/* No footer - full screen map experience */}
    </div>
  );
}

// Cache the page with 24-hour revalidation
export const revalidate = 86400;
