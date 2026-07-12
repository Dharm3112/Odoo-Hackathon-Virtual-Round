"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus, Search, Edit } from "lucide-react";
import { VehicleFormModal } from "@/components/vehicles/vehicle-form-modal";
import { VEHICLE_TYPES, VEHICLE_STATUS } from "@/lib/constants";

interface Vehicle {
  id: number;
  registrationNumber: string;
  nameModel: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: string;
  region: string | null;
}

export default function VehiclesPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission("fleet", "full");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const fetchVehicles = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (typeFilter) params.set("type", typeFilter);
      if (statusFilter) params.set("status", statusFilter);
      params.set("limit", "50");

      const res = await fetch(`/api/vehicles?${params}`);
      if (res.ok) {
        const data = await res.json();
        setVehicles(data.vehicles);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, typeFilter, statusFilter]);

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingVehicle(null);
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Available: "default",
      "On Trip": "secondary",
      "In Shop": "destructive",
      Retired: "outline",
    };
    return (
      <Badge variant={variants[status] || "default"} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Vehicle Registry</h1>
          <p className="text-muted-foreground">
            Manage your fleet vehicles, track status, and monitor capacity
          </p>
        </div>
        {canManage && (
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Vehicle
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="pb-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search registration, name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                {Object.keys(VEHICLE_STATUS).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Registration</TableHead>
                  <TableHead>Name / Model</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[140px] text-right">Max Capacity (kg)</TableHead>
                  <TableHead className="w-[120px] text-right">Odometer (km)</TableHead>
                  <TableHead className="w-[140px] text-right">Acquisition Cost (₹)</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead className="w-[100px]">Region</TableHead>
                  {canManage && <TableHead className="w-[80px] text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={canManage ? 9 : 8} className="text-center py-8">
                      Loading vehicles...
                    </TableCell>
                  </TableRow>
                ) : vehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canManage ? 9 : 8} className="text-center py-8">
                      No vehicles found
                    </TableCell>
                  </TableRow>
                ) : (
                  vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-medium">
                        {vehicle.registrationNumber}
                      </TableCell>
                      <TableCell className="font-medium">{vehicle.nameModel}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Truck className="w-3 h-3" />
                          {vehicle.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {vehicle.maxLoadCapacity.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {vehicle.odometer.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ₹{vehicle.acquisitionCost.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {vehicle.region || "—"}
                      </TableCell>
                      {canManage && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(vehicle)}
                            className="h-8 w-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <VehicleFormModal
        open={showModal}
        onOpenChange={setShowModal}
        vehicle={editingVehicle}
        onSubmit={fetchVehicles}
      />
    </div>
  );
}