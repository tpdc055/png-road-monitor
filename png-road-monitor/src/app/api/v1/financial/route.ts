import { NextResponse } from 'next/server';
import { MockAPIService } from '@/lib/mockApiService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    // Pure mock data response - no database dependencies
    const result = await MockAPIService.getFinancialEntries(projectId || undefined);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching financial entries:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch financial entries',
      details: error.message
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.projectId || !body.userId || !body.category || !body.type || !body.amount || !body.description) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: projectId, userId, category, type, amount, description'
      }, { status: 400 });
    }

    // Validate amount
    const amount = Number(body.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Amount must be a valid positive number'
      }, { status: 400 });
    }

    // Validate category and type
    const validCategories = ['MATERIALS', 'LABOR', 'EQUIPMENT', 'TRANSPORT', 'UTILITIES', 'OVERHEAD', 'CONTINGENCY', 'OTHER'];
    const validTypes = ['EXPENSE', 'PAYMENT', 'REFUND', 'ADJUSTMENT'];

    if (!validCategories.includes(body.category)) {
      return NextResponse.json({
        success: false,
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      }, { status: 400 });
    }

    if (!validTypes.includes(body.type)) {
      return NextResponse.json({
        success: false,
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}`
      }, { status: 400 });
    }

    // Pure mock data response - no database dependencies
    const result = await MockAPIService.createFinancialEntry(body);

    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch (error) {
    console.error('Error creating financial entry:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create financial entry',
      details: error.message
    }, { status: 500 });
  }
}
