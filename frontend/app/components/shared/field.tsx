export function Field({
  label,
  htmlFor,
  children,
  rightSlot,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-sm font-medium opacity-90">
          {label}
        </label>
        {rightSlot}
      </div>
      {children}
    </div>
  );
}
