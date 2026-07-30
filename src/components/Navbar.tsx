import { Link, useLocation } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/ligad1-logo.png";
import { usePublicConfig } from "@/hooks/use-public-api";
import { useLocale } from "@/lib/locale";
import { isModuleEnabled } from "@/lib/public-api";
import { useIsMobile } from "@/hooks/use-mobile";
import { Container } from "./Container";

type NavLink = { to: string; label: string; moduleKey?: string };

const fallbackNavLinks: NavLink[] = [
  { to: "/", label: "Home" },
  { to: "/divisions", label: "Divisions", moduleKey: "divisions" },
  { to: "/schedule", label: "Schedule", moduleKey: "schedule" },
  { to: "/standings", label: "Standings", moduleKey: "standings" },
  { to: "/news", label: "News", moduleKey: "news" },
  { to: "/highlights", label: "Highlights", moduleKey: "highlights" },
  { to: "/top-scorers", label: "Top Scorers", moduleKey: "topScorers" },
  { to: "/about", label: "About Us", moduleKey: "aboutUs" },
];

const fallbackLocales = [
  { label: "English", locale: "en" },
  { label: "Spanish", locale: "es" },
];

export function Navbar() {
  const { pathname } = useLocation();
  const { data: config } = usePublicConfig();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const closeAll = useCallback(() => {
    setOpen(false);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClick);
    };
  }, [closeAll]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      const prev = document.activeElement as HTMLElement | null;
      const timeout = setTimeout(() => {
        const first = mobileRef.current?.querySelector<HTMLElement>("a, button");
        first?.focus();
      }, 50);
      return () => {
        clearTimeout(timeout);
        document.body.style.overflow = "";
        prev?.focus();
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  const navLinks = fallbackNavLinks.filter(
    (l) => !l.moduleKey || isModuleEnabled(config, l.moduleKey),
  );

  const logoUrl = config?.logoUrl || logo;
  const leagueName = config?.displayName || "LigaD1";
  const locales = config?.supportedLocales.length ? config.supportedLocales : fallbackLocales;

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] h-[68px] text-[var(--cb-text-inverse)] cb-section-inverse">
      <Container className="h-full flex items-center gap-[var(--cb-space-lg)]">
        <Link to="/" className="flex items-center gap-[var(--cb-space-sm)] leading-none shrink-0 cb-focus">
          <img src={logoUrl} alt={leagueName} className="h-12 w-auto" />
        </Link>

        <div className="flex-1" />

        <nav className="hidden md:flex items-center gap-[var(--cb-space-xl)]">
          {navLinks.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                aria-current={active ? "page" : undefined}
                className="relative font-[var(--cb-font-weight-heading)] uppercase tracking-normal transition-colors text-[length:var(--cb-font-size-body)] hover:text-[var(--cb-brand-accent)] cb-focus"
                style={{ color: active ? "var(--cb-brand-accent)" : "var(--cb-text-inverse)" }}
              >
                {l.label}
                {active && (
                  <span
                    className="absolute -bottom-2 left-0 right-0 h-[2px]"
                    style={{ background: "var(--cb-brand-accent)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-[var(--cb-space-md)] shrink-0">
          <div className="text-[length:var(--cb-font-size-caption)] flex items-center gap-[var(--cb-space-xs)]">
            {locales.map((item, idx) => (
              <span key={item.locale} className="flex items-center gap-[var(--cb-space-xs)]">
                {idx > 0 && <span className="text-[var(--cb-text-muted-inverse)]">|</span>}
                <button
                  onClick={() => setLocale(item.locale)}
                  className={
                    locale === item.locale
                      ? "text-[var(--cb-text-inverse)] underline decoration-[var(--cb-brand-accent)] decoration-2 underline-offset-4 cb-focus"
                      : "text-[var(--cb-text-muted-inverse)] cb-focus"
                  }
                >
                  {item.locale.toUpperCase()}
                </button>
              </span>
            ))}
          </div>
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-haspopup="true"
              className="cb-button-primary cb-focus"
            >
              Register
            </button>
            {open && (
              <div className="absolute right-0 mt-[var(--cb-space-xs)] w-[240px] cb-panel cb-shadow-panel overflow-hidden">
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block cb-body px-[var(--cb-space-lg)] py-[var(--cb-space-md)] hover:bg-[var(--cb-surface-muted)]"
                >
                  New Team Membership
                </Link>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden w-11 h-11 flex items-center justify-center cb-focus"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {mobileOpen && (
        <div
          ref={mobileRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="md:hidden fixed inset-0 top-[68px] z-[999] bg-[var(--cb-brand-primary)]"
        >
          <nav className="flex flex-col p-[var(--cb-space-xl)] gap-[var(--cb-space-sm)]">
            {navLinks.map((l) => {
              const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className="block py-[var(--cb-space-md)] px-[var(--cb-space-md)] font-[var(--cb-font-weight-heading)] uppercase tracking-normal text-[length:var(--cb-font-size-body)] rounded-[var(--cb-radius-md)] transition-colors cb-focus"
                  style={{
                    color: active ? "var(--cb-brand-accent)" : "var(--cb-text-inverse)",
                    background: active ? "rgba(255,255,255,0.1)" : undefined,
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
            <div className="border-t border-white/20 mt-[var(--cb-space-md)] pt-[var(--cb-space-md)] flex items-center gap-[var(--cb-space-md)]">
              {locales.map((item) => (
                <button
                  key={item.locale}
                  onClick={() => { setLocale(item.locale); setMobileOpen(false); }}
                  className={
                    "py-[var(--cb-space-sm)] px-[var(--cb-space-md)] rounded-[var(--cb-radius-md)] text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] uppercase cb-focus " +
                    (locale === item.locale
                      ? "text-[var(--cb-brand-accent)]"
                      : "text-[var(--cb-text-inverse)]")
                  }
                >
                  {item.locale.toUpperCase()}
                </button>
              ))}
            </div>
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="cb-button-primary text-center mt-[var(--cb-space-md)] cb-focus"
            >
              Register
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
