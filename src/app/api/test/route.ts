import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "PNG Road Monitor API is working on Vercel!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    useMockData: process.env.USE_MOCK_DATA || 'false'
  });
}
