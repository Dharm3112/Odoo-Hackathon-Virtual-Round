import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <TopBar />
      <Sidebar />
      <main className="flex-1 md:ml-sidebar-width lg:ml-sidebar-width-expanded mt-header-height min-h-screen min-w-0 p-4 pb-24 sm:p-margin md:pb-margin transition-all duration-200">
        {children}
      </main>
    </div>
  );
}
