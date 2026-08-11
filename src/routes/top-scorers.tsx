import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout, PageHeader } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageNav } from "@/components/PageNav";
import { usePublicTopScorersPaginated, usePublicSeasons, usePublicDivisions, usePublicConfig } from "@/hooks/use-public-api";
import { generateInitials } from "@/lib/public-api";
import { useI18n, usePageTitle } from "@/lib/i18n";
import type { PublicTopScorer } from "@/types/public-api";

export const Route = createFileRoute("/top-scorers")({
  head: () => ({
    meta: [
      { title: "Top Scorers — LigaD1" },
      { name: "description", content: "Leading goal-scorers across the league." },
    ],
  }),
  component: TopScorers,
});

function TopScorers() {
  const { t } = useI18n();
  usePageTitle("meta.topScorers");
  const { data: config } = usePublicConfig();
  const { data: seasons } = usePublicSeasons();
  const { data: divisions } = usePublicDivisions();

  const [seasonId, setSeasonId] = useState<string | undefined>(undefined);
  const [divisionId, setDivisionId] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  const activeDivisionId = divisionId && divisionId !== "ALL" ? divisionId : undefined;
  const { data, isLoading, error } = usePublicTopScorersPaginated(page, seasonId || config?.activeSeasonId, activeDivisionId);

  const scorers = data?.items;
  const meta = data?.meta;

  return (
    <Layout>
      <PageHeader title={t("topScorers.title")} subtitle={t("topScorers.subtitle")} />

      <div className="border-b" style={{ background: "var(--cb-surface-panel)", borderBottomColor: "var(--cb-border-subtle)" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center gap-8">
          {seasons && seasons.length > 0 && (
            <Select value={seasonId || "ALL"} onValueChange={(v) => { setSeasonId(v === "ALL" ? undefined : v); setPage(1); }}>
              <SelectTrigger className="w-[180px] h-10"><SelectValue placeholder={t("topScorers.allSeasons")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t("topScorers.allSeasons")}</SelectItem>
                {seasons.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
              </SelectContent>
            </Select>
          )}
          {divisions && divisions.length > 0 && (
            <Select value={divisionId} onValueChange={(v) => { setDivisionId(v); setPage(1); }}>
              <SelectTrigger className="w-[180px] h-10"><SelectValue placeholder={t("topScorers.allDivisions")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t("topScorers.allDivisions")}</SelectItem>
                {divisions.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <section className="py-10" style={{ background: "var(--cb-surface-panel)" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="overflow-hidden rounded-md border" style={{ borderColor: "var(--cb-border-subtle)" }}>
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-[13px] font-extrabold uppercase tracking-wider" style={{ background: "var(--cb-status-success)", color: "var(--cb-text-inverse)", height: 56 }}>
                  <th className="w-[10%] text-left pl-8">#</th>
                  <th className="w-[40%] text-left">{t("topScorers.player")}</th>
                  <th className="w-[30%] text-left">{t("topScorers.team")}</th>
                  <th className="w-[20%] text-left pr-8">{t("topScorers.goals")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-t" style={{ borderTopColor: "var(--cb-border-subtle)", height: 72 }}>
                      <td className="pl-8"><Skeleton className="h-5 w-6" /></td>
                      <td><div className="flex items-center gap-4"><Skeleton className="w-12 h-12 rounded-full" /><Skeleton className="h-5 w-36" /></div></td>
                      <td><Skeleton className="h-5 w-24" /></td>
                      <td className="pr-8"><Skeleton className="h-5 w-8" /></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr className="border-t" style={{ borderTopColor: "var(--cb-border-subtle)", height: 72 }}>
                    <td colSpan={4} className="text-center text-[14px]" style={{ color: "var(--cb-text-primary)" }}>
                      This section could not load.
                      <button onClick={() => window.location.reload()} className="ml-1 text-[12px] font-bold hover:underline transition-colors" style={{ color: "var(--cb-brand-accent)" }}>{t("common.retry")}</button>
                    </td>
                  </tr>
                ) : !scorers || scorers.length === 0 ? (
                  <tr className="border-t" style={{ borderTopColor: "var(--cb-border-subtle)" }}>
                    <td colSpan={4}><div className="py-10 text-center text-[14px]" style={{ color: "var(--cb-text-secondary)" }}>{t("topScorers.empty")}</div></td>
                  </tr>
                ) : (
                  scorers.map((s, idx) => (<Row key={`${s.playerId || s.playerName}-${idx}`} s={s} />))
                )}
              </tbody>
            </table>
          </div>

          {meta && <PageNav page={page} totalPages={meta.totalPages ?? 1} onPageChange={setPage} />}
        </div>
      </section>
    </Layout>
  );
}

function Row({ s }: { s: PublicTopScorer }) {
  return (
    <tr className="border-t transition-colors" style={{ borderTopColor: "var(--cb-border-subtle)", background: "var(--cb-surface-panel)", minHeight: 72 }} onMouseEnter={(e) => { e.currentTarget.style.background = "var(--cb-surface-muted)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "var(--cb-surface-panel)"; }}>
      <td className="pl-8 text-[15px]" style={{ color: "var(--cb-text-primary)" }}>{s.rank}</td>
      <td>
        <div className="flex items-center gap-4">
          {s.imageUrl ? (
            <img src={s.imageUrl} alt={s.playerName} className="w-12 h-12 rounded-full object-cover border" style={{ borderColor: "var(--cb-border-subtle)" }} />
          ) : (
            <div className="w-12 h-12 rounded-full text-[11px] font-bold flex items-center justify-center border" style={{ background: "var(--cb-surface-muted)", color: "var(--cb-text-secondary)", borderColor: "var(--cb-border-subtle)" }}>{generateInitials(s.playerName)}</div>
          )}
          <div className="py-3">
            <div className="text-[15px] font-bold" style={{ color: "var(--cb-text-primary)" }}>{s.playerName}</div>
            {s.position ? (
              <div className="mt-1 text-[11px] font-bold uppercase tracking-[1.4px]" style={{ color: "var(--cb-text-muted)" }}>
                {s.position}
              </div>
            ) : null}
          </div>
        </div>
      </td>
      <td className="text-[15px]" style={{ color: "var(--cb-text-primary)" }}>{s.teamName || "-"}</td>
      <td className="pr-8 text-[15px] font-bold" style={{ color: "var(--cb-text-primary)" }}>{s.goals}</td>
    </tr>
  );
}
