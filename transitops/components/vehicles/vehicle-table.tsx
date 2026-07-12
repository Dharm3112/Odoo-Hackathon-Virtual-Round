"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Truck, Search, Plus, Edit } from "lucide-react";
import { VehicleFormModal } from "./vehicle-form-modal";

const VEHICLE_TYPES = ["Van", "Truck", "Mini", "Bus", "Sedan"];
const VEHICLE_STATUSES = ["Available", "On Trip", "In Shop", "Retired"];

interface Vehicle {
  id: number;
  registrationNumber: string;
  nameModel: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: string;
  region?: string | null;
}

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit?: (vehicle: Vehicle) => void;
  onRetire?: (id: number) => void;
  canManage: boolean;
}

export function VehicleTable({ vehicles, onEdit, onRetire, canManage }: VehicleTableProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.nameModel.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || v.type === typeFilter;
    const matchesStatus = !statusFilter || v.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by registration or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || "")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {VEHICLE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "")}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {VEHICLE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {canManage && (
          <Dialog>
            <DialogTrigger
              render={
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Vehicle
                </Button>
              }
            />
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
              </DialogHeader>
              <VehicleFormModal
                onSuccess={() => {}}
                onClose={() => {}}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Registration</TableHead>
              <TableHead>Name / Model</TableHead>
              <TableHead className="w-32">Type</TableHead>
              <TableHead className="w-36 text-right">Max Capacity (kg)</TableHead>
              <TableHead className="w-32 text-right">Odometer (km)</TableHead>
              <TableHead className="w-36 text-right">Acquisition Cost (₹)</TableHead>
              <TableHead className="w-36">Status</TableHead>
              {canManage && <TableHead className="w-36">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canManage ? 8 : 7} className="text-center py-8 text-muted-foreground">
                  No vehicles found
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono font-medium">{vehicle.registrationNumber}</TableCell>
                  <TableCell>{vehicle.nameModel}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-muted">
                      <Truck className="w-3 h-3" />
                      {vehicle.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono">{vehicle.maxLoadCapacity.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">{vehicle.odometer.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">₹{vehicle.acquisitionCost.toLocaleString()}</TableCell>
                  <TableCell>
                    <StatusBadge status={vehicle.status} size="sm" />
                  </TableCell>
                  {canManage && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit?.(vehicle)}
                          className="h-8 w-8"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRetire?.(vehicle.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          title="Retire"
                        >
                          <Truck className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingVehicle} onOpenChange={(open) => !open && setEditingVehicle(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>
          {editingVehicle && (
            <VehicleFormModal
              initialData={editingVehicle}
              onSuccess={() => setEditingVehicle(null)}
              onClose={() => setEditingVehicle(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}