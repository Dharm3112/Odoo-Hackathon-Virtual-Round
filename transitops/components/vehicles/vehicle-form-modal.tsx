"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Truck, Loader2, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { VEHICLE_TYPES } from "@/lib/constants";

const vehicleSchema = z.object({
  registrationNumber: z
    .string()
    .min(1, "Registration number is required")
    .max(15, "Max 15 characters")
    .regex(/^[A-Z0-9-]+$/i, "Only alphanumeric characters and hyphens allowed"),
  nameModel: z.string().min(1, "Vehicle name/model is required").max(50, "Max 50 characters"),
  type: z.enum(VEHICLE_TYPES as [string, ...string[]]),
  maxLoadCapacity: z.coerce.number().positive("Must be greater than 0").max(50000, "Max 50,000 kg"),
  odometer: z.coerce.number().nonnegative("Cannot be negative").optional().default(0),
  acquisitionCost: z.coerce.number().nonnegative("Cannot be negative").optional().default(0),
  region: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormModalProps {
  initialData?: {
    id: number;
    registrationNumber: string;
    nameModel: string;
    type: string;
    maxLoadCapacity: number;
    odometer: number;
    acquisitionCost: number;
    region?: string | null;
    status: string;
  } | null;
  onSuccess: () => void;
  onClose: () => void;
  isOpen?: boolean;
}

export function VehicleFormModal({ initialData, onSuccess, onClose, isOpen = true }: VehicleFormModalProps) {
  const isEditing = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registrationNumber: initialData?.registrationNumber || "",
      nameModel: initialData?.nameModel || "",
      type: initialData?.type || VEHICLE_TYPES[0],
      maxLoadCapacity: initialData?.maxLoadCapacity || 1000,
      odometer: initialData?.odometer || 0,
      acquisitionCost: initialData?.acquisitionCost || 0,
      region: initialData?.region || "",
    },
  });

  const onSubmit = async (data: VehicleFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/vehicles/${initialData!.id}`
        : "/api/vehicles";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save vehicle");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            {isEditing ? "Edit Vehicle" : "Add New Vehicle"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number *</Label>
            <Input
              id="registrationNumber"
              placeholder="MH-12-AB-1234"
              disabled={isEditing}
              {...form.register("registrationNumber")}
            />
            {form.formState.errors.registrationNumber && (
              <p className="text-sm text-destructive">{form.formState.errors.registrationNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameModel">Vehicle Name / Model *</Label>
            <Input
              id="nameModel"
              placeholder="e.g., Tata Ace Gold"
              {...form.register("nameModel")}
            />
            {form.formState.errors.nameModel && (
              <p className="text-sm text-destructive">{form.formState.errors.nameModel.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select
              value={form.watch("type")}
              onValueChange={(v) => form.setValue("type", v as VehicleFormData["type"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxLoadCapacity">Max Load Capacity (kg) *</Label>
              <Input
                id="maxLoadCapacity"
                type="number"
                placeholder="1000"
                {...form.register("maxLoadCapacity")}
              />
              {form.formState.errors.maxLoadCapacity && (
                <p className="text-sm text-destructive">{form.formState.errors.maxLoadCapacity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="odometer">Odometer (km)</Label>
              <Input
                id="odometer"
                type="number"
                placeholder="0"
                {...form.register("odometer")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="acquisitionCost">Acquisition Cost (₹)</Label>
              <Input
                id="acquisitionCost"
                type="number"
                placeholder="0"
                {...form.register("acquisitionCost")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                placeholder="North / South / East / West"
                {...form.register("region")}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {isEditing ? "Update" : "Save Vehicle"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}