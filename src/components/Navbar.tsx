import { Link, useLocation } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/ligad1-logo.png";
import { usePublicConfig } from "@/hooks/use-public-api";
import { useLocale } from "@/lib/locale";
import { useI18n } from "@/lib/i18n";
import { isModuleEnabled } from "@/lib/public-api";
import { Container } from "./Container";

type NavLink = { to: string; labelKey: string; moduleKey?: string };

const fallbackNavLinks: NavLink[] = [
  { to: "/", labelKey: "nav.home" },
  { to: "/divisions", labelKey: "nav.divisions", moduleKey: "divisions" },
  { to: "/schedule", labelKey: "nav.schedule", moduleKey: "schedule" },
  { to: "/standings", labelKey: "nav.standings", moduleKey: "standings" },
  { to: "/news", labelKey: "nav.news", moduleKey: "news" },
  { to: "/highlights", labelKey: "nav.highlights", moduleKey: "highlights" },
  { to: "/top-scorers", labelKey: "nav.topScorers", moduleKey: "topScorers" },
  { to: "/about", labelKey: "nav.about", moduleKey: "aboutUs" },
];

const fallbackLocales = [
  { label: "English", locale: "en" },
  { label: "Spanish", locale: "es" },
];

export function Navbar() {
  const { pathname } = useLocation();
  const { data: config } = usePublicConfig();
  const { locale, setLocale } = useLocale();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

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
    <header
      className="fixed top-0 left-0 right-0 z-[1000] h-[68px] cb-section-inverse"
      style={{ color: "var(--cb-text-inverse)" }}
    >
      <Container className="h-full flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center gap-[var(--cb-space-sm)] leading-none shrink-0 cb-focus"
        >
          <img src={logoUrl} alt={leagueName} className="h-12 w-auto" />
        </Link>

        <div className="flex-1" />

        <nav className="hidden xl:flex items-center gap-7 shrink-0">
          {navLinks.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                aria-current={active ? "page" : undefined}
                className="relative whitespace-nowrap text-[14px] font-semibold uppercase tracking-[1.2px] transition-colors cb-focus"
                style={{
                  color: active ? "var(--cb-brand-accent)" : "var(--cb-text-inverse)",
                }}
              >
                {t(l.labelKey)}
                {active ? (
                  <span
                    className="absolute -bottom-2 left-0 right-0 h-[2px]"
                    style={{ background: "var(--cb-brand-accent)" }}
                  />
                ) : (
                  <span
                    className="absolute -bottom-2 left-0 right-0 h-[2px] scale-x-0 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transform-none"
                    style={{ background: "var(--cb-brand-accent)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden xl:flex items-center gap-4 shrink-0">
          <div className="text-[12px] flex items-center gap-1">
            {locales.map((item, idx) => {
              const active = locale === item.locale;
              return (
                <span key={item.locale} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setLocale(item.locale)}
                    className={
                      active
                        ? "underline decoration-2 underline-offset-4"
                        : "opacity-70 hover:opacity-100 transition-opacity cb-focus"
                    }
                    style={{
                      color: "var(--cb-text-inverse)",
                      textDecorationColor: "var(--cb-brand-accent)",
                    }}
                  >
                    {item.locale.toUpperCase()}
                  </button>
                  {idx < locales.length - 1 ? (
                    <span style={{ color: "color-mix(in srgb, var(--cb-text-inverse), transparent 60%)" }}>
                      |
                    </span>
                  ) : null}
                </span>
              );
            })}
          </div>
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-haspopup="true"
              className="text-[13px] font-bold uppercase rounded-full px-5 py-2 transition-colors cb-focus"
              style={{
                background: "var(--cb-brand-accent)",
                color: "var(--cb-text-inverse)",
              }}
            >
              {t("nav.register")}
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-[240px] cb-panel cb-shadow-panel overflow-hidden">
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block text-[14px] px-5 py-3"
                  style={{
                    color: "var(--cb-text-primary)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cb-surface-muted)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  {t("nav.newTeamMembership")}
                </Link>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="xl:hidden w-11 h-11 flex items-center justify-center cb-focus"
          aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {mobileOpen && (
        <div
          ref={mobileRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.navigationMenu")}
          className="xl:hidden fixed inset-0 top-[68px] z-[999]"
          style={{ background: "var(--cb-brand-primary)" }}
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
                    color: "var(--cb-text-inverse)",
                    background: active ? "rgba(255,255,255,0.1)" : undefined,
                  }}
                >
                  {t(l.labelKey)}
                </Link>
              );
            })}
            <div
              className="border-t mt-[var(--cb-space-md)] pt-[var(--cb-space-md)] flex items-center gap-[var(--cb-space-md)]"
              style={{ borderColor: "color-mix(in srgb, var(--cb-text-inverse), transparent 80%)" }}
            >
              {locales.map((item) => {
                const active = locale === item.locale;
                return (
                  <button
                    key={item.locale}
                    onClick={() => {
                      setLocale(item.locale);
                      setMobileOpen(false);
                    }}
                    aria-pressed={active}
                    className={
                      "py-[var(--cb-space-sm)] px-[var(--cb-space-md)] rounded-[var(--cb-radius-md)] text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] uppercase tracking-normal cb-focus " +
                      (active ? "" : "opacity-80")
                    }
                    style={{
                      background: active ? "var(--cb-brand-accent)" : "transparent",
                      color: "var(--cb-text-inverse)",
                    }}
                  >
                    {t(`language.${item.locale}`)}
                  </button>
                );
              })}
            </div>
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="cb-button-primary text-center mt-[var(--cb-space-md)] cb-focus"
            >
              {t("nav.register")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
