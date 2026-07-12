"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"account" | "system" | "roles">("roles");

  return (
    <div className="flex flex-col gap-margin max-w-[1600px] w-full mx-auto">
      
      {/* Horizontal Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-surface-variant pb-2 overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setActiveTab("account")}
          className={`px-4 py-2 font-body-md text-body-md transition-colors whitespace-nowrap rounded-md ${activeTab === "account" ? "bg-surface-container-highest text-primary" : "text-outline hover:text-primary hover:bg-surface-container-low"}`}
        >
          Account
        </button>
        <button 
          onClick={() => setActiveTab("system")}
          className={`px-4 py-2 font-body-md text-body-md transition-colors whitespace-nowrap rounded-md ${activeTab === "system" ? "bg-surface-container-highest text-primary" : "text-outline hover:text-primary hover:bg-surface-container-low"}`}
        >
          System
        </button>
        <button 
          onClick={() => setActiveTab("roles")}
          className={`px-4 py-2 font-body-md text-body-md transition-colors whitespace-nowrap rounded-md ${activeTab === "roles" ? "bg-surface-container-highest text-primary" : "text-outline hover:text-primary hover:bg-surface-container-low"}`}
        >
          User Roles
        </button>
      </div>

      {activeTab === "roles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-container-gap mt-4">
          
          {/* Card 1 */}
          <div className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-surface-variant border border-outline-variant/50 flex items-center justify-center overflow-hidden">
                 <span className="material-symbols-outlined text-[24px] text-outline">person</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">Sarah Connor</h3>
                <p className="font-label-md text-label-md text-outline">Fleet Manager</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 pt-3 border-t border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-body-md text-body-md text-on-surface">Fleet Manager</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface peer-checked:after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between opacity-50 hover:opacity-100 transition-opacity">
                <span className="font-body-md text-body-md text-on-surface">Driver</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface peer-checked:after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between opacity-50 hover:opacity-100 transition-opacity">
                <span className="font-body-md text-body-md text-on-surface">Safety Officer</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface peer-checked:after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-body-md text-body-md text-on-surface">Financial Analyst</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface peer-checked:after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-surface-variant border border-outline-variant/50 flex items-center justify-center overflow-hidden">
                 <span className="material-symbols-outlined text-[24px] text-outline">person</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">James Reese</h3>
                <p className="font-label-md text-label-md text-outline">Driver</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 pt-3 border-t border-outline-variant/30">
              <div className="flex items-center justify-between opacity-50 hover:opacity-100 transition-opacity">
                <span className="font-body-md text-body-md text-on-surface">Fleet Manager</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface peer-checked:after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-body-md text-body-md text-on-surface">Driver</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface peer-checked:after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between opacity-50 hover:opacity-100 transition-opacity">
                <span className="font-body-md text-body-md text-on-surface">Safety Officer</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface peer-checked:after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === "account" && (
        <div className="bg-surface-container border border-outline-variant rounded-lg p-6 mt-4">
          <h2 className="font-headline-sm text-headline-sm text-primary mb-4">Account Settings</h2>
          <p className="text-on-surface-variant text-body-md">Account configuration options will appear here.</p>
        </div>
      )}

      {activeTab === "system" && (
        <div className="bg-surface-container border border-outline-variant rounded-lg p-6 mt-4">
          <h2 className="font-headline-sm text-headline-sm text-primary mb-4">System Settings</h2>
          <p className="text-on-surface-variant text-body-md">Global system configurations will appear here.</p>
        </div>
      )}
      
    </div>
  );
}
