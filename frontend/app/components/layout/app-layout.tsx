import { useEffect } from "react";
import AppSidebarResponsive from "./app-sidebar-responsive";
import { BackgroundDecoration } from "../shared/background-decoration";

type AppLayoutProps = {
  pageTitle?: string;
  children: React.ReactNode;
};

export function AppLayout({ pageTitle, children }: AppLayoutProps) {
  useEffect(() => {
    if (!pageTitle) return;
    document.title = `${pageTitle} • EDUQCM`;
  }, [pageTitle]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--background)] text-[var(--text)]">
      <BackgroundDecoration />

      <div className="">
        <AppSidebarResponsive />
      </div>
      <div className="relative mx-auto max-w-6xl px-6 py-10 w-full">
        {children}
      </div>
    </div>
  );
}
