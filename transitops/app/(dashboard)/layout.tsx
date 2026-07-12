import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      <main className="flex-1 md:ml-sidebar-width-expanded pt-header-height p-margin min-h-screen w-full transition-all duration-200">
        {children}
      </main>
    </div>
  );
}