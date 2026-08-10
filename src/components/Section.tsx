import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  containerClassName,
  muted = false,
  inverse = false,
  noPadding = false,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  muted?: boolean;
  inverse?: boolean;
  noPadding?: boolean;
}) {
  return (
    <section
      className={cn(
        !muted && !inverse && "py-[var(--cb-space-section)]",
        !noPadding && "py-[var(--cb-space-section)]",
        "scroll-mt-[68px]",
        className,
      )}
      style={{
        background: muted ? "var(--cb-surface-muted)" : inverse ? "var(--cb-brand-primary)" : "var(--cb-surface-canvas)",
      }}
    >
      <div className={cn("max-w-[1200px] mx-auto px-6", containerClassName)}>{children}</div>
    </section>
  );
}
