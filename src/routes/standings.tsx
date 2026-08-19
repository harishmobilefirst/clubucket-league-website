import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicStandings, usePublicDivisions, usePublicConfig } from "@/hooks/use-public-api";
import { generateInitials } from "@/lib/public-api";
import { useI18n, usePageTitle } from "@/lib/i18n";
import type { PublicStandingRow } from "@/types/public-api";

export const Route = createFileRoute("/standings")({
  head: () => ({
    meta: [
      { title: "Standings" },
      { name: "description", content: "Standings updated after each match." },
    ],
  }),
  component: Standing,
});

function Standing() {
  const { t } = useI18n();
  const { data: config } = usePublicConfig();
  usePageTitle("meta.standings", { orgName: config?.displayName || "Clubucket" });
  const { data: divisions } = usePublicDivisions();
  const [selectedDivisionId, setSelectedDivisionId] = useState<string | undefined>(undefined);

  const divisionId = selectedDivisionId || divisions?.[0]?.id;
  const seasonId = config?.activeSeasonId;
  const { data: standings, isLoading, error } = usePublicStandings(seasonId, divisionId);

  return (
    <Layout>
      <div className="border-b" style={{ background: "var(--cb-surface-panel)", borderBottomColor: "var(--cb-border-subtle)" }}>
        <div className="max-w-[1200px] mx-auto px-6 flex gap-8">
          {divisions?.map((d) => {
            const active = d.id === divisionId;
            return (
              <button key={d.id} type="button" onClick={() => setSelectedDivisionId(d.id)} className="relative py-4 text-[13px] uppercase cursor-pointer transition-colors" style={{ color: active ? "var(--cb-text-primary)" : "var(--cb-text-muted)", fontWeight: active ? 700 : 600 }}>
                {d.name}
                {active && <span className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none" style={{ background: "var(--cb-brand-accent)" }} />}
              </button>
            );
          })}
        </div>
      </div>

      <section className="py-10" style={{ background: "var(--cb-surface-panel)" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="overflow-hidden rounded-md border" style={{ borderColor: "var(--cb-border-subtle)" }}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-[13px] font-extrabold uppercase tracking-wider h-14" style={{ background: "var(--cb-status-success)", color: "var(--cb-text-primary)" }}>
                  <th className="w-[8%] text-left pl-8">#</th>
                  <th className="w-[30%] text-left">{t("standings.team")}</th>
                  <th className="w-[10%] text-left">{t("standings.p")}</th>
                  <th className="w-[10%] text-left">{t("standings.w")}</th>
                  <th className="w-[10%] text-left">{t("standings.l")}</th>
                  <th className="w-[10%] text-left">{t("standings.gf")}</th>
                  <th className="w-[10%] text-left">{t("standings.ga")}</th>
                  <th className="w-[6%] text-left">{t("standings.gd")}</th>
                  <th className="w-[10%] text-left pr-8">{t("standings.pts")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="h-[72px]" style={{ borderTop: "1px solid var(--cb-border-subtle)" }}>
                      <td className="pl-8"><Skeleton className="h-5 w-6" /></td>
                      <td><div className="flex items-center gap-4"><Skeleton className="w-10 h-10 rounded-[8px]" /><Skeleton className="h-5 w-32" /></div></td>
                      <td><Skeleton className="h-5 w-6" /></td>
                      <td><Skeleton className="h-5 w-6" /></td>
                      <td><Skeleton className="h-5 w-6" /></td>
                      <td><Skeleton className="h-5 w-6" /></td>
                      <td><Skeleton className="h-5 w-6" /></td>
                      <td><Skeleton className="h-5 w-6" /></td>
                      <td className="pr-8"><Skeleton className="h-5 w-8" /></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr className="h-[72px]" style={{ borderTop: "1px solid var(--cb-border-subtle)" }}>
                    <td colSpan={9} className="text-center text-[15px]">
                      This section could not load.
                      <button onClick={() => window.location.reload()} className="ml-1 text-[13px] font-bold hover:underline transition-colors" style={{ color: "var(--cb-brand-accent)" }}>{t("common.retry")}</button>
                    </td>
                  </tr>
                ) : !standings || standings.length === 0 ? (
                  <tr style={{ borderTop: "1px solid var(--cb-border-subtle)" }}><td colSpan={9}><EmptyState message={t("standings.empty")} /></td></tr>
                ) : (
                  standings.map((r, idx) => <Row key={`${r.id}-${idx}`} r={r} />)
                )}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] mt-4" style={{ color: "var(--cb-text-muted)" }}>{t("standings.legend")}</p>
        </div>
      </section>
    </Layout>
  );
}

function Row({ r }: { r: PublicStandingRow }) {
  const gd = r.goalDifference ?? r.goalsFor - r.goalsAgainst;
  return (
    <tr className="h-[72px]" style={{ borderTop: "1px solid var(--cb-border-subtle)", background: "var(--cb-surface-panel)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "var(--cb-surface-muted)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "var(--cb-surface-panel)"; }}>
      <td className="pl-8 text-[15px]" style={{ color: "var(--cb-text-primary)" }}>{r.rank}</td>
      <td>
        <div className="flex items-center gap-4">
          {r.team.logoUrl ? (
            <img src={r.team.logoUrl} alt={r.team.name} className="w-10 h-10 rounded-[8px] object-contain border" style={{ borderColor: "var(--cb-border-subtle)" }} />
          ) : (
            <div className="w-10 h-10 rounded-[8px] text-[11px] font-bold flex items-center justify-center border" style={{ background: "var(--cb-surface-muted)", color: "var(--cb-text-secondary)", borderColor: "var(--cb-border-subtle)" }}>{r.team.shortCode || generateInitials(r.team.name)}</div>
          )}
          <span className="text-[15px]" style={{ color: "var(--cb-text-primary)" }}>{r.team.name}</span>
        </div>
      </td>
      <td className="text-[15px]" style={{ color: "var(--cb-text-primary)" }}>{r.played}</td>
      <td className="text-[15px]" style={{ color: "var(--cb-text-primary)" }}>{r.losses}</td>
      <td className="text-[15px]" style={{ color: "var(--cb-text-primary)" }}>{r.goalsFor}</td>
      <td className="text-[15px]" style={{ color: "var(--cb-text-primary)" }}>{r.goalsAgainst}</td>
      <td className="text-[15px]" style={{ color: "var(--cb-text-primary)" }}>{gd > 0 ? `+${gd}` : gd}</td>
      <td className="pr-8 text-[15px]" style={{ color: "var(--cb-text-primary)" }}>{r.points}</td>
    </tr>
  );
}
