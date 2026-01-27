import React from "react";

type LoadingPageProps = {
  title?: string;
  subtitle?: string;
};

export default function LoadingPage({
  title = "Loading…",
  subtitle = "Please wait a moment.",
}: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--background)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[var(--primary)] p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Spinner />
          <div className="min-w-0">
            <div className="text-base font-semibold">{title}</div>
            <div className="mt-1 text-sm opacity-70">{subtitle}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div
      className="
        relative h-10 w-10 shrink-0 rounded-2xl
        border border-white/10 bg-white/5
        flex items-center justify-center
      "
      aria-label="Loading"
      role="status"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--background)]/20 border-t-[var(--background)]/70" />
    </div>
  );
}
