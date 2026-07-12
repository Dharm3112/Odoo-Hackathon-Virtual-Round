"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
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
import { ComplianceBadge } from "./compliance-badge";
import { Search, Plus, Edit, Eye, User, UserX, UserCheck, MoreVertical } from "lucide-react";
import { DriverFormModal } from "./driver-form-modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const DRIVER_STATUSES = ["Available", "On Trip", "Off Duty", "Suspended"];

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

interface DriverTableProps {
  drivers: Driver[];
  onEdit?: (driver: Driver) => void;
  onSuspend?: (id: number) => void;
  onReinstate?: (id: number) => void;
  canManage: boolean;
}

export function DriverTable({ drivers, onEdit, onSuspend, onReinstate, canManage }: DriverTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Available: "default",
      "On Trip": "secondary",
      "Off Duty": "outline",
      Suspended: "destructive",
    };
    return <Badge variant={variants[status] || "default"} className="capitalize">{status}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
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
              {DRIVER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {canManage && (
          <Button onClick={() => { setEditingDriver(null); setShowModal(true); }} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Driver
          </Button>
        )}
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[140px]">License No.</TableHead>
              <TableHead className="w-[100px]">Category</TableHead>
              <TableHead className="w-[120px]">License Expiry</TableHead>
              <TableHead className="w-[140px]">Compliance</TableHead>
              <TableHead className="w-[120px]">Safety Score</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              {canManage && <TableHead className="w-[80px] text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canManage ? 8 : 7} className="text-center py-8 text-muted-foreground">
                  No drivers found
                </TableCell>
              </TableRow>
            ) : (
              filteredDrivers.map((driver) => (
                <TableRow key={driver.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell className="font-mono text-sm">{driver.licenseNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      <User className="w-3 h-3" />
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
                          <DropdownMenuItem onClick={() => onEdit?.(driver)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {driver.status !== "Suspended" && (
                            <DropdownMenuItem onClick={() => onSuspend?.(driver.id)} className="text-destructive">
                              <UserX className="w-4 h-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          {driver.status === "Suspended" && (
                            <DropdownMenuItem onClick={() => onReinstate?.(driver.id)} className="text-green-600">
                              <UserCheck className="w-4 h-4 mr-2" />
                              Reinstate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onEdit?.(driver)}>
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
        onSubmit={async () => { setShowModal(false); setEditingDriver(null); }}
      />
    </div>
  );
}