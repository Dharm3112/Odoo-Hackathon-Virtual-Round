"use client";

import { usePathname } from "next/navigation";

export function TopBar() {
  const pathname = usePathname();
  
  // Format pathname for breadcrumb: /fuel -> Fuel
  const pageName = pathname.replace(/^\//, "").split("/")[0] || "Dashboard";
  const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-margin h-header_height bg-surface-container-high border-b border-surface-variant md:pl-[calc(var(--spacing-sidebar_width)+var(--spacing-margin))] transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 md:hidden">
          <span className="material-symbols-outlined text-primary text-2xl icon-fill">alt_route</span>
          <span className="font-headline-sm text-headline-sm font-semibold tracking-tight text-primary">
            TransitOps
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-outline font-body-md text-body-md">
          <span className="text-primary font-medium">{formattedPageName}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden sm:block w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-surface-container-low border border-outline-variant rounded text-on-surface text-body-sm pl-9 pr-3 py-1.5 focus:outline-none focus:border-primary transition-colors placeholder:text-outline-variant"
          />
        </div>
        
        <div className="flex items-center gap-3 md:border-l md:border-outline-variant md:pl-4 md:ml-2">
          <button className="text-outline hover:text-primary transition-colors scale-95 hover:scale-100 duration-150 p-1">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-outline hover:text-primary transition-colors scale-95 hover:scale-100 duration-150 p-1 hidden md:block">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          
          {/* User Profile */}
          <div className="flex items-center gap-2 ml-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant group-hover:border-outline transition-colors overflow-hidden">
              <span className="material-symbols-outlined text-outline text-[20px] icon-fill">
                person
              </span>
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface">Operations Mgr.</span>
            </div>
            <span className="material-symbols-outlined text-outline-variant text-[16px] hidden md:block">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
