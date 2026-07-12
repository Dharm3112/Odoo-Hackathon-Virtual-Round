import { z } from "zod";

export const createDriverSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Max 100 characters"),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseCategory: z.enum(["LMV", "HMV", "HGV"]),
  licenseExpiry: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits").max(15, "Max 15 characters"),
  safetyScore: z.coerce.number().min(0).max(100).optional().default(100),
});

export const updateDriverSchema = createDriverSchema.partial();

export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;