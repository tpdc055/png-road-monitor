import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const update = await request.json();

    // Validate update structure
    if (!update.type || !update.action || !update.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid update structure. Required: type, action, data",
        },
        { status: 400 },
      );
    }

    // Mock realtime sync - just log the update
    console.log("Mock realtime update received:", {
      ...update,
      timestamp: new Date(),
      source: "mock-sync",
    });

    return NextResponse.json({
      success: true,
      message: "Update synchronized successfully (mock mode)",
    });
  } catch (error) {
    console.error("Real-time sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync update",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    // Mock connection status
    const mockStatus = {
      connected: false,
      activeConnections: 0,
      queuedUpdates: 0,
      listeners: 0,
      mode: "mock",
    };

    return NextResponse.json({
      success: true,
      realTimeStatus: mockStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Real-time status check failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get real-time status",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
