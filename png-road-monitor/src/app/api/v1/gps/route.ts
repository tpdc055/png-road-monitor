import { NextResponse } from 'next/server';
import { MockAPIService } from '@/lib/mockApiService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    // Pure mock data response - no database dependencies
    const result = await MockAPIService.getGPSEntries(projectId || undefined);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching GPS entries:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch GPS entries',
      details: error.message
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.latitude || !body.longitude || !body.projectId || !body.userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: latitude, longitude, projectId, userId'
      }, { status: 400 });
    }

    // Validate coordinates
    if (Math.abs(body.latitude) > 90 || Math.abs(body.longitude) > 180) {
      return NextResponse.json({
        success: false,
        error: 'Invalid GPS coordinates'
      }, { status: 400 });
    }

    // Pure mock data response - no database dependencies
    const result = await MockAPIService.createGPSEntry(body);

    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch (error) {
    console.error('Error creating GPS entry:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create GPS entry',
      details: error.message
    }, { status: 500 });
  }
}
