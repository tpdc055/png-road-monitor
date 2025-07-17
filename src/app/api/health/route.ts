import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Health check for pure mock data deployment
    const healthInfo = {
      status: "healthy",
      mode: "mock-data-only",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      mockDataEnabled: true,
      databaseRequired: false,
      vercelDeployment: {
        region: process.env.VERCEL_REGION || "unknown",
        url: process.env.VERCEL_URL || "unknown",
      },
      features: {
        mockProjects: true,
        mockGPS: true,
        mockFinancial: true,
        mockUsers: true,
        mockProvinces: true,
        realtimeSync: false,
        pngApiIntegration: false,
      },
    };

    return NextResponse.json({
      success: true,
      message: "PNG Road Monitor API is healthy (Mock Data Mode)",
      data: healthInfo,
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export async function POST() {
  return NextResponse.json({
    status: "OK",
    message: "POST endpoint available (Mock Data Mode)",
  });
}
