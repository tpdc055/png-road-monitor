import { NextResponse } from 'next/server';
import { MockAPIService } from '@/lib/mockApiService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Pure mock data response - no database dependencies
    const resolvedParams = await params;
    const result = await MockAPIService.getProject(resolvedParams.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch project',
      details: error.message
    }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const resolvedParams = await params;

    // Validate required fields
    if (body.name && !body.name.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Project name cannot be empty'
      }, { status: 400 });
    }

    // Pure mock data response - no database dependencies
    const result = await MockAPIService.updateProject(resolvedParams.id, body);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update project',
      details: error.message
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Pure mock data response - no database dependencies
    const resolvedParams = await params;
    const result = await MockAPIService.deleteProject(resolvedParams.id);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete project',
      details: error.message
    }, { status: 500 });
  }
}
