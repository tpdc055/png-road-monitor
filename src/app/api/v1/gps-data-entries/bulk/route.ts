import { MockAPIService } from "@/lib/mockApiService";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
  process.env.NODE_ENV === "development" ||
  !prisma;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data: importData } = body;

    if (!importData || !Array.isArray(importData)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data format. Expected array of GPS entries",
        },
        { status: 400 }
      );
    }

    if (importData.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No data provided for import",
        },
        { status: 400 }
      );
    }

    // Validate each entry
    const validationErrors: string[] = [];
    const validEntries: any[] = [];

    importData.forEach((entry, index) => {
      const rowNumber = index + 1;

      // Required field validation
      if (!entry.latitude || isNaN(Number.parseFloat(entry.latitude))) {
        validationErrors.push(`Row ${rowNumber}: Invalid latitude`);
      }
      if (!entry.longitude || isNaN(Number.parseFloat(entry.longitude))) {
        validationErrors.push(`Row ${rowNumber}: Invalid longitude`);
      }
      if (!entry.chainage || isNaN(Number.parseFloat(entry.chainage))) {
        validationErrors.push(`Row ${rowNumber}: Invalid chainage`);
      }
      if (!entry.workType) {
        validationErrors.push(`Row ${rowNumber}: Missing work type`);
      }
      if (!entry.status) {
        validationErrors.push(`Row ${rowNumber}: Missing status`);
      }
      if (!entry.projectId) {
        validationErrors.push(`Row ${rowNumber}: Missing project ID`);
      }
      if (!entry.userId) {
        validationErrors.push(`Row ${rowNumber}: Missing user ID`);
      }

      // GPS coordinate ranges validation
      const lat = Number.parseFloat(entry.latitude);
      const lng = Number.parseFloat(entry.longitude);

      if (lat && (lat < -90 || lat > 90)) {
        validationErrors.push(`Row ${rowNumber}: Latitude out of range (-90 to 90)`);
      }
      if (lng && (lng < -180 || lng > 180)) {
        validationErrors.push(`Row ${rowNumber}: Longitude out of range (-180 to 180)`);
      }

      // PNG region validation (approximate bounds)
      if (lat && lng && (lat < -12 || lat > -1 || lng < 140 || lng > 155)) {
        validationErrors.push(`Row ${rowNumber}: Coordinates outside PNG region`);
      }

      // If no errors for this row, add to valid entries
      if (validationErrors.filter(err => err.includes(`Row ${rowNumber}`)).length === 0) {
        validEntries.push({
          projectId: entry.projectId,
          phaseId: entry.phaseId || null,
          taskId: entry.taskId || null,
          latitude: Number.parseFloat(entry.latitude),
          longitude: Number.parseFloat(entry.longitude),
          chainage: Number.parseFloat(entry.chainage),
          workType: entry.workType,
          status: entry.status.toUpperCase().replace(/\s+/g, "_"),
          comments: entry.comments || null,
          entryDate: new Date(),
          userId: entry.userId,
        });
      }
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationErrors,
          validCount: validEntries.length,
          totalCount: importData.length
        },
        { status: 400 }
      );
    }

    if (USE_MOCK_DATA) {
      // Return mock success response
      const mockEntries = validEntries.map((entry, index) => ({
        id: `bulk-gps-entry-${Date.now()}-${index}`,
        date: new Date().toISOString().split("T")[0],
        project: "Mock Project",
        province: "Mock Province",
        district: "Mock District",
        phase: entry.workType,
        task: entry.workType,
        chainage: entry.chainage,
        latitude: entry.latitude,
        longitude: entry.longitude,
        status: entry.status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        comments: entry.comments || "",
        userId: entry.userId,
        createdAt: new Date().toISOString(),
      }));

      return NextResponse.json({
        success: true,
        data: mockEntries,
        message: `Successfully imported ${validEntries.length} GPS data entries`,
        imported: validEntries.length,
        total: importData.length
      });
    }

    // Batch create entries in database
    const createdEntries = await prisma.gpsDataEntry.createMany({
      data: validEntries,
      skipDuplicates: true
    });

    // Fetch the created entries with relations for response
    const entriesWithRelations = await prisma.gpsDataEntry.findMany({
      where: {
        userId: { in: validEntries.map(e => e.userId) },
        createdAt: {
          gte: new Date(Date.now() - 60000) // Created within last minute
        }
      },
      include: {
        project: {
          select: {
            name: true,
            province: { select: { name: true } },
            district: { select: { name: true } }
          }
        },
        phase: { select: { name: true } },
        task: { select: { name: true } },
      },
      orderBy: {
        createdAt: "desc"
      },
      take: validEntries.length
    });

    // Transform response to match frontend interface
    const transformedEntries = entriesWithRelations.map((entry) => ({
      id: entry.id,
      date: entry.entryDate.toISOString().split("T")[0],
      project: entry.project.name,
      province: entry.project.province?.name || "",
      district: entry.project.district?.name || "",
      phase: entry.phase?.name || entry.workType || "",
      task: entry.task?.name || entry.workType || "",
      chainage: entry.chainage,
      latitude: entry.latitude,
      longitude: entry.longitude,
      status: entry.status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      comments: entry.comments || "",
      userId: entry.userId,
      createdAt: entry.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: transformedEntries,
      message: `Successfully imported ${createdEntries.count} GPS data entries`,
      imported: createdEntries.count,
      total: importData.length
    });

  } catch (error) {
    console.error("Error importing GPS data entries:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to import GPS data entries",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
