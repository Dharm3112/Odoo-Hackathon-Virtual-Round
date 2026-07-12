"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/components/providers/auth-provider";
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

const STATUS_COLORS: Record<string, { dot: string; text: string; bg: string }> = {
  Available: { dot: "bg-status-green", text: "text-status-green", bg: "bg-status-green/10" },
  "On Trip": { dot: "bg-status-blue", text: "text-status-blue", bg: "bg-status-blue/10" },
  "In Shop": { dot: "bg-status-yellow", text: "text-status-yellow", bg: "bg-status-yellow/10" },
  Retired: { dot: "bg-status-gray", text: "text-status-gray", bg: "bg-status-gray/10" },
};

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

  // Filter dropdowns open state
  const [openFilter, setOpenFilter] = useState<string | null>(null);

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

  // Close filter dropdowns when clicking outside
  useEffect(() => {
    const handleClick = () => setOpenFilter(null);
    if (openFilter) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [openFilter]);

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingVehicle(null);
    setShowModal(true);
  };

  // Compute summary stats
  const stats = useMemo(() => {
    const total = vehicles.length;
    const available = vehicles.filter(v => v.status === "Available").length;
    const onTrip = vehicles.filter(v => v.status === "On Trip").length;
    const inShop = vehicles.filter(v => v.status === "In Shop").length;
    const retired = vehicles.filter(v => v.status === "Retired").length;
    return { total, available, onTrip, inShop, retired };
  }, [vehicles]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Vehicle Registry</h1>
          <p className="font-body-md text-body-md text-outline">
            Manage your fleet vehicles, track status, and monitor capacity.
          </p>
        </div>
        {canManage && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-primary text-[#000000] font-label-md text-label-md px-5 py-2.5 rounded-lg hover:bg-surface-tint transition-colors self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Vehicle
          </button>
        )}
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-container-gap mb-margin">
        {/* Total Fleet */}
        <div className="bg-surface-container p-4 border border-surface-variant rounded flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>
          <h3 className="font-label-sm text-label-sm text-outline mb-2">TOTAL FLEET</h3>
          <div className="font-headline-lg text-headline-lg text-primary font-mono-data">{String(stats.total).padStart(2, "0")}</div>
        </div>
        {/* Available */}
        <div className="bg-surface-container p-4 border border-surface-variant rounded flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-status-green"></div>
          <h3 className="font-label-sm text-label-sm text-outline mb-2">AVAILABLE</h3>
          <div className="font-headline-lg text-headline-lg text-status-green font-mono-data">{String(stats.available).padStart(2, "0")}</div>
        </div>
        {/* On Trip */}
        <div className="bg-surface-container p-4 border border-surface-variant rounded flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-status-blue"></div>
          <h3 className="font-label-sm text-label-sm text-outline mb-2">ON TRIP</h3>
          <div className="font-headline-lg text-headline-lg text-status-blue font-mono-data">{String(stats.onTrip).padStart(2, "0")}</div>
        </div>
        {/* In Shop */}
        <div className="bg-surface-container p-4 border border-surface-variant rounded flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-status-yellow"></div>
          <h3 className="font-label-sm text-label-sm text-outline mb-2">IN SHOP</h3>
          <div className="font-headline-lg text-headline-lg text-status-yellow font-mono-data">{String(stats.inShop).padStart(2, "0")}</div>
        </div>
        {/* Retired */}
        <div className="bg-surface-container p-4 border border-surface-variant rounded flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-status-gray opacity-70"></div>
          <h3 className="font-label-sm text-label-sm text-outline mb-2">RETIRED</h3>
          <div className="font-headline-lg text-headline-lg text-status-gray font-mono-data opacity-80">{String(stats.retired).padStart(2, "0")}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-margin pb-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search registration, name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg text-on-surface font-body-md text-body-md pl-10 pr-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline-variant"
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setOpenFilter(openFilter === "type" ? null : "type"); }}
            className="bg-surface-container border border-outline-variant rounded-lg px-4 py-2 flex items-center gap-2 font-body-md text-body-md text-outline hover:text-primary hover:border-outline transition-colors whitespace-nowrap"
          >
            Type: <span className="text-primary">{typeFilter || "All"}</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
          {openFilter === "type" && (
            <div className="absolute top-full left-0 mt-1 bg-surface-container-high border border-outline-variant rounded-lg py-1 z-50 min-w-[160px] shadow-lg">
              <button
                onClick={() => { setTypeFilter(""); setOpenFilter(null); }}
                className={`w-full text-left px-4 py-2 font-body-md text-body-md transition-colors ${!typeFilter ? "text-primary bg-surface-container-highest" : "text-on-surface-variant hover:bg-surface-container-highest hover:text-primary"}`}
              >
                All Types
              </button>
              {VEHICLE_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => { setTypeFilter(t); setOpenFilter(null); }}
                  className={`w-full text-left px-4 py-2 font-body-md text-body-md transition-colors ${typeFilter === t ? "text-primary bg-surface-container-highest" : "text-on-surface-variant hover:bg-surface-container-highest hover:text-primary"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setOpenFilter(openFilter === "status" ? null : "status"); }}
            className="bg-surface-container border border-outline-variant rounded-lg px-4 py-2 flex items-center gap-2 font-body-md text-body-md text-outline hover:text-primary hover:border-outline transition-colors whitespace-nowrap"
          >
            Status: <span className="text-primary">{statusFilter || "All"}</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
          {openFilter === "status" && (
            <div className="absolute top-full left-0 mt-1 bg-surface-container-high border border-outline-variant rounded-lg py-1 z-50 min-w-[160px] shadow-lg">
              <button
                onClick={() => { setStatusFilter(""); setOpenFilter(null); }}
                className={`w-full text-left px-4 py-2 font-body-md text-body-md transition-colors ${!statusFilter ? "text-primary bg-surface-container-highest" : "text-on-surface-variant hover:bg-surface-container-highest hover:text-primary"}`}
              >
                All Status
              </button>
              {Object.values(VEHICLE_STATUS).map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setOpenFilter(null); }}
                  className={`w-full text-left px-4 py-2 font-body-md text-body-md transition-colors flex items-center gap-2 ${statusFilter === s ? "text-primary bg-surface-container-highest" : "text-on-surface-variant hover:bg-surface-container-highest hover:text-primary"}`}
                >
                  <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[s]?.dot || "bg-outline"}`}></div>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-surface-container border border-surface-variant rounded flex flex-col">
        <div className="p-4 border-b border-surface-variant flex items-center justify-between">
          <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
            FLEET REGISTRY
          </h3>
          <span className="font-label-sm text-label-sm text-outline-variant">
            {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-surface-variant bg-[#181818]">
                <th className="py-3 px-4 font-label-sm text-label-sm text-outline uppercase tracking-wider">Registration</th>
                <th className="py-3 px-4 font-label-sm text-label-sm text-outline uppercase tracking-wider">Name / Model</th>
                <th className="py-3 px-4 font-label-sm text-label-sm text-outline uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 font-label-sm text-label-sm text-outline uppercase tracking-wider text-right">Capacity (kg)</th>
                <th className="py-3 px-4 font-label-sm text-label-sm text-outline uppercase tracking-wider text-right">Odometer (km)</th>
                <th className="py-3 px-4 font-label-sm text-label-sm text-outline uppercase tracking-wider text-right">Cost (₹)</th>
                <th className="py-3 px-4 font-label-sm text-label-sm text-outline uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-label-sm text-label-sm text-outline uppercase tracking-wider">Region</th>
                {canManage && (
                  <th className="py-3 px-4 font-label-sm text-label-sm text-outline uppercase tracking-wider text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="font-mono-data text-mono-data">
              {loading ? (
                <tr>
                  <td colSpan={canManage ? 9 : 8} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-outline-variant border-t-primary rounded-full animate-spin"></div>
                      <span className="font-body-sm text-body-sm text-outline">Loading vehicles...</span>
                    </div>
                  </td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 9 : 8} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-outline-variant text-4xl">local_shipping</span>
                      <span className="font-body-md text-body-md text-outline">No vehicles found</span>
                      <span className="font-body-sm text-body-sm text-outline-variant">
                        {search || typeFilter || statusFilter
                          ? "Try adjusting your filters"
                          : "Add your first vehicle to get started"}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle) => {
                  const statusStyle = STATUS_COLORS[vehicle.status] || { dot: "bg-outline", text: "text-outline", bg: "bg-outline/10" };
                  return (
                    <tr
                      key={vehicle.id}
                      className="border-b border-surface-variant hover:bg-[#202020] transition-colors group"
                    >
                      <td className="py-3 px-4 text-on-surface font-medium">{vehicle.registrationNumber}</td>
                      <td className="py-3 px-4 text-on-surface">{vehicle.nameModel}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 text-outline">
                          <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                          {vehicle.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-on-surface">{vehicle.maxLoadCapacity.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-outline">{vehicle.odometer.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-outline">₹{vehicle.acquisitionCost.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-outline">{vehicle.region || "—"}</td>
                      {canManage && (
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleEdit(vehicle)}
                            className="text-outline hover:text-primary transition-colors p-1.5 rounded hover:bg-surface-container-highest opacity-0 group-hover:opacity-100"
                            title="Edit vehicle"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <VehicleFormModal
        open={showModal}
        onOpenChange={setShowModal}
        vehicle={editingVehicle}
        onSubmit={fetchVehicles}
      />
    </div>
  );
}