import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if we're in mock mode - don't initialize Prisma if we are
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
  process.env.NODE_ENV === "development";

function createPrismaClient() {
  if (USE_MOCK_DATA) {
    console.log("Prisma client creation skipped - using mock data mode");
    return null as any; // Return null for mock mode
  }

  try {
    console.log("Creating Prisma client...");
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

    const client = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });

    console.log("Prisma client created successfully");
    return client;
  } catch (error) {
    console.error("Failed to create Prisma client:", error);
    console.log("Falling back to mock mode due to Prisma error");
    return null as any; // Return null on error
  }
}

export const prisma = USE_MOCK_DATA
  ? (null as any)
  : (globalForPrisma.prisma ?? createPrismaClient());

if (process.env.NODE_ENV !== "production" && !USE_MOCK_DATA) {
  globalForPrisma.prisma = prisma;
}
