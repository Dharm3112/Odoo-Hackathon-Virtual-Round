import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getAllDrivers(filters?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const where: Prisma.DriverWhereInput = {};

  if (filters?.status) where.status = filters.status;
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { licenseNumber: { contains: filters.search } },
    ];
  }

  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 20;
  const skip = (page - 1) * limit;

  const [drivers, total] = await Promise.all([
    prisma.driver.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.driver.count({ where }),
  ]);

  return {
    drivers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getDriverById(id: number) {
  return prisma.driver.findUnique({
    where: { id },
    include: {
      trips: { take: 5, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getEligibleDrivers() {
  return prisma.driver.findMany({
    where: {
      status: "Available",
      licenseExpiry: { gt: new Date() },
      NOT: { status: "Suspended" },
    },
    select: {
      id: true,
      name: true,
      licenseNumber: true,
      licenseCategory: true,
      licenseExpiry: true,
      safetyScore: true,
      status: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function createDriver(data: Prisma.DriverCreateInput) {
  return prisma.driver.create({ data });
}

export async function updateDriver(id: number, data: Prisma.DriverUpdateInput) {
  return prisma.driver.update({
    where: { id },
    data,
  });
}

export async function suspendDriver(id: number) {
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) throw new Error("Driver not found");
  if (driver.status === "On Trip") throw new Error("Cannot suspend a driver on a trip");

  return prisma.driver.update({
    where: { id },
    data: { status: "Suspended" },
  });
}

export async function reinstateDriver(id: number) {
  return prisma.driver.update({
    where: { id },
    data: { status: "Available" },
  });
}

export async function checkLicenseUnique(licenseNumber: string, excludeId?: number) {
  const driver = await prisma.driver.findUnique({ where: { licenseNumber } });
  return !driver || (excludeId && driver.id === excludeId);
}