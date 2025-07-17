import { MockAPIService } from "@/lib/mockApiService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Pure mock data response - no database dependencies
    const result = await MockAPIService.getWorkTypes();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching work types:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch work types",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
