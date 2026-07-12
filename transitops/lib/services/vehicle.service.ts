import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getAllVehicles(filters?: {
  type?: string;
  status?: string;
  region?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const where: Prisma.VehicleWhereInput = {};

  if (filters?.type) where.type = filters.type;
  if (filters?.status) where.status = filters.status;
  if (filters?.region) where.region = filters.region;
  if (filters?.search) {
    where.OR = [
      { registrationNumber: { contains: filters.search, mode: "insensitive" } },
      { nameModel: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 20;
  const skip = (page - 1) * limit;

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.vehicle.count({ where }),
  ]);

  return {
    vehicles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getVehicleById(id: number) {
  return prisma.vehicle.findUnique({
    where: { id },
    include: {
      trips: { take: 5, orderBy: { createdAt: "desc" } },
      maintenanceLogs: { take: 5, orderBy: { createdAt: "desc" } },
      fuelLogs: { take: 5, orderBy: { logDate: "desc" } },
    },
  });
}

export async function getAvailableVehicles() {
  return prisma.vehicle.findMany({
    where: { status: "Available" },
    select: { id: true, registrationNumber: true, nameModel: true, type: true, maxLoadCapacity: true, odometer: true },
    orderBy: { nameModel: "asc" },
  });
}

export async function createVehicle(data: Prisma.VehicleCreateInput) {
  return prisma.vehicle.create({ data });
}

export async function updateVehicle(id: number, data: Prisma.VehicleUpdateInput) {
  return prisma.vehicle.update({
    where: { id },
    data,
  });
}

export async function retireVehicle(id: number) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw new Error("Vehicle not found");
  if (vehicle.status === "On Trip") throw new Error("Cannot retire a vehicle that is on a trip");

  return prisma.vehicle.update({
    where: { id },
    data: { status: "Retired" },
  });
}

export async function checkRegistrationUnique(registrationNumber: string, excludeId?: number) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { registrationNumber },
  });
  return !vehicle || (excludeId && vehicle.id === excludeId);
}