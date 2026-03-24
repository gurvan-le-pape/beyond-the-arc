// src/frontend/app/api/clubs/regions/route.ts
import { NextResponse } from "next/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import { logger } from "@/shared/utils/logger";

export async function GET() {
  try {
    const regions = await serverClubsService.getStatsByRegion();
    return NextResponse.json(regions);
  } catch (error) {
    logger.error(error, "GET /api/clubs/regions");
    return NextResponse.json(
      { error: "Failed to fetch regions" },
      { status: 500 },
    );
  }
}

// Cache for 24 hours
export const revalidate = 86400;
