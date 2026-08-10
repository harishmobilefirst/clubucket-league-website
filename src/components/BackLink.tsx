import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function BackLink({
  to,
  children,
  className,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 font-[var(--cb-font-weight-heading)] hover:underline transition-colors ${className || ""}`}
      style={{ color: "var(--cb-brand-accent)" }}
    >
      <ChevronLeft className="w-4 h-4" />
      {children}
    </Link>
  );
}
