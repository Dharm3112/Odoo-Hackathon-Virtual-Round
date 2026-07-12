"use client";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-margin max-w-[1600px] w-full mx-auto">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-headline-md text-headline-md text-primary">Reports & Analytics</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 bg-surface-container-high border border-outline-variant text-on-surface px-4 py-2 rounded font-label-md text-label-md hover:bg-surface-container-highest transition-colors whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]">download</span>
            CSV Export
          </button>
        </div>
      </div>

      {/* Hero Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-container_gap">
        <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col justify-between h-[180px] relative overflow-hidden group">
          <div>
            <h3 className="font-body-md text-body-md text-on-surface-variant mb-1">Fuel Efficiency</h3>
            <div className="font-headline-lg text-headline-lg text-primary tracking-tight font-light text-5xl">
              9.1 <span className="text-2xl text-outline ml-1">km/L</span>
            </div>
          </div>
          {/* Sparkline graphic simulation */}
          <div className="absolute bottom-0 left-0 w-full h-12 opacity-50 flex items-end">
            <svg className="w-full h-full preserve-aspect-ratio-none stroke-green-500 fill-none" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d="M0 25 L10 23 L20 25 L30 22 L40 26 L50 20 L60 22 L70 18 L80 20 L90 15 L100 12" strokeLinecap="round" strokeWidth="2"></path>
            </svg>
          </div>
        </div>

        <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col justify-between h-[180px]">
          <div>
            <h3 className="font-body-md text-body-md text-on-surface-variant mb-1">Fleet Utilization</h3>
            <div className="font-headline-lg text-headline-lg text-primary tracking-tight font-light text-5xl">
              82%
            </div>
          </div>
          <div className="mt-auto mb-2">
            <div className="flex justify-between font-label-sm text-label-sm text-outline mb-2">
              <span>Utilization</span>
            </div>
            <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
              <div className="bg-status-green w-[82%] h-full rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col justify-between h-[180px] relative overflow-hidden">
          <div>
            <h3 className="font-body-md text-body-md text-on-surface-variant mb-1">Operational Cost</h3>
            <div className="font-headline-lg text-headline-lg text-primary tracking-tight font-light text-5xl">
              $342,500
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-16 flex items-end opacity-80 gap-[1px]">
            <div className="h-[60%] w-full bg-status-green rounded-tl-sm opacity-80"></div>
            <div className="h-[75%] w-full bg-status-green opacity-80"></div>
            <div className="h-[70%] w-full bg-status-green opacity-80"></div>
            <div className="h-[85%] w-full bg-status-green opacity-80"></div>
            <div className="h-[90%] w-full bg-status-green opacity-80"></div>
            <div className="h-[100%] w-[40px] bg-status-suspended shrink-0 opacity-80"></div>
            <div className="h-[95%] w-[30px] bg-status-blue shrink-0 mr-4 opacity-80"></div>
          </div>
        </div>
      </div>

      {/* ROI Formula Section */}
      <div className="bg-surface-container border border-outline-variant rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col w-full md:w-1/3">
          <h3 className="font-body-md text-body-md text-on-surface-variant mb-2">Vehicle ROI</h3>
          <div className="font-headline-lg text-headline-lg text-primary text-6xl font-light tracking-tight">
            18.5%
          </div>
        </div>
        <div className="w-full md:w-2/3 flex items-center justify-center md:justify-end overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <div className="flex items-center text-on-surface font-body-lg text-body-lg whitespace-nowrap min-w-max">
            <span className="mr-4 text-outline font-mono-data text-mono-data">ROI =</span>
            <div className="flex flex-col items-center">
              <div className="pb-3 border-b border-outline-variant w-full text-center px-4">
                Total Revenue - <span className="text-on-surface-variant">(Maintenance + Fuel + Ops)</span>
              </div>
              <div className="pt-3 text-on-surface-variant">
                Total Vehicle Cost
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-container_gap min-h-[350px]">
        
        {/* Line Chart: Revenue vs Cost */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-body-md text-body-md text-on-surface">Monthly Revenue vs. Cost</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-status-green rounded-full"></div>
                <span className="font-label-sm text-label-sm text-outline">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-status-suspended rounded-full"></div>
                <span className="font-label-sm text-label-sm text-outline">Cost</span>
              </div>
            </div>
          </div>
          <div className="flex-1 relative w-full flex">
            {/* Y-Axis */}
            <div className="flex flex-col justify-between text-right pr-4 pb-8 font-label-sm text-label-sm text-outline-variant w-[60px] shrink-0 border-r border-outline-variant/30">
              <span>$20k</span>
              <span>$15k</span>
              <span>$10k</span>
              <span>$5k</span>
              <span>$0</span>
            </div>
            {/* Chart Area */}
            <div className="flex-1 relative pb-8 h-full">
              <div className="absolute inset-0 flex flex-col justify-between pb-8 z-0">
                <div className="w-full border-t border-outline-variant/10 h-0"></div>
                <div className="w-full border-t border-outline-variant/10 h-0"></div>
                <div className="w-full border-t border-outline-variant/10 h-0"></div>
                <div className="w-full border-t border-outline-variant/10 h-0"></div>
                <div className="w-full border-t border-outline-variant/30 h-0"></div>
              </div>
              <svg className="absolute inset-0 w-full h-[calc(100%-32px)] z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,60 C10,50 20,55 30,40 C40,45 50,35 60,45 C70,25 80,20 90,30 L100,15 L100,100 L0,100 Z" fill="rgba(74, 222, 128, 0.1)"></path>
                <path d="M0,60 C10,50 20,55 30,40 C40,45 50,35 60,45 C70,25 80,20 90,30 L100,15" fill="none" stroke="#4ade80" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                
                <path d="M0,80 C15,75 25,85 40,75 C50,80 60,65 75,70 C85,60 90,55 100,45 L100,100 L0,100 Z" fill="rgba(248, 113, 113, 0.1)"></path>
                <path d="M0,80 C15,75 25,85 40,75 C50,80 60,65 75,70 C85,60 90,55 100,45" fill="none" stroke="#f87171" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
              </svg>
              {/* X-Axis */}
              <div className="absolute bottom-0 w-full flex justify-between font-label-sm text-label-sm text-outline-variant pt-2 px-2">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart: Top Vehicles by ROI */}
        <div className="bg-surface-container border border-outline-variant rounded-lg p-6 flex flex-col">
          <h3 className="font-body-md text-body-md text-on-surface mb-6">Top Vehicles by ROI</h3>
          <div className="flex-1 relative flex flex-col justify-between">
            <div className="absolute inset-y-0 right-0 left-[60px] flex justify-between z-0 pb-[24px]">
              <div className="h-full border-l border-outline-variant/10"></div>
              <div className="h-full border-l border-outline-variant/10"></div>
              <div className="h-full border-l border-outline-variant/10"></div>
              <div className="h-full border-l border-outline-variant/10"></div>
              <div className="h-full border-l border-outline-variant/10 border-r"></div>
            </div>
            
            <div className="flex-1 flex flex-col justify-around z-10 pb-[24px]">
              <div className="flex items-center w-full">
                <div className="w-[60px] shrink-0 font-label-sm text-label-sm text-outline-variant pr-2 text-right">TRD101</div>
                <div className="flex-1 flex items-center">
                  <div className="bg-status-green h-6 rounded-r-sm w-[90%] flex items-center justify-end px-2"></div>
                  <span className="font-label-sm text-label-sm text-on-surface ml-2">18.5%</span>
                </div>
              </div>
              <div className="flex items-center w-full">
                <div className="w-[60px] shrink-0 font-label-sm text-label-sm text-outline-variant pr-2 text-right">VAN-03</div>
                <div className="flex-1 flex items-center">
                  <div className="bg-status-green h-6 rounded-r-sm w-[75%] flex items-center justify-end px-2 opacity-90"></div>
                  <span className="font-label-sm text-label-sm text-on-surface ml-2">15.2%</span>
                </div>
              </div>
              <div className="flex items-center w-full">
                <div className="w-[60px] shrink-0 font-label-sm text-label-sm text-outline-variant pr-2 text-right">VAN-05</div>
                <div className="flex-1 flex items-center">
                  <div className="bg-status-green h-6 rounded-r-sm w-[65%] flex items-center justify-end px-2 opacity-80"></div>
                  <span className="font-label-sm text-label-sm text-on-surface ml-2">12.3%</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 left-[60px] flex justify-between font-label-sm text-label-sm text-outline-variant border-t border-outline-variant/30 pt-2">
              <span>0%</span>
              <span>5%</span>
              <span>10%</span>
              <span>15%</span>
              <span>20%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
