import { NextResponse } from 'next/server';
import { MockAPIService } from '@/lib/mockApiService';

export async function GET() {
  try {
    // Pure mock data response - no database dependencies
    const result = await MockAPIService.getProjects();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch projects',
      details: error.message
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.location || !body.provinceId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, location, provinceId'
      }, { status: 400 });
    }

    // Pure mock data response - no database dependencies
    const result = await MockAPIService.createProject(body);

    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create project',
      details: error.message
    }, { status: 500 });
  }
}
