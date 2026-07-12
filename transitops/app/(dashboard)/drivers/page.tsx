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
import { Badge } from "@/components/ui/badge";
import { DriverFormModal } from "@/components/drivers/driver-form-modal";
import { ComplianceBadge } from "@/components/drivers/compliance-badge";
import { cn } from "@/lib/utils";
import { Plus, Search, Edit, User, UserX, UserCheck, MoreVertical, Eye } from "lucide-react";
import { DRIVER_STATUS } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Driver {
  id: number;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  contactNumber: string;
  safetyScore: number;
  status: string;
  safetyEvents: string | null;
}

export default function DriversPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission("drivers", "full");

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const fetchDrivers = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      params.set("limit", "50");

      const res = await fetch(`/api/drivers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setDrivers(data.drivers);
      }
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [search, statusFilter]);

  const handleSuspend = async (id: number) => {
    if (confirm("Are you sure you want to suspend this driver?")) {
      try {
        const res = await fetch(`/api/drivers/${id}/suspend`, { method: "PATCH" });
        if (res.ok) fetchDrivers();
      } catch (error) {
        console.error("Failed to suspend driver:", error);
      }
    }
  };

  const handleReinstate = async (id: number) => {
    try {
      const res = await fetch(`/api/drivers/${id}/reinstate`, { method: "PATCH" });
      if (res.ok) fetchDrivers();
    } catch (error) {
      console.error("Failed to reinstate driver:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Available: "default",
      "On Trip": "secondary",
      "Off Duty": "outline",
      Suspended: "destructive",
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
          <h1 className="text-3xl font-heading font-bold">Drivers & Safety</h1>
          <p className="text-muted-foreground">
            Manage drivers, monitor compliance, and track safety scores
          </p>
        </div>
        {canManage && (
          <Button onClick={() => { setEditingDriver(null); setShowModal(true); }} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Driver
          </Button>
        )}
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, license..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {Object.values(DRIVER_STATUS).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[140px]">License No.</TableHead>
              <TableHead className="w-[100px]">Category</TableHead>
              <TableHead className="w-[120px]">License Expiry</TableHead>
              <TableHead className="w-[160px]">Compliance</TableHead>
              <TableHead className="w-[100px]">Safety</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              {canManage && <TableHead className="w-[80px] text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={canManage ? 8 : 7} className="text-center py-8">
                  Loading drivers...
                </TableCell>
              </TableRow>
            ) : drivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canManage ? 8 : 7} className="text-center py-8 text-muted-foreground">
                  No drivers found
                </TableCell>
              </TableRow>
            ) : (
              drivers.map((driver) => (
                <TableRow key={driver.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell className="font-mono text-sm">{driver.licenseNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {driver.licenseCategory}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "text-sm",
                      new Date(driver.licenseExpiry) <= new Date() ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {new Date(driver.licenseExpiry).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ComplianceBadge
                      licenseExpiry={driver.licenseExpiry}
                      status={driver.status}
                      safetyScore={driver.safetyScore}
                    />
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "text-sm font-medium",
                      driver.safetyScore >= 80 ? "text-green-600" : driver.safetyScore >= 50 ? "text-yellow-600" : "text-red-600"
                    )}>
                      {driver.safetyScore}%
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(driver.status)}</TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditingDriver(driver); setShowModal(true); }}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {driver.status !== "Suspended" && (
                            <DropdownMenuItem onClick={() => handleSuspend(driver.id)} className="text-destructive">
                              <UserX className="w-4 h-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          {driver.status === "Suspended" && (
                            <DropdownMenuItem onClick={() => handleReinstate(driver.id)} className="text-green-600">
                              <UserCheck className="w-4 h-4 mr-2" />
                              Reinstate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setEditingDriver(driver); setShowModal(true); }}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DriverFormModal
        open={showModal}
        onOpenChange={setShowModal}
        initialData={editingDriver}
        onSubmit={() => { setShowModal(false); setEditingDriver(null); fetchDrivers(); }}
      />
    </div>
  );
}