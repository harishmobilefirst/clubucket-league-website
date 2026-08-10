export function LoadingState({
  message = "Loading…",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-[var(--cb-space-section)] text-center ${className || ""}`}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin mb-[var(--cb-space-md)]" style={{ borderColor: "var(--cb-border-subtle)", borderTopColor: "var(--cb-brand-accent)" }} />
      <p className="text-[length:var(--cb-font-size-body)]" style={{ color: "var(--cb-text-secondary)" }}>{message}</p>
    </div>
  );
}
