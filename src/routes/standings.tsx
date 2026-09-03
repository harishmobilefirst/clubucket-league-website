import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
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
      { title: "Standings — Clubucket" },
      { name: "description", content: "Standings updated after each match." },
    ],
  }),
  component: Standing,
});

type StandingsColumn = {
  key: string;
  label: string;
  headerClassName: string;
  cellClassName: string;
  render: (r: PublicStandingRow) => ReactNode;
};

function useStandingsColumns(t: (key: string) => string): StandingsColumn[] {
  return [
    { key: "rank", label: "#", headerClassName: "w-[8%] text-left pl-4 sm:pl-8", cellClassName: "pl-4 sm:pl-8 text-[15px]", render: (r) => r.rank },
    {
      key: "team",
      label: t("standings.team"),
      headerClassName: "w-[30%] text-left",
      cellClassName: "",
      render: (r) => (
        <div className="flex items-center gap-3 sm:gap-4">
          {r.team.logoUrl ? (
            <img src={r.team.logoUrl} alt={r.team.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-[8px] object-contain border shrink-0" style={{ borderColor: "var(--cb-border-subtle)" }} />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[8px] text-[10px] sm:text-[11px] font-bold flex items-center justify-center border shrink-0" style={{ background: "var(--cb-surface-muted)", color: "var(--cb-text-secondary)", borderColor: "var(--cb-border-subtle)" }}>{r.team.shortCode || generateInitials(r.team.name)}</div>
          )}
          <span className="text-[13px] sm:text-[15px]" style={{ color: "var(--cb-text-primary)" }}>{r.team.name}</span>
        </div>
      ),
    },
    { key: "played", label: t("standings.p"), headerClassName: "w-[10%] text-left", cellClassName: "text-[13px] sm:text-[15px]", render: (r) => r.played },
    { key: "wins", label: t("standings.w"), headerClassName: "w-[10%] text-left", cellClassName: "text-[13px] sm:text-[15px]", render: (r) => r.wins },
    { key: "losses", label: t("standings.l"), headerClassName: "w-[10%] text-left", cellClassName: "text-[13px] sm:text-[15px]", render: (r) => r.losses },
    { key: "gf", label: t("standings.gf"), headerClassName: "w-[10%] text-left", cellClassName: "text-[13px] sm:text-[15px]", render: (r) => r.goalsFor },
    { key: "ga", label: t("standings.ga"), headerClassName: "w-[10%] text-left", cellClassName: "text-[13px] sm:text-[15px]", render: (r) => r.goalsAgainst },
    {
      key: "gd",
      label: t("standings.gd"),
      headerClassName: "w-[6%] text-left",
      cellClassName: "text-[13px] sm:text-[15px]",
      render: (r) => {
        const gd = r.goalDifference ?? r.goalsFor - r.goalsAgainst;
        return gd > 0 ? `+${gd}` : gd;
      },
    },
    { key: "pts", label: t("standings.pts"), headerClassName: "w-[10%] text-left pr-4 sm:pr-8", cellClassName: "pr-4 sm:pr-8 text-[13px] sm:text-[15px] font-bold", render: (r) => r.points },
  ];
}

function Standing() {
  const { t } = useI18n();
  const { data: config } = usePublicConfig();
  usePageTitle("meta.standings", { orgName: config?.displayName || "Clubucket" });
  const { data: divisions } = usePublicDivisions();
  const [selectedDivisionId, setSelectedDivisionId] = useState<string | undefined>(undefined);

  const divisionId = selectedDivisionId || divisions?.[0]?.id;
  const seasonId = config?.activeSeasonId;
  const { data: standings, isLoading, error, refetch } = usePublicStandings(seasonId, divisionId);
  const columns = useStandingsColumns(t);

  return (
    <Layout>
      <div className="border-b" style={{ background: "var(--cb-surface-panel)", borderBottomColor: "var(--cb-border-subtle)" }}>
        <div className="max-w-[1200px] mx-auto px-6 flex gap-5 sm:gap-8 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {divisions?.map((d) => {
            const active = d.id === divisionId;
            return (
              <button key={d.id} type="button" onClick={() => setSelectedDivisionId(d.id)} className="relative py-4 text-[13px] uppercase cursor-pointer transition-colors shrink-0" style={{ color: active ? "var(--cb-text-primary)" : "var(--cb-text-muted)", fontWeight: active ? 700 : 600 }}>
                {d.name}
                {active && <span className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none" style={{ background: "var(--cb-brand-accent)" }} />}
              </button>
            );
          })}
        </div>
      </div>

      <section className="py-10" style={{ background: "var(--cb-surface-panel)" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="overflow-x-auto overflow-y-hidden rounded-md border" style={{ borderColor: "var(--cb-border-subtle)" }}>
            <table className="w-full min-w-[640px] border-collapse">
              <caption className="sr-only">{t("standings.legend")}</caption>
              <thead>
                <tr className="text-[13px] font-extrabold uppercase tracking-wider h-14" style={{ background: "var(--cb-status-success)", color: "var(--cb-text-primary)" }}>
                  {columns.map((col) => (
                    <th key={col.key} scope="col" className={col.headerClassName}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="h-[72px]" style={{ borderTop: "1px solid var(--cb-border-subtle)" }}>
                      {columns.map((col) => (
                        <td key={col.key} className={col.cellClassName}>
                          {col.key === "team" ? (
                            <div className="flex items-center gap-4"><Skeleton className="w-10 h-10 rounded-[8px]" /><Skeleton className="h-5 w-32" /></div>
                          ) : (
                            <Skeleton className={col.key === "pts" ? "h-5 w-8" : "h-5 w-6"} />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : error ? (
                  <tr className="h-[72px]" style={{ borderTop: "1px solid var(--cb-border-subtle)" }}>
                    <td colSpan={columns.length} className="text-center text-[15px]">
                      {t("standings.sectionError")}
                      <button onClick={() => refetch()} className="ml-1 text-[13px] font-bold hover:underline transition-colors" style={{ color: "var(--cb-brand-accent)" }}>{t("common.retry")}</button>
                    </td>
                  </tr>
                ) : !standings || standings.length === 0 ? (
                  <tr style={{ borderTop: "1px solid var(--cb-border-subtle)" }}><td colSpan={columns.length}><EmptyState message={t("standings.empty")} /></td></tr>
                ) : (
                  standings.map((r, idx) => <Row key={`${r.id}-${idx}`} r={r} columns={columns} />)
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

function Row({ r, columns }: { r: PublicStandingRow; columns: StandingsColumn[] }) {
  return (
    <tr className="h-[72px]" style={{ borderTop: "1px solid var(--cb-border-subtle)", background: "var(--cb-surface-panel)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "var(--cb-surface-muted)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "var(--cb-surface-panel)"; }}>
      {columns.map((col) => (
        <td key={col.key} className={col.cellClassName} style={{ color: "var(--cb-text-primary)" }}>{col.render(r)}</td>
      ))}
    </tr>
  );
}
