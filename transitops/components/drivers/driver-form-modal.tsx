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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Loader2, X, CheckCircle, User, AlertTriangle } from "lucide-react";

const driverSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseCategory: z.enum(["LMV", "HMV", "HGV"]),
  licenseExpiry: z.string().min(1, "License expiry is required"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits").max(15),
  safetyScore: z.coerce.number().min(0).max(100).optional().default(100),
});

type DriverFormData = z.infer<typeof driverSchema>;

interface DriverFormModalProps {
  initialData?: {
    id: number;
    name: string;
    licenseNumber: string;
    licenseCategory: "LMV" | "HMV" | "HGV";
    licenseExpiry: string;
    contactNumber: string;
    safetyScore: number;
    status: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

const LICENSE_CATEGORIES = ["LMV", "HMV", "HGV"] as const;

export function DriverFormModal({ initialData, open, onOpenChange, onSubmit }: DriverFormModalProps) {
  const isEditing = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: initialData?.name || "",
      licenseNumber: initialData?.licenseNumber || "",
      licenseCategory: (initialData?.licenseCategory as "LMV" | "HMV" | "HGV" | undefined) || "LMV",
      licenseExpiry: initialData?.licenseExpiry || "",
      contactNumber: initialData?.contactNumber || "",
      safetyScore: initialData?.safetyScore || 100,
    },
  });

  const handleSubmit = async (data: DriverFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const url = isEditing ? `/api/drivers/${initialData!.id}` : "/api/drivers";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save driver");
      }

      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {isEditing ? "Edit Driver" : "Add New Driver"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Enter full name"
              {...form.register("name")}
              disabled={isSubmitting}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseNumber">License Number *</Label>
            <Input
              id="licenseNumber"
              placeholder="MH1220200001234"
              {...form.register("licenseNumber")}
              disabled={isEditing || isSubmitting}
            />
            {form.formState.errors.licenseNumber && (
              <p className="text-sm text-destructive">{form.formState.errors.licenseNumber.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="licenseCategory">License Category *</Label>
              <Select
                value={form.watch("licenseCategory")}
                onValueChange={(v) => form.setValue("licenseCategory", v as DriverFormData["licenseCategory"])}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {LICENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseExpiry">License Expiry *</Label>
              <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("licenseExpiry") && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {form.watch("licenseExpiry") 
                      ? new Date(form.watch("licenseExpiry")).toLocaleDateString() 
                      : "Select date"}
                    <AlertTriangle className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100" />
                  </Button>
                }
              />
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarIcon
                    mode="single"
                    selected={form.watch("licenseExpiry") ? new Date(form.watch("licenseExpiry")) : undefined}
                    onSelect={(date) => date && form.setValue("licenseExpiry", date.toISOString().split("T")[0])}
                    disabled={isSubmitting}
                  />
                </PopoverContent>
              </Popover>
              <Input type="hidden" {...form.register("licenseExpiry")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number *</Label>
              <Input
                id="contactNumber"
                placeholder="+91-9876543210"
                {...form.register("contactNumber")}
                disabled={isSubmitting}
              />
              {form.formState.errors.contactNumber && (
                <p className="text-sm text-destructive">{form.formState.errors.contactNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="safetyScore">Initial Safety Score</Label>
              <Input
                id="safetyScore"
                type="number"
                min="0"
                max="100"
                {...form.register("safetyScore")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
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
                  {isEditing ? "Update" : "Save Driver"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}