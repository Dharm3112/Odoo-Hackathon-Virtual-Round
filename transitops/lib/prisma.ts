import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // Prisma 7 requires datasource configuration via prisma.config.ts
    // The URL is picked up from the environment via prisma.config.ts
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;