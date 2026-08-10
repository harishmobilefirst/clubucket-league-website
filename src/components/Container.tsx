import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-[1200px] mx-auto px-6", className)}>
      {children}
    </div>
  );
}
