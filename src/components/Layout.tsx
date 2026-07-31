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
    <div className="w-full py-[var(--cb-space-xl)] flex items-center justify-center cb-section-inverse">
      <div className="text-center px-[var(--cb-space-lg)]">
        {label && <div className="cb-eyebrow mb-[var(--cb-space-md)]">{label}</div>}
        <h1
          className="font-[var(--cb-font-weight-heading)] leading-tight text-[length:var(--cb-font-size-screen)] text-[var(--cb-text-inverse)]"
          style={{ textWrap: "balance" }}
        >
          {title}
        </h1>
        {subtitle && <p className="cb-caption mt-[var(--cb-space-md)]">{subtitle}</p>}
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
      className="flex items-center justify-center font-[var(--cb-font-weight-heading)] shrink-0 cb-logo-fallback"
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
