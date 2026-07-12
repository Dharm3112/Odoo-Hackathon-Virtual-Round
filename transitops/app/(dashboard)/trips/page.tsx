"use client";

import { useState } from "react";

interface Driver {
  id: string;
  name: string;
  status: string;
}

interface Vehicle {
  id: string;
  name: string;
  status: string;
  capacity: number;
}

export default function TripsPage() {
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    driverId: "",
    vehicleId: "",
    cargoWeight: "",
  });

  const drivers: Driver[] = [
    { id: "d1", name: "John Doe", status: "Enabled" },
    { id: "d2", name: "Michael Smith", status: "In Shop" },
    { id: "d3", name: "Jane Smith", status: "Suspended" },
    { id: "d4", name: "Sarah Connor", status: "Enabled" },
  ];

  const vehicles: Vehicle[] = [
    { id: "v1", name: "Truck 102 (Semi)", status: "Enabled", capacity: 50000 },
    { id: "v2", name: "Van 45 (Sprinter)", status: "Enabled", capacity: 2000 },
    { id: "v3", name: "Truck 105 (Semi)", status: "In Shop", capacity: 45000 },
    { id: "v4", name: "Truck 201 (Flatbed)", status: "Maintenance", capacity: 30000 },
  ];

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
  const cargoWeight = parseInt(formData.cargoWeight) || 0;
  const weightError = selectedVehicle && cargoWeight > selectedVehicle.capacity;

  const isFormValid =
    formData.source.trim() &&
    formData.destination.trim() &&
    formData.driverId &&
    formData.vehicleId &&
    formData.cargoWeight.trim() &&
    !weightError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Trip dispatched:", formData);
      alert("Trip dispatched successfully!");
    }
  };

  const selectedDriver = drivers.find(d => d.id === formData.driverId);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Trip Dispatcher</h1>
        <p className="font-body-md text-body-md text-outline">Configure and deploy new transit routes.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-margin">
        {/* Left Column: Create Trip Form */}
        <div className="w-full xl:w-5/12">
          <div className="bg-surface-dim rounded-xl border border-outline-variant p-6 h-full">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-6">Create Trip</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Source */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Source</label>
                <input
                  className="w-full bg-[#181818] border border-[#333333] rounded-lg px-4 py-2.5 font-body-md text-body-md text-primary placeholder-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="e.g., Warehouse A"
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                />
              </div>
              {/* Destination */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Destination</label>
                <input
                  className="w-full bg-[#181818] border border-[#333333] rounded-lg px-4 py-2.5 font-body-md text-body-md text-primary placeholder-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="e.g., Distribution Center B"
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                />
              </div>
              {/* Driver Selection */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Driver</label>
                <div className="relative">
                  <select
                    className="w-full bg-[#181818] border border-[#333333] rounded-lg px-4 py-2.5 font-body-md text-body-md text-primary appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
                    value={formData.driverId}
                    onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                  >
                    <option className="text-outline-variant" disabled value="">Select a Driver</option>
                    {drivers.map((d) => (
                      <option
                        key={d.id}
                        className={d.status === "Enabled" ? "text-primary" : "text-outline"}
                        disabled={d.status !== "Enabled"}
                        value={d.id}
                      >
                        {d.status}: {d.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-outline-variant">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>
              {/* Vehicle Selection */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Vehicle</label>
                <div className="relative">
                  <select
                    className="w-full bg-[#181818] border border-[#333333] rounded-lg px-4 py-2.5 font-body-md text-body-md text-primary appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  >
                    <option disabled value="">Select a Vehicle</option>
                    {vehicles.map((v) => (
                      <option
                        key={v.id}
                        className={v.status === "Enabled" ? "text-primary" : "text-outline"}
                        disabled={v.status !== "Enabled"}
                        value={v.id}
                      >
                        {v.status}: {v.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-outline-variant">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>
              {/* Cargo Weight */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Cargo Weight (kg)</label>
                <input
                  className={`w-full rounded-lg px-4 py-2.5 font-body-md text-body-md placeholder-outline-variant focus:outline-none focus:ring-1 transition-colors ${
                    weightError
                      ? "bg-[#2a1111] border border-error-container text-error focus:border-error focus:ring-error"
                      : "bg-[#181818] border border-[#333333] text-primary focus:border-primary focus:ring-primary"
                  }`}
                  type="number"
                  value={formData.cargoWeight}
                  onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })}
                  placeholder="0"
                />
                {weightError && (
                  <p className="mt-2 font-label-sm text-label-sm text-error">Error: Weight exceeds selected vehicle capacity.</p>
                )}
              </div>
              {/* Submit Button */}
              <div className="pt-4">
                {isFormValid ? (
                  <button
                    type="submit"
                    className="w-full bg-primary text-[#000000] font-label-md text-label-md py-3 rounded-lg hover:bg-surface-tint transition-colors"
                  >
                    Dispatch Trip
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full bg-surface-variant text-outline font-label-md text-label-md py-3 rounded-lg border border-[#333333] cursor-not-allowed transition-colors"
                  >
                    Dispatch Trip
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Trip Timeline */}
        <div className="w-full xl:w-7/12">
          <div className="bg-surface-dim rounded-xl border border-outline-variant p-6 h-full flex flex-col">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-8">Trip Timeline</h2>
            {/* Stepper */}
            <div className="flex items-center justify-between mb-10 w-full px-4">
              {/* Draft (Active/Current) */}
              <div className="flex flex-col items-center relative z-10 w-16">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <span className="material-symbols-outlined text-[#000000] icon-fill">draft</span>
                </div>
                <span className="font-label-sm text-label-sm text-primary text-center">Draft</span>
              </div>
              <div className="stepper-line active" style={{ flexGrow: 1, height: 2, backgroundColor: "#ffffff", margin: "0 12px" }}></div>
              {/* Dispatched (Pending) */}
              <div className="flex flex-col items-center relative z-10 w-16">
                <div className="w-10 h-10 rounded-full bg-surface-variant border border-[#333333] flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-outline">local_shipping</span>
                </div>
                <span className="font-label-sm text-label-sm text-outline text-center">Dispatched</span>
              </div>
              <div className="stepper-line" style={{ flexGrow: 1, height: 2, backgroundColor: "#333333", margin: "0 12px" }}></div>
              {/* Completed (Pending) */}
              <div className="flex flex-col items-center relative z-10 w-16">
                <div className="w-10 h-10 rounded-full bg-surface-variant border border-[#333333] flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-outline">check_circle</span>
                </div>
                <span className="font-label-sm text-label-sm text-outline text-center">Completed</span>
              </div>
              <div className="stepper-line" style={{ flexGrow: 1, height: 2, backgroundColor: "#333333", margin: "0 12px" }}></div>
              {/* Cancelled (Pending/Inactive) */}
              <div className="flex flex-col items-center relative z-10 w-16 opacity-50">
                <div className="w-10 h-10 rounded-full bg-surface-variant border border-[#333333] flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-outline">block</span>
                </div>
                <span className="font-label-sm text-label-sm text-outline text-center">Cancelled</span>
              </div>
            </div>

            {/* Trip Details Card */}
            <div className="bg-surface rounded-lg p-5 border border-outline-variant flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline-variant mb-1 uppercase tracking-wider">Draft Trip ID</span>
                  <span className="font-mono-data text-mono-data text-primary">TR-23490-DRF</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline-variant mb-1 uppercase tracking-wider">Status</span>
                  <div className="inline-flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="font-body-sm text-body-sm text-primary">Draft - Awaiting Details</span>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 border-t border-outline-variant my-2"></div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline-variant mb-1 uppercase tracking-wider">Source</span>
                  <span className="font-body-md text-body-md text-on-surface">{formData.source || "Warehouse A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline-variant mb-1 uppercase tracking-wider">Destination</span>
                  <span className="font-body-md text-body-md text-on-surface">{formData.destination || "Distribution Center B"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline-variant mb-1 uppercase tracking-wider">Assigned Driver</span>
                  <span className="font-body-md text-body-md text-outline italic">
                    {selectedDriver ? selectedDriver.name : "Not Selected"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline-variant mb-1 uppercase tracking-wider">Assigned Vehicle</span>
                  <span className="font-body-md text-body-md text-outline italic">
                    {selectedVehicle ? selectedVehicle.name : "Not Selected"}
                  </span>
                </div>
                <div className="col-span-1 md:col-span-2 mt-4">
                  <div className="bg-surface-variant/50 rounded p-3 border border-outline-variant">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-outline-variant mt-0.5 text-lg">info</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant m-0">
                        Complete all required fields in the creation form to generate route estimates and activate the dispatch sequence.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}