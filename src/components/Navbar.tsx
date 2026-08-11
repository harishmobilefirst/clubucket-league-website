import { Link, useLocation } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import logo from "@/assets/ligad1-logo.png";
import { usePublicConfig } from "@/hooks/use-public-api";
import { useLocale } from "@/lib/locale";
import { useI18n } from "@/lib/i18n";
import { isModuleEnabled } from "@/lib/public-api";

type NavLink = { to: string; labelKey: string; moduleKey?: string };

const fallbackNavLinks: NavLink[] = [
  { to: "/", labelKey: "nav.home" },
  { to: "/divisions", labelKey: "nav.divisions", moduleKey: "divisions" },
  { to: "/schedule", labelKey: "nav.schedule", moduleKey: "schedule" },
  { to: "/standings", labelKey: "nav.standings", moduleKey: "standings" },
  { to: "/news", labelKey: "nav.news", moduleKey: "news" },
  { to: "/highlights", labelKey: "nav.highlights", moduleKey: "highlights" },
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const navLinks = fallbackNavLinks.filter(
    (l) => !l.moduleKey || isModuleEnabled(config, l.moduleKey),
  );

  const logoUrl = config?.logoUrl || logo;
  const leagueName = config?.displayName || "LigaD1";
  const locales = config?.supportedLocales.length ? config.supportedLocales : fallbackLocales;

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] h-[68px]" style={{ background: "var(--cb-brand-primary)", color: "var(--cb-text-inverse)" }}>
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3 leading-none shrink-0">
          <img src={logoUrl} alt={leagueName} className="h-12 w-auto" />
        </Link>

        <div className="flex-1" />

        <nav className="flex items-center gap-7">
          {navLinks.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className="relative text-[14px] font-semibold uppercase tracking-[1.2px] transition-colors"
                style={{ color: active ? "var(--cb-brand-accent)" : "var(--cb-text-inverse)" }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--cb-brand-accent)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "var(--cb-text-inverse)"; }}
              >
                {t(l.labelKey)}
                {active && <span className="absolute -bottom-2 left-0 right-0 h-[2px]" style={{ background: "var(--cb-brand-accent)" }} />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-[12px] flex items-center gap-1">
            {locales.map((item, idx) => {
              const active = locale === item.locale;
              return (
                <span key={item.locale} className="flex items-center gap-1">
                  <button
                    onClick={() => setLocale(item.locale)}
                    className={active ? "underline underline-offset-4" : "opacity-70"}
                    style={{
                      color: "var(--cb-text-inverse)",
                      textDecorationColor: "var(--cb-brand-accent)",
                    }}
                  >
                    {item.locale.toUpperCase()}
                  </button>
                  {idx < locales.length - 1 ? (
                    <span style={{ color: "color-mix(in srgb, var(--cb-text-inverse), transparent 60%)" }}>|</span>
                  ) : null}
                </span>
              );
            })}
          </div>
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="text-[13px] font-bold uppercase rounded-full px-5 py-2 transition-colors hover:opacity-90"
              style={{ background: "var(--cb-brand-accent)", color: "var(--cb-text-inverse)" }}
            >
              {t("nav.register")}
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-[240px] rounded-lg shadow-lg overflow-hidden border" style={{ background: "var(--cb-surface-panel)", color: "var(--cb-text-primary)", borderColor: "var(--cb-border-subtle)" }}>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block text-[14px] px-5 py-3 transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cb-surface-muted)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                >
                  {t("nav.newTeamMembership")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
