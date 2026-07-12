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
      <main className="flex-1 md:ml-sidebar-width-expanded pt-header-height p-margin min-h-screen min-w-0 transition-all duration-200">
        {children}
      </main>
    </div>
  );
}