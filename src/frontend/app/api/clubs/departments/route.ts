// src/frontend/app/api/clubs/departments/route.ts
import { NextResponse } from "next/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import { logger } from "@/shared/utils/logger";

export async function GET() {
  try {
    // Fetch all departments across all regions
    const departments = await serverClubsService.getAllDepartments();
    return NextResponse.json(departments);
  } catch (error) {
    logger.error(error, "GET /api/clubs/departments");
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 },
    );
  }
}

// Cache for 1 hour
export const revalidate = 3600;
