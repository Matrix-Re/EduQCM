export function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm backdrop-blur">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-[var(--foreground)]">{title}</h3>
          <p className="mt-1 text-sm opacity-80 leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}
