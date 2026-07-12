import { z } from "zod";
import { SERVICE_TYPES } from "@/lib/constants";

export const createMaintenanceSchema = z.object({
  vehicleId: z.coerce.number().int().positive("Vehicle is required"),
  serviceType: z.enum(SERVICE_TYPES),
  description: z.string().optional(),
  cost: z.coerce.number().nonnegative("Cost cannot be negative"),
});

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;
