import { z } from "zod";

export const createTripSchema = z.object({
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  vehicleId: z.coerce.number().int().positive("Vehicle is required"),
  driverId: z.coerce.number().int().positive("Driver is required"),
  cargoWeight: z.coerce.number().positive("Cargo weight must be greater than 0"),
  plannedDistance: z.coerce.number().positive("Planned distance must be greater than 0"),
  revenue: z.coerce.number().nonnegative().optional(),
});

export const completeTripSchema = z.object({
  endOdometer: z.coerce.number().nonnegative("End odometer cannot be negative"),
  fuelConsumed: z.coerce.number().positive("Fuel consumed must be greater than 0"),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type CompleteTripInput = z.infer<typeof completeTripSchema>;
