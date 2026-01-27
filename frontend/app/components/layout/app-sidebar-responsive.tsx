import * as React from "react";
import { AppSidebar } from "./app-sidebar";

export default function AppSidebarResponsive() {
  const [open, setOpen] = React.useState(false);

  // Ferme au Escape
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {/* Mobile top bar (hamburger) */}
      <div className="lg:hidden sticky top-0 z-40 backdrop-blur border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10 transition"
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="text-sm font-semibold opacity-80">EDUQCM</div>

          {/* spacer */}
          <div className="w-[44px]" />
        </div>
        <div className="h-[1px] w-full bg-[var(--text)]/30 mb-4" />
      </div>

      {/* Desktop sidebar */}
      <div className="h-full hidden lg:block">
        <AppSidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="absolute left-0 top-0 h-full w-[85vw] max-w-[340px]">
            <div className="h-full relative">
              {/* Close button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 z-10 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15 transition"
                aria-label="Close menu"
              >
                ✕
              </button>

              {/* Sidebar content */}
              <div className="h-full">
                <AppSidebar />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
