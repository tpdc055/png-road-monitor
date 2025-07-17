import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
  process.env.NODE_ENV === "development" ||
  !prisma;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (USE_MOCK_DATA) {
      // Return mock GPS data entry
      const mockEntry = {
        id,
        date: "2025-01-09",
        project: "Highlands Highway Rehabilitation",
        province: "Western Highlands Province",
        district: "Mount Hagen District",
        phase: "Earthworks",
        task: "Embankment Preparation",
        chainage: 25.5,
        latitude: -6.314993,
        longitude: 143.95555,
        status: "Completed",
        comments: "Embankment work completed successfully",
        userId: "user-1",
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: mockEntry,
      });
    }

    // Get real database entry
    const entry = await prisma.gpsDataEntry.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            name: true,
            province: { select: { name: true } },
            district: { select: { name: true } },
          },
        },
        phase: { select: { name: true } },
        task: { select: { name: true } },
        user: { select: { name: true, role: true } },
      },
    });

    if (!entry) {
      return NextResponse.json(
        {
          success: false,
          error: "GPS data entry not found",
        },
        { status: 404 },
      );
    }

    // Transform response
    const transformedEntry = {
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
    };

    return NextResponse.json({
      success: true,
      data: transformedEntry,
    });
  } catch (error) {
    console.error("Error fetching GPS data entry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch GPS data entry",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      phaseId,
      taskId,
      latitude,
      longitude,
      chainage,
      workType,
      status,
      comments,
      entryDate,
    } = body;

    if (USE_MOCK_DATA) {
      // Return mock success response
      const mockEntry = {
        id,
        date: entryDate || "2025-01-09",
        project: "Mock Project",
        province: "Mock Province",
        district: "Mock District",
        phase: workType || "Survey",
        task: workType || "Survey & Pegging",
        chainage: chainage || 0,
        latitude: latitude || 0,
        longitude: longitude || 0,
        status: status || "In Progress",
        comments: comments || "",
        userId: "user-1",
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: mockEntry,
        message: "GPS data entry updated successfully",
      });
    }

    // Check if entry exists
    const existingEntry = await prisma.gpsDataEntry.findUnique({
      where: { id },
    });

    if (!existingEntry) {
      return NextResponse.json(
        {
          success: false,
          error: "GPS data entry not found",
        },
        { status: 404 },
      );
    }

    // Update the entry
    const updatedEntry = await prisma.gpsDataEntry.update({
      where: { id },
      data: {
        phaseId: phaseId || null,
        taskId: taskId || null,
        latitude: latitude
          ? Number.parseFloat(latitude.toString())
          : existingEntry.latitude,
        longitude: longitude
          ? Number.parseFloat(longitude.toString())
          : existingEntry.longitude,
        chainage:
          chainage !== undefined
            ? Number.parseFloat(chainage.toString())
            : existingEntry.chainage,
        workType: workType || existingEntry.workType,
        status: status
          ? status.toUpperCase().replace(/\s+/g, "_")
          : existingEntry.status,
        comments: comments !== undefined ? comments : existingEntry.comments,
        entryDate: entryDate ? new Date(entryDate) : existingEntry.entryDate,
        updatedAt: new Date(),
      },
      include: {
        project: {
          select: {
            name: true,
            province: { select: { name: true } },
            district: { select: { name: true } },
          },
        },
        phase: { select: { name: true } },
        task: { select: { name: true } },
      },
    });

    // Transform response
    const transformedEntry = {
      id: updatedEntry.id,
      date: updatedEntry.entryDate.toISOString().split("T")[0],
      project: updatedEntry.project.name,
      province: updatedEntry.project.province?.name || "",
      district: updatedEntry.project.district?.name || "",
      phase: updatedEntry.phase?.name || updatedEntry.workType || "",
      task: updatedEntry.task?.name || updatedEntry.workType || "",
      chainage: updatedEntry.chainage,
      latitude: updatedEntry.latitude,
      longitude: updatedEntry.longitude,
      status: updatedEntry.status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      comments: updatedEntry.comments || "",
      userId: updatedEntry.userId,
      createdAt: updatedEntry.createdAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: transformedEntry,
      message: "GPS data entry updated successfully",
    });
  } catch (error) {
    console.error("Error updating GPS data entry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update GPS data entry",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (USE_MOCK_DATA) {
      // Return mock success response
      return NextResponse.json({
        success: true,
        message: "GPS data entry deleted successfully",
      });
    }

    // Check if entry exists
    const existingEntry = await prisma.gpsDataEntry.findUnique({
      where: { id },
    });

    if (!existingEntry) {
      return NextResponse.json(
        {
          success: false,
          error: "GPS data entry not found",
        },
        { status: 404 },
      );
    }

    // Delete the entry
    await prisma.gpsDataEntry.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "GPS data entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting GPS data entry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete GPS data entry",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
