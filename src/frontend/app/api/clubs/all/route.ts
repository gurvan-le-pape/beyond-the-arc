// src/frontend/app/api/clubs/all/route.ts
import { NextResponse } from "next/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import { logger } from "@/shared/utils/logger";

export async function GET() {
  try {
    // Fetch all clubs without filtering
    const clubs = await serverClubsService.getAll();
    return NextResponse.json(clubs);
  } catch (error) {
    logger.error(error, "GET /api/clubs/all");
    return NextResponse.json(
      { error: "Failed to fetch clubs" },
      { status: 500 },
    );
  }
}

// Cache for 1 hour
export const revalidate = 3600;
