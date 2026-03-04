// src/frontend/app/api/clubs/departments/[regionId]/route.ts
import { NextResponse } from "next/server";

import { serverClubsService } from "@/features/organizations/clubs/api";

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
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 },
    );
  }
}
// Cache for 1 hour
export const revalidate = 3600;
