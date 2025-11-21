import {AppSidebar} from "~/components/app-sidebar";
import {SidebarProvider} from "~/components/ui/sidebar";

export default function dashboard() {
    return (
        <SidebarProvider>
            <AppSidebar />
        </SidebarProvider>
    );
}
