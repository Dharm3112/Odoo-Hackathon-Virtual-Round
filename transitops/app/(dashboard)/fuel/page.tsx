"use client";

import { useState } from "react";

export default function FuelExpensesPage() {
  const [activeTab, setActiveTab] = useState<"log" | "ledger">("log");

  return (
    <div className="flex flex-col gap-margin max-w-[1600px] w-full mx-auto">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-headline-md text-headline-md text-primary">Fuel & Expenses</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 bg-surface-container-high border border-outline-variant text-on-surface px-4 py-2 rounded font-label-md text-label-md hover:bg-surface-container-highest transition-colors whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-variant">
        <button 
          onClick={() => setActiveTab("log")}
          className={`px-6 py-3 font-label-md text-label-md uppercase tracking-wider transition-colors relative ${activeTab === "log" ? "text-primary" : "text-outline hover:text-on-surface"}`}
        >
          Log Expense
          {activeTab === "log" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("ledger")}
          className={`px-6 py-3 font-label-md text-label-md uppercase tracking-wider transition-colors relative ${activeTab === "ledger" ? "text-primary" : "text-outline hover:text-on-surface"}`}
        >
          Ledger
          {activeTab === "ledger" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
        </button>
      </div>

      {activeTab === "log" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-container-gap">
          <div className="bg-surface-container border border-outline-variant rounded-lg p-6">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-6">New Expense Entry</h2>
            
            <form className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface">Expense Type</label>
                <div className="flex gap-4 border border-outline-variant rounded p-1 bg-surface-container-low">
                  <label className="flex-1 text-center py-2 rounded cursor-pointer bg-primary text-background font-label-md transition-colors">
                    <input type="radio" name="expenseType" value="fuel" className="hidden" defaultChecked />
                    Fuel
                  </label>
                  <label className="flex-1 text-center py-2 rounded cursor-pointer text-outline hover:text-primary transition-colors font-label-md">
                    <input type="radio" name="expenseType" value="toll" className="hidden" />
                    Toll
                  </label>
                  <label className="flex-1 text-center py-2 rounded cursor-pointer text-outline hover:text-primary transition-colors font-label-md">
                    <input type="radio" name="expenseType" value="other" className="hidden" />
                    Other
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface">Vehicle</label>
                  <select className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2 text-on-surface text-body-sm focus:outline-none focus:border-primary appearance-none">
                    <option value="">Select vehicle...</option>
                    <option value="v1">TRK-12</option>
                    <option value="v2">VAN-03</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface">Driver</label>
                  <select className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2 text-on-surface text-body-sm focus:outline-none focus:border-primary appearance-none">
                    <option value="">Select driver...</option>
                    <option value="d1">Sarah Connor</option>
                    <option value="d2">Alex Johnson</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface">Amount ($)</label>
                  <input type="number" step="0.01" placeholder="0.00" className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2 text-primary font-mono-data focus:outline-none focus:border-primary placeholder:text-outline-variant" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md text-on-surface">Volume (Liters)</label>
                  <input type="number" step="0.1" placeholder="0.0" className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2 text-primary font-mono-data focus:outline-none focus:border-primary placeholder:text-outline-variant" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface">Receipt Upload</label>
                <div className="border-2 border-dashed border-outline-variant rounded-lg p-8 flex flex-col items-center justify-center gap-2 bg-surface-container-low/50 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[32px] text-outline">upload_file</span>
                  <span className="font-body-sm text-body-sm text-on-surface">Click or drag receipt here</span>
                  <span className="font-label-sm text-label-sm text-outline-variant">JPG, PNG, PDF (Max 5MB)</span>
                </div>
              </div>

              <button type="button" className="bg-primary text-background font-label-md text-label-md py-3 rounded hover:bg-surface-tint transition-colors w-full mt-2">
                Submit Expense
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "ledger" && (
        <div className="bg-surface-container border border-outline-variant rounded-lg flex flex-col overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-variant bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Vehicle / Driver</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold text-right">Volume</th>
                  <th className="p-4 font-semibold text-right">Amount</th>
                  <th className="p-4 font-semibold text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm">
                
                <tr className="border-b border-surface-variant hover:bg-surface-container-highest transition-colors group">
                  <td className="p-4 text-outline-variant font-mono-data">Oct 16, 2024</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-primary font-medium text-body-md">TRK-12</span>
                      <span className="text-outline-variant text-[12px]">Sarah Connor</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-outline-variant/30 bg-surface-variant text-outline font-label-sm text-[11px]">
                      FUEL
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono-data text-on-surface">120.5 L</td>
                  <td className="p-4 text-right font-mono-data text-primary">$184.50</td>
                  <td className="p-4 text-center">
                    <button className="text-outline hover:text-primary transition-colors p-1" title="View Receipt">
                      <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                    </button>
                  </td>
                </tr>

                <tr className="border-b border-surface-variant hover:bg-surface-container-highest transition-colors group">
                  <td className="p-4 text-outline-variant font-mono-data">Oct 15, 2024</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-primary font-medium text-body-md">Van-03</span>
                      <span className="text-outline-variant text-[12px]">Alex Johnson</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-status-blue/20 bg-status-blue/10 text-status-blue font-label-sm text-[11px]">
                      TOLL
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono-data text-outline-variant">-</td>
                  <td className="p-4 text-right font-mono-data text-primary">$12.00</td>
                  <td className="p-4 text-center">
                    <button className="text-outline hover:text-primary transition-colors p-1" title="View Receipt">
                      <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                    </button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
