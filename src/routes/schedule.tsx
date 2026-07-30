import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageNav } from "@/components/PageNav";
import { MatchDetailDialog } from "@/components/MatchDetailDialog";
import {
  usePublicSchedule,
  usePublicSeasons,
  usePublicDivisions,
  usePublicConfig,
} from "@/hooks/use-public-api";
import { generateInitials } from "@/lib/public-api";
import type { PublicFixture } from "@/types/public-api";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule — LigaD1" },
      { name: "description", content: "All fixtures and results for the league." },
    ],
  }),
  component: Schedule,
});

type View = "fixtures" | "results";

function Schedule() {
  const [view, setView] = useState<View>("fixtures");
  const [divisionId, setDivisionId] = useState<string>("ALL");
  const [seasonId, setSeasonId] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [selectedFixture, setSelectedFixture] = useState<PublicFixture | null>(null);

  const { data: config } = usePublicConfig();
  const { data: seasons, isLoading: seasonsLoading } = usePublicSeasons();
  const { data: divisions } = usePublicDivisions();

  const activeDivisionId = divisionId && divisionId !== "ALL" ? divisionId : undefined;
  const { data, isLoading, error } = usePublicSchedule(
    seasonId,
    activeDivisionId,
    view === "fixtures" ? "scheduled" : "completed",
    page,
  );
  const fixtures = data?.items ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  useEffect(() => {
    setPage(1);
  }, [view, divisionId, seasonId]);

  const defaultSeasonId = useMemo(() => {
    if (seasonId) return seasonId;
    if (config?.activeSeasonId) return config.activeSeasonId;
    if (seasons && seasons.length > 0) {
      const active = seasons.find((s) => s.isActive || s.isCurrent);
      return active?.id || seasons[0].id;
    }
    return undefined;
  }, [seasonId, config, seasons]);

  useEffect(() => {
    if (!seasonId && defaultSeasonId) {
      setSeasonId(defaultSeasonId);
    }
  }, [seasonId, defaultSeasonId]);

  const tabs: { id: View; label: string }[] = [
    { id: "fixtures", label: "FIXTURES" },
    { id: "results", label: "RESULTS" },
  ];

  const groupedFixtures = useMemo(() => {
    if (!fixtures) return [];
    const groups = new Map<string, PublicFixture[]>();
    for (const f of fixtures) {
      const key = f.roundName || f.round?.toString() || f.matchDate?.slice(0, 10) || "other";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(f);
    }
    return Array.from(groups.entries());
  }, [fixtures]);

  return (
    <Layout>
      {/* Tier 1: Tabs */}
      <div className="bg-[var(--cb-brand-primary)]">
        <div className="max-w-[1200px] mx-auto px-[var(--cb-space-xl)] flex gap-[var(--cb-space-xs)] pt-[var(--cb-space-sm)]">
          {tabs.map((t) => {
            const active = view === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className="text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] tracking-normal px-[var(--cb-space-xl)] py-[var(--cb-space-sm)] rounded-t-[var(--cb-radius-lg)] transition-colors"
                style={{
                  background: active ? "var(--cb-surface-panel)" : "transparent",
                  color: active
                    ? "var(--cb-brand-primary)"
                    : "color-mix(in srgb, var(--cb-text-inverse), transparent 30%)",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier 2: Dropdown filters */}
      <div className="bg-[var(--cb-surface-panel)] border-b border-[var(--cb-border-subtle)] py-[var(--cb-space-lg)]">
        <div className="max-w-[1200px] mx-auto px-[var(--cb-space-xl)] flex flex-wrap items-center gap-[var(--cb-space-sm)]">
          <Select
            value={divisionId}
            onValueChange={setDivisionId}
            disabled={!divisions || divisions.length === 0}
          >
            <SelectTrigger className="w-[220px] h-11 text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] uppercase tracking-normal border-[var(--cb-border-subtle)] rounded-[var(--cb-radius-md)] bg-[var(--cb-surface-panel)] text-[var(--cb-text-primary)]">
              <SelectValue placeholder="All Divisions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Divisions</SelectItem>
              {divisions?.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={seasonId || ""}
            onValueChange={(v) => setSeasonId(v || undefined)}
            disabled={seasonsLoading || !seasons || seasons.length === 0}
          >
            <SelectTrigger className="w-[220px] h-11 text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] uppercase tracking-normal border-[var(--cb-border-subtle)] rounded-[var(--cb-radius-md)] bg-[var(--cb-surface-panel)] text-[var(--cb-text-primary)]">
              <SelectValue placeholder="Select Season" />
            </SelectTrigger>
            <SelectContent>
              {seasons?.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="bg-[var(--cb-surface-muted)] py-[var(--cb-space-section)]">
        <div className="max-w-[1200px] mx-auto px-[var(--cb-space-xl)]">
          {isLoading ? (
            <div className="space-y-[var(--cb-space-md)]">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-[var(--cb-radius-md)]" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-[var(--cb-space-section)]">
              <p className="text-[length:var(--cb-font-size-body)] text-[var(--cb-text-secondary)]">This section could not load.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-[var(--cb-space-sm)] text-[length:var(--cb-font-size-caption)] text-[var(--cb-brand-accent)] font-[var(--cb-font-weight-heading)] hover:underline"
              >
                Retry
              </button>
            </div>
          ) : fixtures.length === 0 ? (
            <div className="text-center py-[var(--cb-space-section)]">
              <p className="text-[length:var(--cb-font-size-body)] text-[var(--cb-text-secondary)]">No fixtures found for this filter.</p>
            </div>
          ) : (
            <div className="mb-[calc(var(--cb-space-xl)*2)]">
              {groupedFixtures.map(([groupKey, groupFixtures]) => (
                <div key={groupKey} className="mb-[var(--cb-space-lg)]">
                  <div className="bg-[var(--cb-surface-muted)] rounded-[var(--cb-radius-md)] px-[var(--cb-space-lg)] py-[var(--cb-space-sm)] mb-[var(--cb-space-sm)]">
                    <span className="text-[length:var(--cb-font-size-caption)] uppercase font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)] tracking-normal">
                      {groupKey.length === 10 ? formatGroupDate(groupKey) : groupKey}
                    </span>
                  </div>
                  {groupFixtures.map((m, idx) => (
                    <MatchCard
                      key={`${m.id}-${idx}`}
                      m={m}
                      onClick={() => setSelectedFixture(m)}
                    />
                  ))}
                </div>
              ))}
              <PageNav page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </section>

      <MatchDetailDialog
        fixture={selectedFixture}
        open={selectedFixture !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedFixture(null);
        }}
      />
    </Layout>
  );
}

function formatGroupDate(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00.000Z");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function TeamLogoImg({ team }: { team: { logoUrl?: string; shortCode?: string; name: string } }) {
  if (team.logoUrl) {
    return (
      <img
        src={team.logoUrl}
        alt={team.name}
        className="w-10 h-10 rounded-[var(--cb-radius-md)] object-contain border border-[var(--cb-border-subtle)]"
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-[var(--cb-radius-md)] bg-[var(--cb-surface-muted)] text-[var(--cb-text-secondary)] text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] flex items-center justify-center border border-[var(--cb-border-subtle)]">
      {team.shortCode || generateInitials(team.name)}
    </div>
  );
}

function MatchCard({ m, onClick }: { m: PublicFixture; onClick?: () => void }) {
  const statusPill =
    m.status === "completed" ? "bg-[color-mix(in_srgb,var(--cb-status-success),transparent_86%)] text-[var(--cb-status-success)]" : "bg-[var(--cb-surface-muted)] text-[var(--cb-text-secondary)]";
  const statusLabel =
    m.status === "completed" ? "Completed" : m.status === "scheduled" ? "Upcoming" : m.status;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="bg-[var(--cb-surface-panel)] border border-[var(--cb-border-subtle)] rounded-[var(--cb-radius-md)] px-[var(--cb-space-xl)] py-[var(--cb-space-lg)] mb-[var(--cb-space-xs)].5 cursor-pointer hover:border-[var(--cb-brand-accent)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cb-brand-accent)]"
    >
      <div className="flex items-center gap-[var(--cb-space-md)]">
        <div className="w-[15%] text-center">
          <div className="text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)]">{formatDate(m.matchDate)}</div>
          {m.kickoffTime && <div className="text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-muted)]">{m.kickoffTime}</div>}
        </div>
        <div className="w-[25%] flex items-center justify-end gap-[var(--cb-space-sm)]">
          <span className="text-[length:var(--cb-font-size-body)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)] text-right">
            {m.homeTeam.name}
          </span>
          <TeamLogoImg team={m.homeTeam} />
        </div>
        <div className="w-[20%] text-center">
          {m.status === "completed" &&
          m.result?.homeScore != null &&
          m.result?.awayScore != null ? (
            <div className="text-[length:var(--cb-font-size-screen)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)]" style={{ textWrap: "balance" }}>
              {m.result.homeScore} &ndash; {m.result.awayScore}
            </div>
          ) : (
            <div className="text-[length:var(--cb-font-size-title)] text-[var(--cb-text-muted)]">vs</div>
          )}
        </div>
        <div className="w-[25%] flex items-center gap-[var(--cb-space-sm)]">
          <TeamLogoImg team={m.awayTeam} />
          <span className="text-[length:var(--cb-font-size-body)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)]">{m.awayTeam.name}</span>
        </div>
        <div className="w-[15%] text-right">
          <span
            className={`inline-block text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] px-[var(--cb-space-sm)] py-[var(--cb-space-xs)] rounded-full ${statusPill}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>
      {m.venue?.name && (
        <div className="mt-[var(--cb-space-sm)] pt-[var(--cb-space-sm)] border-t border-[var(--cb-border-subtle)] flex items-center justify-center gap-[var(--cb-space-xs)] text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-secondary)]">
          <MapPin className="w-3.5 h-3.5" />
          <span>{m.venue.name}</span>
        </div>
      )}
    </div>
  );
}
