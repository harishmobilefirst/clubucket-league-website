import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Globe } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicConfig, usePublicTeam } from "@/hooks/use-public-api";
import { generateInitials } from "@/lib/public-api";
import { useI18n, usePageTitle } from "@/lib/i18n";

export const Route = createFileRoute("/teams/$teamId")({
  head: () => ({ meta: [{ title: "Team Profile" }] }),
  component: TeamProfile,
});

function TeamProfile() {
  const { teamId } = Route.useParams();
  const { t } = useI18n();
  const { data: config } = usePublicConfig();
  usePageTitle("meta.team", { orgName: config?.displayName || "Clubucket" });
  const { data: team, isLoading, error } = usePublicTeam(teamId);

  if (error && !isLoading) {
    return (
      <Layout>
        <div className="w-full h-[220px] flex items-center justify-center" style={{ background: "var(--cb-brand-primary)" }} />
        <section className="py-[60px]" style={{ background: "var(--cb-surface-muted)" }}>
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <div className="py-10 text-[14px]" style={{ color: "var(--cb-text-secondary)" }}>{t("teams.notFound")}</div>
            <Link to="/divisions" className="inline-block text-[13px] hover:underline mb-4 transition-colors" style={{ color: "var(--cb-text-secondary)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cb-brand-accent)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--cb-text-secondary)"; }}>&larr; {t("teams.backToDivisions")}</Link>
          </div>
        </section>
      </Layout>
    );
  }

  if (!team && !isLoading) throw notFound();

  const players = team?.players || [];
  const coaches = team?.coaches || [];
  const socialLinks = team?.socialLinks;

  return (
    <Layout>
      <div className="w-full h-[220px] flex items-center justify-center" style={{ background: "var(--cb-brand-primary)" }}>
        <div className="text-center px-6">
          {team ? (
            <>
              <div className="text-[12px]" style={{ color: "var(--cb-text-muted)" }}>
                <Link to="/divisions" className="hover:text-[var(--cb-text-inverse)] transition-colors" style={{ color: "var(--cb-text-muted)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cb-text-inverse)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--cb-text-muted)"; }}>{t("teams.divisions")}</Link>
                {team.divisionName && (<><span className="mx-2" style={{ color: "var(--cb-text-inverse)", opacity: 0.4 }}>&rsaquo;</span><span style={{ color: "var(--cb-text-inverse)" }}>{team.divisionName}</span></>)}
                <span className="mx-2" style={{ color: "var(--cb-text-inverse)", opacity: 0.4 }}>&rsaquo;</span>
                <span style={{ color: "var(--cb-text-inverse)" }}>{team.name}</span>
              </div>
              <div className="mx-auto mt-3 w-[72px] h-[72px] rounded-[14px] flex items-center justify-center border-2 overflow-hidden" style={{ borderColor: "var(--cb-text-inverse)" }}>
                {team.logoUrl ? (<img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain" style={{ background: "var(--cb-surface-panel)" }} />) : (<div className="w-full h-full font-bold flex items-center justify-center text-[20px]" style={{ background: "var(--cb-surface-muted)", color: "var(--cb-text-secondary)" }}>{team.initials || generateInitials(team.name)}</div>)}
              </div>
              <h1 className="text-[36px] font-extrabold uppercase mt-3" style={{ color: "var(--cb-text-inverse)", textWrap: "balance" }}>{team.name}</h1>
              {socialLinks && Object.keys(socialLinks).length > 0 && (
                <div className="flex items-center justify-center gap-3 mt-2">
                  {socialLinks.instagram && (<a href={socialLinks.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: "rgba(255,255,255,0.7)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cb-text-inverse)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}><Instagram size={18} /></a>)}
                  {socialLinks.facebook && (<a href={socialLinks.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: "rgba(255,255,255,0.7)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cb-text-inverse)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}><Facebook size={18} /></a>)}
                  {(socialLinks.x || socialLinks.twitter) && (<a href={socialLinks.x || socialLinks.twitter} aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: "rgba(255,255,255,0.7)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cb-text-inverse)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}><Twitter size={18} /></a>)}
                  {(socialLinks.website || socialLinks.other) && (<a href={socialLinks.website || socialLinks.other} aria-label="Website" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: "rgba(255,255,255,0.7)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cb-text-inverse)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}><Globe size={18} /></a>)}
                </div>
              )}
            </>
          ) : (
            <>
              <Skeleton className="h-4 w-48 mx-auto" style={{ background: "rgba(255,255,255,0.20)" }} />
              <Skeleton className="w-[72px] h-[72px] rounded-[14px] mx-auto mt-3" style={{ background: "rgba(255,255,255,0.20)" }} />
              <Skeleton className="h-9 w-56 mx-auto mt-3" style={{ background: "rgba(255,255,255,0.20)" }} />
            </>
          )}
        </div>
      </div>

      <section className="py-[60px]" style={{ background: "var(--cb-surface-muted)" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <Link to="/divisions" className="inline-block text-[13px] mb-4 transition-colors" style={{ color: "var(--cb-text-secondary)" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--cb-brand-accent)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--cb-text-secondary)"; }}>&larr; {t("teams.backToDivisions")}</Link>

          <h2 className="text-[22px] font-bold mb-5" style={{ color: "var(--cb-text-primary)", textWrap: "balance" }}>{t("teams.squad")}</h2>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-[14px] overflow-hidden" style={{ background: "var(--cb-surface-panel)" }}>
                  <Skeleton className="aspect-[3/4] w-full rounded-none" />
                  <div className="px-4 pt-3 pb-4 space-y-2">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : players.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {players.map((p, idx) => (
                <div key={`${p.id || p.name}-${idx}`} className="rounded-[14px] overflow-hidden hover:-translate-y-1 transition-transform duration-300 flex flex-col" style={{ background: "var(--cb-surface-panel)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                  <div className="relative aspect-[3/4] flex items-center justify-center font-bold text-[56px]" style={{ background: "linear-gradient(to bottom, var(--cb-surface-muted), var(--cb-border-subtle))", color: "var(--cb-text-secondary)" }}>
                    {p.imageUrl ? (<img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />) : generateInitials(p.name)}
                  </div>
                  <div className="px-4 pt-3 pb-4">
                    <div className="flex items-center gap-1.5 font-extrabold text-[18px]" style={{ color: "var(--cb-text-primary)" }}>
                      <span aria-hidden className="text-[15px]">⚽</span>
                      <span>{p.number ?? "-"}</span>
                    </div>
                    <h3 className="mt-2 text-[15px] font-extrabold leading-tight" style={{ color: "var(--cb-text-primary)" }}>{p.name}</h3>
                    <p className="text-[12px] mt-0.5" style={{ color: "var(--cb-text-secondary)" }}>{team?.name || ""}</p>
                    <p className="mt-3 text-[11px] font-bold tracking-[1.5px]" style={{ color: "var(--cb-text-muted)" }}>{(p.position || "").toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-[14px]" style={{ color: "var(--cb-text-secondary)" }}>{t("teams.noPlayers")}</div>
          )}

          <h2 className="text-[22px] font-bold mb-5 mt-14" style={{ color: "var(--cb-text-primary)", textWrap: "balance" }}>{t("teams.coaches")}</h2>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-[14px] overflow-hidden" style={{ background: "var(--cb-surface-panel)" }}>
                  <Skeleton className="aspect-[3/4] w-full rounded-none" />
                  <div className="px-4 pt-3 pb-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : coaches.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {coaches.map((c, idx) => (
                <div key={`${c.id || c.name}-${idx}`} className="rounded-[14px] overflow-hidden hover:-translate-y-1 transition-transform duration-300 flex flex-col" style={{ background: "var(--cb-surface-panel)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                  <div className="relative aspect-[3/4] flex items-center justify-center font-bold text-[56px]" style={{ background: "linear-gradient(to bottom, var(--cb-brand-primary), var(--cb-surface-inverse))", color: "var(--cb-text-inverse)" }}>
                    {c.imageUrl ? (<img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />) : generateInitials(c.name)}
                  </div>
                  <div className="px-4 pt-3 pb-4">
                    <h3 className="text-[15px] font-extrabold leading-tight" style={{ color: "var(--cb-text-primary)" }}>{c.name}</h3>
                    <p className="text-[12px] mt-0.5" style={{ color: "var(--cb-text-secondary)" }}>{team?.name || ""}</p>
                    <p className="mt-3 text-[11px] font-bold tracking-[1.5px] uppercase" style={{ color: "var(--cb-text-muted)" }}>{c.role || ""}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-[14px]" style={{ color: "var(--cb-text-secondary)" }}>{t("teams.noCoaches")}</div>
          )}
        </div>
      </section>
    </Layout>
  );
}
