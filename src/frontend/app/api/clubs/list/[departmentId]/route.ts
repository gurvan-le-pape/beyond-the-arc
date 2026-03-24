// src/frontend/app/api/clubs/list/[departmentId]/route.ts
import { NextResponse } from "next/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import { logger } from "@/shared/utils/logger";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ departmentId: string }> },
) {
  try {
    const { departmentId } = await params;
    const clubs = await serverClubsService.getAll({
      committeeId: Number.parseInt(departmentId, 10),
    });
    return NextResponse.json(clubs);
  } catch (error) {
    logger.error(error, "GET /api/clubs/list/[departmentId]");
    return NextResponse.json(
      { error: "Failed to fetch clubs" },
      { status: 500 },
    );
  }
}

// Cache for 1 hour
export const revalidate = 3600;
