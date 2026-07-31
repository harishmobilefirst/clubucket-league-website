import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout, PageHeader } from "@/components/Layout";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageNav } from "@/components/PageNav";
import {
  usePublicTopScorersPaginated,
  usePublicSeasons,
  usePublicDivisions,
  usePublicConfig,
} from "@/hooks/use-public-api";
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
  const { data, isLoading, error } = usePublicTopScorersPaginated(
    page,
    seasonId || config?.activeSeasonId,
    activeDivisionId,
  );

  const scorers = data?.items;
  const meta = data?.meta;

  return (
    <Layout>
      <PageHeader title={t("topScorers.title")} subtitle={t("topScorers.subtitle")} />

      <Section>
        <div className="flex items-center gap-[var(--cb-space-md)] mb-[var(--cb-space-xl)]">
          {seasons && seasons.length > 0 && (
            <Select
              value={seasonId || "ALL"}
              onValueChange={(v) => {
                setSeasonId(v === "ALL" ? undefined : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder={t("topScorers.allSeasons")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t("topScorers.allSeasons")}</SelectItem>
                {seasons.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {divisions && divisions.length > 0 && (
            <Select
              value={divisionId}
              onValueChange={(v) => {
                setDivisionId(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder={t("topScorers.allDivisions")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t("topScorers.allDivisions")}</SelectItem>
                {divisions.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="overflow-hidden rounded-[var(--cb-radius-md)] border border-[var(--cb-border-subtle)]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="cb-table-header h-14">
                <th className="w-[10%] text-left pl-[var(--cb-space-xl)]">#</th>
                <th className="w-[40%] text-left">{t("topScorers.player")}</th>
                <th className="w-[30%] text-left">{t("topScorers.team")}</th>
                <th className="w-[20%] text-left pr-[var(--cb-space-xl)]">
                  {t("topScorers.goals")}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-t border-[var(--cb-border-subtle)] h-[var(--cb-space-48)]"
                  >
                    <td className="pl-[var(--cb-space-xl)]">
                      <Skeleton className="h-5 w-6" />
                    </td>
                    <td>
                      <div className="flex items-center gap-[var(--cb-space-md)]">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <Skeleton className="h-5 w-36" />
                      </div>
                    </td>
                    <td>
                      <Skeleton className="h-5 w-24" />
                    </td>
                    <td className="pr-[var(--cb-space-xl)]">
                      <Skeleton className="h-5 w-8" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr className="border-t border-[var(--cb-border-subtle)] h-[var(--cb-space-48)]">
                  <td colSpan={4} className="text-center cb-body">
                    This section could not load.
                    <button
                      onClick={() => window.location.reload()}
                      className="ml-[var(--cb-space-xs)] text-[length:var(--cb-font-size-caption)] text-[var(--cb-brand-accent)] font-[var(--cb-font-weight-heading)] hover:underline cb-focus transition-colors"
                    >
                      {t("common.retry")}
                    </button>
                  </td>
                </tr>
              ) : !scorers || scorers.length === 0 ? (
                <tr className="border-t border-[var(--cb-border-subtle)]">
                  <td colSpan={4}>
                    <EmptyState message={t("topScorers.empty")} />
                  </td>
                </tr>
              ) : (
                scorers.map((s, idx) => <Row key={`${s.playerId || s.playerName}-${idx}`} s={s} />)
              )}
            </tbody>
          </table>
        </div>

        {meta && <PageNav page={page} totalPages={meta.totalPages ?? 1} onPageChange={setPage} />}
      </Section>
    </Layout>
  );
}

function Row({ s }: { s: PublicTopScorer }) {
  return (
    <tr className="border-t border-[var(--cb-border-subtle)] bg-[var(--cb-surface-panel)] hover:bg-[var(--cb-surface-muted)] transition-colors h-[var(--cb-space-48)]">
      <td className="pl-[var(--cb-space-xl)] text-[length:var(--cb-font-size-body)] text-[var(--cb-text-primary)]">
        {s.rank}
      </td>
      <td>
        <div className="flex items-center gap-[var(--cb-space-md)]">
          {s.imageUrl ? (
            <img
              src={s.imageUrl}
              alt={s.playerName}
              className="w-12 h-12 rounded-full object-cover border border-[var(--cb-border-subtle)]"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[var(--cb-surface-muted)] text-[var(--cb-text-secondary)] text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] flex items-center justify-center border border-[var(--cb-border-subtle)]">
              {generateInitials(s.playerName)}
            </div>
          )}
          <span className="text-[length:var(--cb-font-size-body)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)]">
            {s.playerName}
          </span>
        </div>
      </td>
      <td className="text-[length:var(--cb-font-size-body)] text-[var(--cb-text-primary)]">
        {s.teamName || "-"}
      </td>
      <td className="pr-[var(--cb-space-xl)] text-[length:var(--cb-font-size-body)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)]">
        {s.goals}
      </td>
    </tr>
  );
}
