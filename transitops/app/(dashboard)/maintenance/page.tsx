"use client";

import { useState } from "react";

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "logs">("overview");

  return (
    <div className="flex flex-col gap-margin max-w-[1600px] w-full mx-auto">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-headline-md text-headline-md text-primary">Maintenance Hub</h1>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Search vehicles..." 
              className="w-full md:w-64 bg-surface-container border border-outline-variant rounded text-on-surface text-body-sm pl-9 pr-3 py-2 focus:outline-none focus:border-primary transition-colors placeholder:text-outline-variant"
            />
          </div>
          <button className="flex items-center gap-1 bg-surface-container-high border border-outline-variant text-on-surface px-4 py-2 rounded font-label-md text-label-md hover:bg-surface-container-highest transition-colors whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px] icon-fill">add</span>
            Log Issue
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-variant">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 font-label-md text-label-md uppercase tracking-wider transition-colors relative ${activeTab === "overview" ? "text-primary" : "text-outline hover:text-on-surface"}`}
        >
          Overview
          {activeTab === "overview" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("logs")}
          className={`px-6 py-3 font-label-md text-label-md uppercase tracking-wider transition-colors relative ${activeTab === "logs" ? "text-primary" : "text-outline hover:text-on-surface"}`}
        >
          Logs & Requests
          {activeTab === "logs" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-container-gap">
          {/* Left Col */}
          <div className="lg:col-span-2 flex flex-col gap-container-gap">
            <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex items-center justify-between">
               <div>
                 <h2 className="font-headline-sm text-headline-sm text-primary mb-1">Fleet Health Score</h2>
                 <p className="font-body-sm text-body-sm text-outline-variant">Based on recent inspections and maintenance logs.</p>
               </div>
               <div className="flex items-center gap-4">
                 <div className="font-headline-lg text-[48px] text-status-green">92%</div>
               </div>
            </div>

            <h3 className="font-headline-sm text-headline-sm text-primary mt-2">Upcoming Scheduled Maintenance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Item 1 */}
               <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 flex flex-col gap-3 group hover:border-outline transition-colors cursor-pointer">
                 <div className="flex justify-between items-start">
                   <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-outline">directions_car</span>
                     <span className="font-body-md text-body-md text-primary font-medium">Van-05</span>
                   </div>
                   <span className="font-label-sm text-label-sm text-outline px-2 py-0.5 border border-outline-variant rounded">Oil Change</span>
                 </div>
                 <div className="flex items-center gap-2 text-status-warning font-label-md text-label-md">
                   <span className="material-symbols-outlined text-[16px]">schedule</span>
                   Due in 3 days
                 </div>
               </div>
               
               {/* Item 2 */}
               <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 flex flex-col gap-3 group hover:border-outline transition-colors cursor-pointer">
                 <div className="flex justify-between items-start">
                   <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-outline">local_shipping</span>
                     <span className="font-body-md text-body-md text-primary font-medium">TRK-14</span>
                   </div>
                   <span className="font-label-sm text-label-sm text-outline px-2 py-0.5 border border-outline-variant rounded">Tire Rotation</span>
                 </div>
                 <div className="flex items-center gap-2 text-on-surface font-label-md text-label-md">
                   <span className="material-symbols-outlined text-[16px]">schedule</span>
                   Due in 12 days
                 </div>
               </div>
            </div>
          </div>
          
          {/* Right Col */}
          <div className="flex flex-col gap-container-gap">
            <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col gap-4">
              <h3 className="font-headline-sm text-headline-sm text-primary">In Shop Right Now</h3>
              
              <div className="flex flex-col gap-3 border-t border-surface-variant pt-3">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-body-md text-body-md text-primary font-medium">TRK-02</span>
                    <span className="font-label-sm text-label-sm text-outline-variant">Engine Diagnostics</span>
                  </div>
                  <span className="font-mono-data text-body-sm text-status-warning">Est. 2 Days</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-surface-variant pt-3">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-body-md text-body-md text-primary font-medium">Van-11</span>
                    <span className="font-label-sm text-label-sm text-outline-variant">Brake Pad Replacement</span>
                  </div>
                  <span className="font-mono-data text-body-sm text-status-green">Est. Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="bg-surface-container border border-outline-variant rounded-lg flex flex-col overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-variant bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Vehicle</th>
                  <th className="p-4 font-semibold">Issue / Task</th>
                  <th className="p-4 font-semibold">Date Logged</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm">
                
                <tr className="border-b border-surface-variant hover:bg-surface-container-highest transition-colors group">
                  <td className="p-4 font-medium text-primary">TRK-12</td>
                  <td className="p-4 text-on-surface">Routine Inspection</td>
                  <td className="p-4 text-outline-variant font-mono-data">Oct 14, 2024</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-status-green/20 bg-status-green/10 text-status-green font-label-sm text-[11px]">
                      RESOLVED
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono-data text-primary">$150.00</td>
                </tr>

                <tr className="border-b border-surface-variant hover:bg-surface-container-highest transition-colors group">
                  <td className="p-4 font-medium text-primary">Van-08</td>
                  <td className="p-4 text-on-surface">Check Engine Light</td>
                  <td className="p-4 text-outline-variant font-mono-data">Oct 15, 2024</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-status-warning/20 bg-status-warning/10 text-status-warning font-label-sm text-[11px]">
                      IN PROGRESS
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono-data text-outline-variant">Pending</td>
                </tr>

                <tr className="border-b border-surface-variant hover:bg-surface-container-highest transition-colors group">
                  <td className="p-4 font-medium text-primary">TRK-05</td>
                  <td className="p-4 text-on-surface">Transmission Fluid Leak</td>
                  <td className="p-4 text-outline-variant font-mono-data">Oct 16, 2024</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-status-suspended/20 bg-status-suspended/10 text-status-suspended font-label-sm text-[11px]">
                      QUEUED
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono-data text-outline-variant">Pending</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
