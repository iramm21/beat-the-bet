// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const datasourceUrl =
  process.env.DATABASE_URL &&
  // Disable prepared statements for short-lived connections
  `${process.env.DATABASE_URL}${
    process.env.DATABASE_URL.includes("?") ? "&" : "?"
  }pgbouncer=true`;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
    ...(datasourceUrl ? { datasourceUrl } : {}),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
