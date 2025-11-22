import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { Outlet } from "react-router-dom";

export function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex w-full h-screen">

                {/* Sidebar on left */}
                <AppSidebar />

                {/* Content on right */}
                <div className="flex-1 p-6 overflow-auto bg-[var(--background)]">
                    {children}
                </div>

            </div>
        </SidebarProvider>
    );
}
