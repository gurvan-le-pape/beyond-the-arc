// src/frontend/app/api/clubs/departments/[regionId]/route.ts
import { NextResponse } from "next/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import { logger } from "@/shared/utils/logger";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ regionId: string }> },
) {
  try {
    const { regionId } = await params;
    const regionIdNum = Number.parseInt(regionId, 10);
    const departments = await serverClubsService.getStatsByDepartment(
      regionIdNum,
    );
    return NextResponse.json(departments);
  } catch (error) {
    logger.error(error, "GET /api/clubs/departments/[regionId]");
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 },
    );
  }
}
// Cache for 1 hour
export const revalidate = 3600;
