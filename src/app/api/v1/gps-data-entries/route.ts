import { MockAPIService } from "@/lib/mockApiService";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
  process.env.NODE_ENV === "development" ||
  !prisma;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const phaseId = searchParams.get("phaseId");
    const taskId = searchParams.get("taskId");
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    if (USE_MOCK_DATA) {
      // Return mock GPS data entries
      const mockEntries = Array.from({ length: 25 }, (_, i) => ({
        id: `gps-entry-${i + 1}`,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        project: "Highlands Highway Rehabilitation",
        province: "Western Highlands Province",
        district: "Mount Hagen District",
        phase: [
          "Preliminary/Survey",
          "Earthworks",
          "Subbase & Base Construction",
          "Pavement & Sealing",
        ][Math.floor(Math.random() * 4)],
        task: "Survey & Pegging",
        chainage: Math.random() * 50,
        latitude: -6.314993 + (Math.random() - 0.5) * 0.01,
        longitude: 143.95555 + (Math.random() - 0.5) * 0.01,
        status: ["Completed", "In Progress", "Inspection Required", "Approved"][
          Math.floor(Math.random() * 4)
        ],
        comments: "GPS data entry from field survey",
        userId: "user-1",
        createdAt: new Date().toISOString(),
      }));

      // Apply filters
      let filteredEntries = mockEntries;

      if (projectId && projectId !== "all") {
        // In mock mode, we'll return entries for any project
        filteredEntries = mockEntries;
      }

      if (status && status !== "all") {
        filteredEntries = filteredEntries.filter(
          (entry) => entry.status.toLowerCase() === status.toLowerCase(),
        );
      }

      if (dateFrom) {
        filteredEntries = filteredEntries.filter(
          (entry) => entry.date >= dateFrom,
        );
      }

      if (dateTo) {
        filteredEntries = filteredEntries.filter(
          (entry) => entry.date <= dateTo,
        );
      }

      return NextResponse.json({
        success: true,
        data: filteredEntries,
        total: filteredEntries.length,
        filters: { projectId, phaseId, taskId, status, dateFrom, dateTo },
      });
    }

    // Real database query
    const whereClause: any = {};

    if (projectId && projectId !== "all") {
      whereClause.projectId = projectId;
    }

    if (phaseId && phaseId !== "all") {
      whereClause.phaseId = phaseId;
    }

    if (taskId && taskId !== "all") {
      whereClause.taskId = taskId;
    }

    if (status && status !== "all") {
      whereClause.status = status.toUpperCase().replace(/\s+/g, "_");
    }

    if (dateFrom || dateTo) {
      whereClause.entryDate = {};
      if (dateFrom) {
        whereClause.entryDate.gte = new Date(dateFrom);
      }
      if (dateTo) {
        whereClause.entryDate.lte = new Date(dateTo);
      }
    }

    const entries = await prisma.gpsDataEntry.findMany({
      where: whereClause,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            province: {
              select: {
                name: true,
                code: true,
              },
            },
            district: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
        phase: {
          select: {
            id: true,
            name: true,
          },
        },
        task: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        entryDate: "desc",
      },
    });

    // Transform data to match the frontend interface
    const transformedEntries = entries.map((entry) => ({
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
      total: transformedEntries.length,
      filters: { projectId, phaseId, taskId, status, dateFrom, dateTo },
    });
  } catch (error) {
    console.error("Error fetching GPS data entries:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch GPS data entries",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      projectId,
      phaseId,
      taskId,
      latitude,
      longitude,
      chainage,
      workType,
      status,
      comments,
      entryDate,
      userId = "current-user", // This should come from authentication
    } = body;

    // Validate required fields
    if (!projectId || !latitude || !longitude) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: projectId, latitude, longitude",
        },
        { status: 400 },
      );
    }

    if (USE_MOCK_DATA) {
      // Return mock success response
      const mockEntry = {
        id: `gps-entry-${Date.now()}`,
        date: entryDate || new Date().toISOString().split("T")[0],
        project: "Mock Project",
        province: "Mock Province",
        district: "Mock District",
        phase: workType || "Survey",
        task: workType || "Survey & Pegging",
        chainage: chainage || 0,
        latitude,
        longitude,
        status: status || "In Progress",
        comments: comments || "",
        userId,
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: mockEntry,
        message: "GPS data entry created successfully",
      });
    }

    // Create real database entry
    const entry = await prisma.gpsDataEntry.create({
      data: {
        projectId,
        phaseId: phaseId || null,
        taskId: taskId || null,
        latitude: Number.parseFloat(latitude.toString()),
        longitude: Number.parseFloat(longitude.toString()),
        chainage: Number.parseFloat(chainage?.toString() || "0"),
        workType: workType || null,
        status: status?.toUpperCase().replace(/\s+/g, "_") || "IN_PROGRESS",
        comments: comments || null,
        entryDate: entryDate ? new Date(entryDate) : new Date(),
        userId,
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

    // Transform response to match frontend interface
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
      message: "GPS data entry created successfully",
    });
  } catch (error) {
    console.error("Error creating GPS data entry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create GPS data entry",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
