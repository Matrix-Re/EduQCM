export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      {/* Background décor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[var(--primary)]/20 blur-3xl" />
        <div className="absolute top-32 -right-24 h-72 w-72 rounded-full bg-[var(--secondary)]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--success)]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <h1>Dashboard</h1>
      </div>
    </div>
  );
}
