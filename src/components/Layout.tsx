import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileAppPrompt } from "./MobileAppPrompt";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col cb-page">
      <Navbar />
      <div className="pt-[68px]">
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
      <MobileAppPrompt />
    </div>
  );
}

export function PageHeader({
  label,
  title,
  subtitle,
}: {
  label?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="w-full py-8 flex items-center justify-center cb-section-inverse">
      <div className="text-center px-6">
        {label && (
          <div className="text-[11px] uppercase tracking-[2.5px] mb-3" style={{ color: "var(--cb-brand-accent)" }}>
            {label}
          </div>
        )}
        <h1
          className="font-extrabold text-[28px] leading-tight"
          style={{ color: "var(--cb-text-inverse)", textWrap: "balance" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[16px] mt-3" style={{ color: "var(--cb-text-muted-inverse)" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export function TeamLogo({
  initials,
  size = 40,
  dark = false,
}: {
  initials: string;
  size?: number;
  dark?: boolean;
}) {
  return (
    <div
      className="rounded-[8px] flex items-center justify-center font-bold shrink-0 cb-logo-fallback"
      style={{
        width: size,
        height: size,
        background: dark ? "var(--cb-surface-inverse)" : "var(--cb-surface-muted)",
        color: dark ? "var(--cb-text-inverse)" : "var(--cb-text-secondary)",
        fontSize: Math.max(10, size * 0.28),
      }}
    >
      {initials}
    </div>
  );
}
