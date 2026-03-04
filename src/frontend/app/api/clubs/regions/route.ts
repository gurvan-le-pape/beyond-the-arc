// src/frontend/app/api/clubs/regions/route.ts
import { NextResponse } from "next/server";

import { serverClubsService } from "@/features/organizations/clubs/api";

export async function GET() {
  try {
    const regions = await serverClubsService.getStatsByRegion();
    return NextResponse.json(regions);
  } catch (error) {
    console.error("Error fetching regions:", error);
    return NextResponse.json(
      { error: "Failed to fetch regions" },
      { status: 500 },
    );
  }
}

// Cache for 24 hours
export const revalidate = 86400;
