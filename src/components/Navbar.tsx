import { Link, useLocation } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import logo from "@/assets/ligad1-logo.png";
import { usePublicConfig } from "@/hooks/use-public-api";
import { useLocale } from "@/lib/locale";
import { useI18n } from "@/lib/i18n";
import { isModuleEnabled } from "@/lib/public-api";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = fallbackNavLinks.filter(
    (l) => !l.moduleKey || isModuleEnabled(config, l.moduleKey),
  );

  const logoUrl = config?.logoUrl || logo;
  const leagueName = config?.displayName || "Clubucket";
  const locales = config?.supportedLocales.length ? config.supportedLocales : fallbackLocales;

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] h-[68px]" style={{ background: "var(--cb-brand-primary)", color: "var(--cb-text-inverse)" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3 leading-none shrink-0">
          <img src={logoUrl} alt={leagueName} className="h-10 w-auto sm:h-12" />
        </Link>

        <div className="flex-1" />

        <nav className="hidden lg:flex items-center gap-7">
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

        <div className="hidden lg:flex items-center gap-4 shrink-0">
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

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label={t("nav.openMenu")}
            className="lg:hidden flex items-center justify-center w-11 h-11 -mr-2 rounded-md shrink-0"
          >
            <Menu className="w-6 h-6" style={{ color: "var(--cb-text-inverse)" }} />
          </button>
          <SheetContent
            side="right"
            className="w-[85vw] max-w-[340px] p-0 border-none flex flex-col"
            style={{ background: "var(--cb-surface-panel)" }}
          >
            <SheetTitle className="sr-only">{t("nav.navigationMenu")}</SheetTitle>

            <div className="h-[68px] flex items-center px-6 shrink-0" style={{ background: "var(--cb-brand-primary)" }}>
              <img src={logoUrl} alt={leagueName} className="h-10 w-auto" />
            </div>

            <nav className="flex-1 overflow-y-auto py-2">
              {navLinks.map((l) => {
                const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
                return (
                  <SheetClose asChild key={l.to}>
                    <Link
                      to={l.to}
                      className="flex items-center min-h-[52px] px-6 text-[15px] font-semibold uppercase tracking-[1px] border-b transition-colors"
                      style={{
                        color: active ? "var(--cb-brand-accent)" : "var(--cb-text-primary)",
                        borderBottomColor: "var(--cb-border-subtle)",
                      }}
                    >
                      {t(l.labelKey)}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>

            <div className="shrink-0 px-6 py-5 border-t" style={{ borderTopColor: "var(--cb-border-subtle)" }}>
              <div className="text-[13px] font-semibold flex items-center gap-2 mb-4" style={{ color: "var(--cb-text-secondary)" }}>
                {locales.map((item, idx) => {
                  const active = locale === item.locale;
                  return (
                    <span key={item.locale} className="flex items-center gap-2">
                      <button
                        onClick={() => setLocale(item.locale)}
                        className={active ? "underline underline-offset-4" : "opacity-70"}
                        style={{ color: "var(--cb-text-primary)", textDecorationColor: "var(--cb-brand-accent)" }}
                      >
                        {item.locale.toUpperCase()}
                      </button>
                      {idx < locales.length - 1 ? <span>|</span> : null}
                    </span>
                  );
                })}
              </div>
              <SheetClose asChild>
                <Link
                  to="/register"
                  className="flex items-center justify-center min-h-[48px] w-full rounded-full text-[13px] font-bold uppercase transition-colors hover:opacity-90"
                  style={{ background: "var(--cb-brand-accent)", color: "var(--cb-text-inverse)" }}
                >
                  {t("nav.newTeamMembership")}
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
