"use client";

import { useState } from "react";

export default function DriversPage() {
  const [activeTab, setActiveTab] = useState<"directory" | "safety">("directory");

  return (
    <div className="flex flex-col gap-margin max-w-[1600px] w-full mx-auto">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-headline-md text-headline-md text-primary">Driver Management</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Search drivers..." 
              className="w-full md:w-64 bg-surface-container border border-outline-variant rounded text-on-surface text-body-sm pl-9 pr-3 py-2 focus:outline-none focus:border-primary transition-colors placeholder:text-outline-variant"
            />
          </div>
          <button className="flex items-center gap-1 bg-primary text-background px-4 py-2 rounded font-label-md text-label-md hover:bg-surface-tint transition-colors whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px] icon-fill">person_add</span>
            Add Driver
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-variant">
        <button 
          onClick={() => setActiveTab("directory")}
          className={`px-6 py-3 font-label-md text-label-md uppercase tracking-wider transition-colors relative ${activeTab === "directory" ? "text-primary" : "text-outline hover:text-on-surface"}`}
        >
          Directory
          {activeTab === "directory" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("safety")}
          className={`px-6 py-3 font-label-md text-label-md uppercase tracking-wider transition-colors relative ${activeTab === "safety" ? "text-primary" : "text-outline hover:text-on-surface"}`}
        >
          Safety & Compliance
          {activeTab === "safety" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
        </button>
      </div>

      {activeTab === "directory" && (
        <div className="bg-surface-container border border-outline-variant rounded-lg flex flex-col overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-surface-variant bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold w-12 text-center"></th>
                  <th className="p-4 font-semibold">Name & ID</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Current Vehicle</th>
                  <th className="p-4 font-semibold">License Expiry</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm">
                
                {/* Driver 1 */}
                <tr className="border-b border-surface-variant hover:bg-surface-container-highest transition-colors group">
                  <td className="p-4 text-center">
                    <div className="w-8 h-8 rounded-full bg-surface-variant mx-auto flex items-center justify-center border border-outline-variant overflow-hidden">
                      <span className="material-symbols-outlined text-[20px] text-outline">person</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-primary font-medium text-body-md">Alex Johnson</span>
                      <span className="text-outline-variant text-[12px] font-mono-data">DRV-7492</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-status-blue/20 bg-status-blue/10 text-status-blue font-label-sm text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-blue animate-pulse-slow"></span>
                      ON TRIP
                    </span>
                  </td>
                  <td className="p-4 text-on-surface">Van-03</td>
                  <td className="p-4 text-on-surface">Oct 12, 2025</td>
                  <td className="p-4 text-right">
                    <button className="text-outline hover:text-primary transition-colors p-1" title="View Details">
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </td>
                </tr>

                {/* Driver 2 */}
                <tr className="border-b border-surface-variant hover:bg-surface-container-highest transition-colors group">
                  <td className="p-4 text-center">
                    <div className="w-8 h-8 rounded-full bg-surface-variant mx-auto flex items-center justify-center border border-outline-variant overflow-hidden">
                      <span className="material-symbols-outlined text-[20px] text-outline">person</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-primary font-medium text-body-md">Sarah Connor</span>
                      <span className="text-outline-variant text-[12px] font-mono-data">DRV-3810</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-status-green/20 bg-status-green/10 text-status-green font-label-sm text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-green"></span>
                      AVAILABLE
                    </span>
                  </td>
                  <td className="p-4 text-outline-variant italic">Unassigned</td>
                  <td className="p-4 text-on-surface">May 04, 2026</td>
                  <td className="p-4 text-right">
                    <button className="text-outline hover:text-primary transition-colors p-1" title="View Details">
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </td>
                </tr>

                {/* Driver 3 */}
                <tr className="border-b border-surface-variant hover:bg-surface-container-highest transition-colors group">
                  <td className="p-4 text-center">
                    <div className="w-8 h-8 rounded-full bg-surface-variant mx-auto flex items-center justify-center border border-outline-variant overflow-hidden">
                      <span className="material-symbols-outlined text-[20px] text-outline">person</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-primary font-medium text-body-md">Michael Chang</span>
                      <span className="text-outline-variant text-[12px] font-mono-data">DRV-9122</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-status-warning/20 bg-status-warning/10 text-status-warning font-label-sm text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-warning"></span>
                      EXPIRING SOON
                    </span>
                  </td>
                  <td className="p-4 text-on-surface">TRK-08</td>
                  <td className="p-4 text-status-warning font-medium">In 14 Days</td>
                  <td className="p-4 text-right">
                    <button className="text-outline hover:text-primary transition-colors p-1" title="View Details">
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "safety" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-container-gap">
          <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-4xl text-status-green icon-fill mb-2">check_circle</span>
            <span className="font-headline-lg text-headline-lg text-primary">98%</span>
            <span className="font-label-md text-label-md text-outline">Compliance Rate</span>
          </div>
          <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-4xl text-status-warning icon-fill mb-2">warning</span>
            <span className="font-headline-lg text-headline-lg text-status-warning">3</span>
            <span className="font-label-md text-label-md text-outline">Action Required</span>
          </div>
          <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-4xl text-status-blue icon-fill mb-2">timer</span>
            <span className="font-headline-lg text-headline-lg text-primary">2,450</span>
            <span className="font-label-md text-label-md text-outline">Safe Driving Hours</span>
          </div>
        </div>
      )}
    </div>
  );
}