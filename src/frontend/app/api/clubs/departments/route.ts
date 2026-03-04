// src/frontend/app/api/clubs/departments/route.ts
import { NextResponse } from "next/server";

import { serverClubsService } from "@/features/organizations/clubs/api";

export async function GET() {
  try {
    // Fetch all departments across all regions
    const departments = await serverClubsService.getAllDepartments();
    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching all departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 },
    );
  }
}

// Cache for 1 hour
export const revalidate = 3600;
