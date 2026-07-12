import { z } from "zod";

export const createVehicleSchema = z.object({
  registrationNumber: z
    .string()
    .min(1, "Registration number is required")
    .max(15, "Registration number must be 15 characters or less")
    .regex(/^[A-Z0-9-]+$/i, "Only alphanumeric characters and hyphens allowed"),
  nameModel: z.string().min(1, "Vehicle name/model is required").max(50, "Name must be 50 characters or less"),
  type: z.enum(["Van", "Truck", "Mini", "Bus", "Sedan"]),
  maxLoadCapacity: z.number().positive("Max load capacity must be greater than 0").max(50000, "Max capacity cannot exceed 50,000 kg"),
  odometer: z.number().nonnegative("Odometer cannot be negative").optional().default(0),
  acquisitionCost: z.number().nonnegative("Acquisition cost cannot be negative").optional().default(0),
  region: z.string().optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial().omit({ registrationNumber: true });

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;