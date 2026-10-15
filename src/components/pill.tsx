export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="surface text-muted inline-flex rounded-full px-3 py-1 text-sm">
      {children}
    </span>
  );
}
