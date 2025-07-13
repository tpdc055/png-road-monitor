import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data mode status - no actual database
    const mockStatus = {
      status: 'healthy',
      dataSource: 'mock',
      message: 'Using mock data service (no database required)',
      timestamp: new Date().toISOString(),
      mockData: {
        projects: 5,
        gpsEntries: 3,
        financialEntries: 5,
        users: 4,
        provinces: 10
      }
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: mockStatus,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        mockDataEnabled: true,
        realTimeSyncEnabled: false,
        pngApiIntegrationEnabled: false
      },
      deployment: {
        vercelRegion: process.env.VERCEL_REGION || 'unknown',
        vercelUrl: process.env.VERCEL_URL || 'unknown'
      }
    });
  } catch (error) {
    console.error('Database status check failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Database status check failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
