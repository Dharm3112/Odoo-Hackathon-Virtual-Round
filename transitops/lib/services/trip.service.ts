import { prisma } from "@/lib/prisma";
import type { CompleteTripInput, CreateTripInput } from "@/lib/validations/trip.schema";
import { Prisma } from "@prisma/client";

function makeCode(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
}

export async function getAllTrips(filters?: {
  status?: string;
  vehicleId?: number;
  driverId?: number;
  page?: number;
  limit?: number;
}) {
  const where: Prisma.TripWhereInput = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.vehicleId) where.vehicleId = filters.vehicleId;
  if (filters?.driverId) where.driverId = filters.driverId;

  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 20;
  const skip = (page - 1) * limit;

  const [trips, total] = await Promise.all([
    prisma.trip.findMany({
      where,
      skip,
      take: limit,
      include: { vehicle: true, driver: true, createdBy: { select: { id: true, fullName: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.trip.count({ where }),
  ]);

  return { trips, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getTripById(id: number) {
  return prisma.trip.findUnique({
    where: { id },
    include: { vehicle: true, driver: true, createdBy: { select: { id: true, fullName: true, email: true } } },
  });
}

export async function createTrip(data: CreateTripInput, userId: number) {
  const [vehicle, driver] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: data.vehicleId } }),
    prisma.driver.findUnique({ where: { id: data.driverId } }),
  ]);

  if (!vehicle) throw new Error("Vehicle not found");
  if (!driver) throw new Error("Driver not found");
  if (vehicle.status !== "Available") throw new Error("Vehicle must be Available before dispatch assignment");
  if (driver.status !== "Available") throw new Error("Driver must be Available before dispatch assignment");
  if (driver.licenseExpiry <= new Date()) throw new Error("Driver license is expired");
  if (data.cargoWeight > vehicle.maxLoadCapacity) {
    const overBy = data.cargoWeight - vehicle.maxLoadCapacity;
    throw new Error(`Cargo weight exceeds vehicle capacity by ${overBy} kg`);
  }

  return prisma.trip.create({
    data: {
      tripCode: makeCode("TRP"),
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      createdById: userId,
      source: data.source,
      destination: data.destination,
      cargoWeight: data.cargoWeight,
      plannedDistance: data.plannedDistance,
      revenue: data.revenue,
      status: "Draft",
    },
    include: { vehicle: true, driver: true },
  });
}

export async function dispatchTrip(id: number) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({ where: { id }, include: { vehicle: true, driver: true } });
    if (!trip) throw new Error("Trip not found");
    if (trip.status !== "Draft") throw new Error("Only Draft trips can be dispatched");
    if (trip.vehicle.status !== "Available") throw new Error("Vehicle is no longer Available");
    if (trip.driver.status !== "Available") throw new Error("Driver is no longer Available");
    if (trip.driver.licenseExpiry <= new Date()) throw new Error("Driver license is expired");
    if (trip.cargoWeight > trip.vehicle.maxLoadCapacity) throw new Error("Cargo weight exceeds vehicle capacity");

    const [updatedTrip] = await Promise.all([
      tx.trip.update({
        where: { id },
        data: { status: "Dispatched", dispatchedAt: new Date(), startOdometer: trip.vehicle.odometer },
        include: { vehicle: true, driver: true },
      }),
      tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: "On Trip" } }),
      tx.driver.update({ where: { id: trip.driverId }, data: { status: "On Trip" } }),
    ]);

    return updatedTrip;
  });
}

export async function completeTrip(id: number, data: CompleteTripInput) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({ where: { id }, include: { vehicle: true, driver: true } });
    if (!trip) throw new Error("Trip not found");
    if (trip.status !== "Dispatched") throw new Error("Only Dispatched trips can be completed");
    const startOdometer = trip.startOdometer ?? trip.vehicle.odometer;
    if (data.endOdometer < startOdometer) throw new Error("End odometer cannot be less than start odometer");
    const actualDistance = data.endOdometer - startOdometer;

    const [updatedTrip] = await Promise.all([
      tx.trip.update({
        where: { id },
        data: {
          status: "Completed",
          completedAt: new Date(),
          endOdometer: data.endOdometer,
          fuelConsumed: data.fuelConsumed,
          actualDistance,
        },
        include: { vehicle: true, driver: true },
      }),
      tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: "Available", odometer: data.endOdometer } }),
      tx.driver.update({ where: { id: trip.driverId }, data: { status: "Available" } }),
      tx.fuelLog.create({
        data: {
          logCode: makeCode("FUEL"),
          vehicleId: trip.vehicleId,
          logDate: new Date(),
          liters: data.fuelConsumed,
          costPerLiter: 0,
          totalCost: 0,
          odometerAtFill: data.endOdometer,
          approvalStatus: "Pending",
        },
      }),
    ]);

    return updatedTrip;
  });
}

export async function cancelTrip(id: number) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({ where: { id }, include: { vehicle: true, driver: true } });
    if (!trip) throw new Error("Trip not found");
    if (trip.status === "Completed") throw new Error("Completed trips cannot be cancelled");
    if (trip.status === "Cancelled") throw new Error("Trip is already cancelled");

    const updates: Promise<unknown>[] = [
      tx.trip.update({
        where: { id },
        data: { status: "Cancelled", cancelledAt: new Date() },
        include: { vehicle: true, driver: true },
      }),
    ];

    if (trip.status === "Dispatched") {
      updates.push(tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: "Available" } }));
      updates.push(tx.driver.update({ where: { id: trip.driverId }, data: { status: "Available" } }));
    }

    const [updatedTrip] = await Promise.all(updates);
    return updatedTrip;
  });
}
