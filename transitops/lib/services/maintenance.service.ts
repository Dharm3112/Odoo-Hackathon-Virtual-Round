import { prisma } from "@/lib/prisma";
import type { CreateMaintenanceInput } from "@/lib/validations/maintenance.schema";

function makeCode(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
}

export async function getAllMaintenanceLogs() {
  return prisma.maintenanceLog.findMany({
    include: { vehicle: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createMaintenanceRecord(data: CreateMaintenanceInput) {
  return prisma.$transaction(async (tx) => {
    const vehicle = await tx.vehicle.findUnique({ where: { id: data.vehicleId } });
    if (!vehicle) throw new Error("Vehicle not found");
    if (vehicle.status === "On Trip") throw new Error("Cannot start maintenance while vehicle is On Trip");
    if (vehicle.status === "In Shop") throw new Error("Vehicle is already In Shop");
    if (vehicle.status === "Retired") throw new Error("Retired vehicles cannot enter maintenance");

    const [record] = await Promise.all([
      tx.maintenanceLog.create({
        data: {
          recordCode: makeCode("MNT"),
          vehicleId: data.vehicleId,
          serviceType: data.serviceType,
          description: data.description,
          cost: data.cost,
          status: "Active",
        },
        include: { vehicle: true },
      }),
      tx.vehicle.update({ where: { id: data.vehicleId }, data: { status: "In Shop" } }),
    ]);

    return record;
  });
}

export async function closeMaintenanceRecord(id: number, retireVehicle = false) {
  return prisma.$transaction(async (tx) => {
    const record = await tx.maintenanceLog.findUnique({ where: { id }, include: { vehicle: true } });
    if (!record) throw new Error("Maintenance record not found");
    if (record.status !== "Active") throw new Error("Only Active maintenance records can be closed");

    const [updatedRecord] = await Promise.all([
      tx.maintenanceLog.update({
        where: { id },
        data: { status: "Closed", closedAt: new Date() },
        include: { vehicle: true },
      }),
      tx.vehicle.update({
        where: { id: record.vehicleId },
        data: { status: retireVehicle ? "Retired" : "Available" },
      }),
    ]);

    return updatedRecord;
  });
}
