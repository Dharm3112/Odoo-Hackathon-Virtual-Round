"use client";

import { useState } from "react";

export default function TripsPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex flex-col gap-margin max-w-[1600px] w-full mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md text-primary">Trip Dispatcher</h1>
        <button className="text-outline hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">history</span>
          <span className="font-label-md text-label-md">View History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-margin">
        {/* Left Column: Form / Stepper */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Stepper Header */}
          <div className="flex items-center justify-between border-b border-surface-variant pb-4">
            <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-outline-variant'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md ${step >= 1 ? 'bg-primary text-background' : 'bg-surface-variant text-outline'}`}>1</div>
              <span className="font-label-sm uppercase tracking-wider hidden sm:block">Details</span>
            </div>
            <div className={`h-[1px] flex-1 mx-4 ${step >= 2 ? 'bg-primary' : 'bg-surface-variant'}`}></div>
            
            <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-outline-variant'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md ${step >= 2 ? 'bg-primary text-background' : 'bg-surface-variant text-outline'}`}>2</div>
              <span className="font-label-sm uppercase tracking-wider hidden sm:block">Assign</span>
            </div>
            <div className={`h-[1px] flex-1 mx-4 ${step >= 3 ? 'bg-primary' : 'bg-surface-variant'}`}></div>
            
            <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-outline-variant'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md ${step >= 3 ? 'bg-primary text-background' : 'bg-surface-variant text-outline'}`}>3</div>
              <span className="font-label-sm uppercase tracking-wider hidden sm:block">Review</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-surface-container border border-outline-variant rounded-lg p-6">
            {step === 1 && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                <h2 className="font-headline-sm text-headline-sm text-primary">Trip Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface">Origin</label>
                    <input type="text" placeholder="e.g. Warehouse A" className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2 text-on-surface text-body-sm focus:outline-none focus:border-primary placeholder:text-outline-variant" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface">Destination</label>
                    <input type="text" placeholder="e.g. Port Terminal 3" className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2 text-on-surface text-body-sm focus:outline-none focus:border-primary placeholder:text-outline-variant" />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button onClick={() => setStep(2)} className="bg-primary text-background font-label-md text-label-md px-6 py-2 rounded hover:bg-surface-tint transition-colors">
                    Next Step
                  </button>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                <h2 className="font-headline-sm text-headline-sm text-primary">Assign Vehicle & Driver</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface">Select Vehicle</label>
                    <select className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2 text-on-surface text-body-sm focus:outline-none focus:border-primary appearance-none">
                      <option value="">Choose a vehicle...</option>
                      <option value="v1">TRK-12 (Available)</option>
                      <option value="v2">VAN-03 (Available)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface">Select Driver</label>
                    <select className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2 text-on-surface text-body-sm focus:outline-none focus:border-primary appearance-none">
                      <option value="">Choose a driver...</option>
                      <option value="d1">Sarah Connor (Available)</option>
                      <option value="d2">Alex Johnson (Available)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <button onClick={() => setStep(1)} className="border border-outline-variant text-on-surface font-label-md text-label-md px-6 py-2 rounded hover:bg-surface-container-highest transition-colors">
                    Back
                  </button>
                  <button onClick={() => setStep(3)} className="bg-primary text-background font-label-md text-label-md px-6 py-2 rounded hover:bg-surface-tint transition-colors">
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                <h2 className="font-headline-sm text-headline-sm text-primary">Review & Confirm</h2>
                <div className="bg-surface-container-low border border-outline-variant rounded p-4 flex flex-col gap-3">
                  <div className="flex justify-between border-b border-surface-variant pb-2">
                    <span className="text-outline font-label-md text-label-md">Route</span>
                    <span className="text-primary font-body-sm">Warehouse A → Port Terminal 3</span>
                  </div>
                  <div className="flex justify-between border-b border-surface-variant pb-2">
                    <span className="text-outline font-label-md text-label-md">Assigned Vehicle</span>
                    <span className="text-primary font-body-sm">TRK-12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline font-label-md text-label-md">Assigned Driver</span>
                    <span className="text-primary font-body-sm">Sarah Connor</span>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <button onClick={() => setStep(2)} className="border border-outline-variant text-on-surface font-label-md text-label-md px-6 py-2 rounded hover:bg-surface-container-highest transition-colors">
                    Back
                  </button>
                  <button onClick={() => setStep(1)} className="bg-status-green text-background font-label-md text-label-md px-6 py-2 rounded hover:bg-status-green/90 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    Dispatch Trip
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Map / Route Preview */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container border border-outline-variant rounded-lg h-full min-h-[400px] flex flex-col overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 bg-surface-container/80 backdrop-blur border border-outline-variant rounded px-3 py-1.5">
              <span className="font-label-sm text-label-sm text-primary flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-status-green animate-pulse"></span>
                Route Preview
              </span>
            </div>
            {/* Simulated Map Background */}
            <div className="flex-1 bg-[#1a1c1e] w-full h-full opacity-50 relative flex items-center justify-center border-b border-outline-variant">
              <span className="material-symbols-outlined text-outline-variant text-[48px]">map</span>
            </div>
            
            <div className="p-4 flex flex-col gap-2 bg-surface-container-low">
              <div className="flex justify-between items-center">
                <span className="font-label-sm text-label-sm text-outline uppercase">Est. Distance</span>
                <span className="font-body-md text-body-md text-primary font-mono-data">45.2 km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label-sm text-label-sm text-outline uppercase">Est. Duration</span>
                <span className="font-body-md text-body-md text-primary font-mono-data">1h 15m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
