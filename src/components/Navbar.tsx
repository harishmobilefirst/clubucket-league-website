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
    <header className="fixed top-0 left-0 right-0 z-[1000] h-[68px] text-[var(--cb-text-inverse)] cb-section-inverse">
      <Container className="h-full flex items-center gap-[var(--cb-space-lg)]">
        <Link
          to="/"
          className="flex items-center gap-[var(--cb-space-sm)] leading-none shrink-0 cb-focus"
        >
          <img src={logoUrl} alt={leagueName} className="h-12 w-auto" />
        </Link>

        <div className="flex-1" />

        <nav className="hidden xl:flex items-center gap-[20px] shrink-0">
          {navLinks.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                aria-current={active ? "page" : undefined}
                className="group relative whitespace-nowrap font-[var(--cb-font-weight-heading)] uppercase tracking-normal text-[length:var(--cb-font-size-body)] text-[var(--cb-text-inverse)] cb-focus"
              >
                {t(l.labelKey)}
                {active ? (
                  <span
                    className="absolute -bottom-2 left-0 right-0 h-[2px]"
                    style={{ background: "var(--cb-brand-accent)" }}
                  />
                ) : (
                  <span className="absolute -bottom-2 left-0 right-0 h-[2px] scale-x-0 bg-[var(--cb-text-inverse)] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transform-none" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden xl:flex items-center gap-[var(--cb-space-md)] shrink-0">
          <div
            role="group"
            aria-label={t("nav.language")}
            className="inline-flex items-center rounded-full border border-[var(--cb-text-inverse)]/25 p-[3px]"
          >
            {locales.map((item) => {
              const active = locale === item.locale;
              return (
                <button
                  key={item.locale}
                  type="button"
                  onClick={() => setLocale(item.locale)}
                  aria-pressed={active}
                  className={
                    "cb-focus rounded-full px-[var(--cb-space-sm)] py-[var(--cb-space-2xs)] text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] uppercase tracking-normal transition-colors " +
                    (active
                      ? "bg-[var(--cb-brand-accent)] text-[var(--cb-text-inverse)]"
                      : "text-[var(--cb-text-inverse)] hover:bg-white/10")
                  }
                >
                  {item.locale.toUpperCase()}
                </button>
              );
            })}
          </div>
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-haspopup="true"
              className="cb-button-primary cb-focus"
              style={{ padding: "var(--cb-space-sm) var(--cb-space-lg)" }}
            >
              {t("nav.register")}
            </button>
            {open && (
              <div className="absolute right-0 mt-[var(--cb-space-xs)] w-[240px] cb-panel cb-shadow-panel overflow-hidden">
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block cb-body px-[var(--cb-space-lg)] py-[var(--cb-space-md)] hover:bg-[var(--cb-surface-muted)]"
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
          className="xl:hidden fixed inset-0 top-[68px] z-[999] bg-[var(--cb-brand-primary)]"
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
            <div className="border-t border-white/20 mt-[var(--cb-space-md)] pt-[var(--cb-space-md)] flex items-center gap-[var(--cb-space-md)]">
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
                      (active
                        ? "bg-[var(--cb-brand-accent)] text-[var(--cb-text-inverse)]"
                        : "text-[var(--cb-text-inverse)]")
                    }
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
