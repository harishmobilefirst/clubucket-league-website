import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";
import logo from "@/assets/ligad1-logo.png";
import { usePublicConfig } from "@/hooks/use-public-api";
import { useI18n } from "@/lib/i18n";
import { isModuleEnabled } from "@/lib/public-api";

const fallbackQuickLinks = [
  { to: "/", labelKey: "nav.home" },
  { to: "/divisions", labelKey: "nav.divisions" },
  { to: "/schedule", labelKey: "nav.schedule" },
  { to: "/standings", labelKey: "nav.standings", moduleKey: "standings" },
  { to: "/news", labelKey: "nav.news", moduleKey: "news" },
] satisfies { to: string; labelKey: string; moduleKey?: string }[];

export function Footer() {
  const { data: config } = usePublicConfig();
  const { t } = useI18n();

  const quickLinks = fallbackQuickLinks.filter(
    (l) => !l.moduleKey || isModuleEnabled(config, l.moduleKey),
  );

  const logoUrl = config?.logoUrl || logo;
  const leagueName = config?.displayName || "Clubucket";
  const contactEmail =
    config?.contactEmail ||
    (typeof config?.settings?.contactEmail === "string"
      ? config.settings.contactEmail
      : undefined) ||
    config?.supportEmail ||
    "leonel@ligad1.com";
  const website =
    config?.website ||
    (typeof config?.settings?.website === "string" ? config.settings.website : "ligad1.com");
  const socialLinks = config?.socialLinks;
  const locales = config?.supportedLocales.map((item) => item.locale.toUpperCase()) || ["EN", "ES"];

  return (
    <footer className="pt-[60px] pb-[30px]" style={{ background: "var(--cb-brand-primary)", color: "var(--cb-text-inverse)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <img src={logoUrl} alt={leagueName} className="h-16 w-auto" />
            <p className="text-[13px] mt-3" style={{ color: "var(--cb-text-muted)" }}>
              {leagueName}
            </p>
            <div className="flex gap-4 mt-5">
              {socialLinks?.instagram ? (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: "var(--cb-text-inverse)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cb-brand-accent)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cb-text-inverse)")}>
                  <Instagram size={20} />
                </a>
              ) : (
                <span style={{ color: "var(--cb-text-muted)" }}><Instagram size={20} /></span>
              )}
              {socialLinks?.twitter || socialLinks?.x ? (
                <a href={socialLinks.twitter || socialLinks.x} target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: "var(--cb-text-inverse)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cb-brand-accent)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cb-text-inverse)")}>
                  <Twitter size={20} />
                </a>
              ) : (
                <span style={{ color: "var(--cb-text-muted)" }}><Twitter size={20} /></span>
              )}
              {socialLinks?.youtube ? (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: "var(--cb-text-inverse)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cb-brand-accent)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cb-text-inverse)")}>
                  <Youtube size={20} />
                </a>
              ) : (
                <span style={{ color: "var(--cb-text-muted)" }}><Youtube size={20} /></span>
              )}
              {socialLinks?.facebook ? (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: "var(--cb-text-inverse)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cb-brand-accent)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cb-text-inverse)")}>
                  <Facebook size={20} />
                </a>
              ) : (
                <span style={{ color: "var(--cb-text-muted)" }}><Facebook size={20} /></span>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-[11px] uppercase tracking-[1px] mb-4" style={{ color: "var(--cb-text-muted)" }}>
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-[10px]">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[14px] transition-colors" style={{ color: "var(--cb-text-inverse)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cb-brand-accent)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cb-text-inverse)")}>
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] uppercase tracking-[1px] mb-4" style={{ color: "var(--cb-text-muted)" }}>
              {t("footer.contact")}
            </h4>
            <ul className="space-y-[10px]">
              <li>
                <a href={`mailto:${contactEmail}`} className="text-[14px] transition-colors" style={{ color: "var(--cb-text-inverse)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cb-brand-accent)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cb-text-inverse)")}>
                  {contactEmail}
                </a>
              </li>
              <li className="text-[14px]">{website}</li>
              <li className="text-[14px]" style={{ color: "var(--cb-text-muted)" }}>
                <span style={{ color: "var(--cb-text-inverse)" }}>{locales[0]}</span>
                {locales.length > 1 ? ` | ${locales.slice(1).join(" | ")}` : null}
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between text-[12px]" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <span style={{ color: "var(--cb-text-secondary)" }}>
            {t("footer.copyright", { year: 2026, league: leagueName })}
          </span>
          <span style={{ color: "var(--cb-text-muted)" }}>{t("footer.poweredBy")}</span>
        </div>
      </div>
    </footer>
  );
}
