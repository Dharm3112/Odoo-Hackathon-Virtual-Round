"use client";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-margin max-w-[1600px] w-full mx-auto">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-container_gap">
        {/* Active Vehicles Card */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-outline transition-colors">
          <div className="flex justify-between items-start">
            <span className="font-body-sm text-body-sm text-outline uppercase tracking-wider">
              Active Vehicles
            </span>
            <span className="material-symbols-outlined text-status-green icon-fill bg-status-green/10 p-1.5 rounded-md">
              local_shipping
            </span>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-primary flex items-baseline gap-2">
              142
              <span className="font-label-sm text-label-sm text-status-green flex items-center">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                12%
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-outline-variant mt-1">
              Out of 180 total fleet
            </p>
          </div>
          {/* Decorative subtle background line */}
          <div className="absolute -bottom-2 -right-2 text-surface-container-highest opacity-50 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[120px] icon-fill">local_shipping</span>
          </div>
        </div>

        {/* Trips Today Card */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-outline transition-colors">
          <div className="flex justify-between items-start">
            <span className="font-body-sm text-body-sm text-outline uppercase tracking-wider">
              Trips Today
            </span>
            <span className="material-symbols-outlined text-status-blue icon-fill bg-status-blue/10 p-1.5 rounded-md">
              route
            </span>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-primary flex items-baseline gap-2">
              87
              <span className="font-label-sm text-label-sm text-status-green flex items-center">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                4%
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-outline-variant mt-1">
              24 pending dispatch
            </p>
          </div>
          <div className="absolute -bottom-2 -right-2 text-surface-container-highest opacity-50 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[120px] icon-fill">route</span>
          </div>
        </div>

        {/* Critical Alerts Card */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-status-warning/50 transition-colors">
          <div className="flex justify-between items-start">
            <span className="font-body-sm text-body-sm text-outline uppercase tracking-wider">
              Critical Alerts
            </span>
            <span className="material-symbols-outlined text-status-warning icon-fill bg-status-warning/10 p-1.5 rounded-md">
              warning
            </span>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-status-warning flex items-baseline gap-2">
              3
            </div>
            <p className="font-body-sm text-body-sm text-outline-variant mt-1">
              Requires immediate action
            </p>
          </div>
          <div className="absolute -bottom-2 -right-2 text-status-warning/5 opacity-50 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[120px] icon-fill">warning</span>
          </div>
        </div>

        {/* Maint. Scheduled Card */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-outline transition-colors">
          <div className="flex justify-between items-start">
            <span className="font-body-sm text-body-sm text-outline uppercase tracking-wider">
              Maint. Scheduled
            </span>
            <span className="material-symbols-outlined text-outline-variant icon-fill bg-surface-variant p-1.5 rounded-md">
              build
            </span>
          </div>
          <div>
            <div className="font-headline-lg text-headline-lg text-primary flex items-baseline gap-2">
              12
            </div>
            <p className="font-body-sm text-body-sm text-outline-variant mt-1">
              For the next 7 days
            </p>
          </div>
          <div className="absolute -bottom-2 -right-2 text-surface-container-highest opacity-50 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-[120px] icon-fill">build</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-container_gap">
        
        {/* Left Column (2/3 width on LG) */}
        <div className="lg:col-span-2 flex flex-col gap-container_gap">
          {/* Active Trips Table */}
          <div className="bg-surface-container border border-outline-variant rounded-lg flex flex-col overflow-hidden">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h2 className="font-headline-sm text-headline-sm text-primary">Active Trips Timeline</h2>
              <button className="text-primary font-label-md text-label-md hover:underline">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-variant bg-surface-container text-outline font-label-sm text-label-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">Trip ID</th>
                    <th className="p-4 font-semibold">Vehicle / Driver</th>
                    <th className="p-4 font-semibold">Route</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">ETA</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm">
                  {/* Row 1 */}
                  <tr className="border-b border-surface-variant hover:bg-surface-container-highest transition-colors group cursor-pointer">
                    <td className="p-4 text-primary font-mono-data">TRP-8492</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-primary font-medium">Van-03</span>
                        <span className="text-outline-variant text-[12px]">Alex Johnson</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[100px]">Warehouse A</span>
                        <span className="material-symbols-outlined text-[14px] text-outline">arrow_forward</span>
                        <span className="truncate max-w-[100px]">Downtown Hub</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-status-blue/20 bg-status-blue/10 text-status-blue font-label-sm text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-blue animate-pulse-slow"></span>
                        IN TRANSIT
                      </span>
                    </td>
                    <td className="p-4 text-on-surface">14:30 (On Time)</td>
                  </tr>
                  
                  {/* Row 2 */}
                  <tr className="border-b border-surface-variant hover:bg-surface-container-highest transition-colors group cursor-pointer">
                    <td className="p-4 text-primary font-mono-data">TRP-8493</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-primary font-medium">TRK-12</span>
                        <span className="text-outline-variant text-[12px]">Sarah Connor</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[100px]">Port Terminal</span>
                        <span className="material-symbols-outlined text-[14px] text-outline">arrow_forward</span>
                        <span className="truncate max-w-[100px]">Logistics Center</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-status-warning/20 bg-status-warning/10 text-status-warning font-label-sm text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-warning animate-pulse-slow"></span>
                        DELAYED
                      </span>
                    </td>
                    <td className="p-4 text-status-warning">16:45 (+45m)</td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="border-b border-surface-variant hover:bg-surface-container-highest transition-colors group cursor-pointer">
                    <td className="p-4 text-primary font-mono-data">TRP-8494</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-primary font-medium">Van-08</span>
                        <span className="text-outline-variant text-[12px]">Michael Chang</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[100px]">North Station</span>
                        <span className="material-symbols-outlined text-[14px] text-outline">arrow_forward</span>
                        <span className="truncate max-w-[100px]">East Facility</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-outline-variant/30 bg-surface-variant text-outline font-label-sm text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                        DISPATCHED
                      </span>
                    </td>
                    <td className="p-4 text-on-surface">15:00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width on LG) */}
        <div className="flex flex-col gap-container_gap">
          
          {/* Fleet Status Summary */}
          <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-6">Fleet Status</h2>
            
            <div className="flex flex-col gap-4">
              {/* Status Item */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-status-available"></span>
                    Available
                  </span>
                  <span className="text-primary font-mono-data">142</span>
                </div>
                <progress value="78" max="100" className="w-full h-1.5 progress-bar-available"></progress>
              </div>

              {/* Status Item */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-status-trip"></span>
                    On Trip
                  </span>
                  <span className="text-primary font-mono-data">24</span>
                </div>
                <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-status-trip w-[13%]"></div>
                </div>
              </div>

              {/* Status Item */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-status-warning"></span>
                    In Maintenance
                  </span>
                  <span className="text-primary font-mono-data">9</span>
                </div>
                <progress value="5" max="100" className="w-full h-1.5 progress-bar-warning"></progress>
              </div>

              {/* Status Item */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-status-suspended"></span>
                    Out of Service
                  </span>
                  <span className="text-primary font-mono-data">5</span>
                </div>
                <progress value="3" max="100" className="w-full h-1.5 progress-bar-suspended"></progress>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col flex-1">
            <h2 className="font-headline-sm text-headline-sm text-primary mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded bg-surface-container-highest border border-outline-variant/50 hover:bg-surface-container-low hover:border-primary transition-colors text-on-surface hover:text-primary group">
                <span className="material-symbols-outlined icon-fill text-[24px] group-hover:scale-110 transition-transform">add_circle</span>
                <span className="font-label-md text-label-md">New Trip</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded bg-surface-container-highest border border-outline-variant/50 hover:bg-surface-container-low hover:border-primary transition-colors text-on-surface hover:text-primary group">
                <span className="material-symbols-outlined icon-fill text-[24px] group-hover:scale-110 transition-transform">report</span>
                <span className="font-label-md text-label-md">Log Issue</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
