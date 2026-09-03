import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageNav } from "@/components/PageNav";
import { MatchDetailDialog } from "@/components/MatchDetailDialog";
import { usePublicSchedule, usePublicSeasons, usePublicDivisions, usePublicConfig } from "@/hooks/use-public-api";
import { generateInitials } from "@/lib/public-api";
import { useI18n, usePageTitle, dateLocale } from "@/lib/i18n";
import type { PublicFixture } from "@/types/public-api";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule — Clubucket" },
      { name: "description", content: "All fixtures and results." },
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
  const { locale, t } = useI18n();
  const { data: config } = usePublicConfig();
  usePageTitle("meta.schedule", { orgName: config?.displayName || "Clubucket" });
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
    if (!seasonId && defaultSeasonId) setSeasonId(defaultSeasonId);
  }, [seasonId, defaultSeasonId]);

  const tabs: { id: View; label: string }[] = [
    { id: "fixtures", label: t("schedule.fixtures") },
    { id: "results", label: t("schedule.results") },
  ];

  const groupedFixtures = useMemo(() => {
    if (!fixtures) return [];
    const groups = new Map<string, PublicFixture[]>();
    for (const f of fixtures) {
      const key =
        f.roundName ||
        f.round?.toString() ||
        f.matchDate?.slice(0, 10) ||
        "other";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(f);
    }
    return Array.from(groups.entries());
  }, [fixtures]);

  return (
    <Layout>
      <div style={{ background: "var(--cb-brand-primary)" }}>
        <div className="max-w-[1200px] mx-auto px-6 flex gap-2 pt-3">
          {tabs.map((tab) => {
            const active = view === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className="text-[13px] font-bold tracking-wider px-7 py-3 rounded-t-[16px] transition-colors"
                style={{
                  background: active ? "var(--cb-surface-panel)" : "transparent",
                  color: active
                    ? "var(--cb-brand-primary)"
                    : "rgba(255,255,255,0.70)",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="py-5 border-b"
        style={{
          background: "var(--cb-surface-panel)",
          borderBottomColor: "var(--cb-border-subtle)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex flex-wrap items-center gap-3">
          <Select
            value={divisionId}
            onValueChange={setDivisionId}
            disabled={!divisions || divisions.length === 0}
          >
            <SelectTrigger
              className="w-full sm:w-[220px] h-11 text-[13px] font-semibold uppercase tracking-wide rounded-md"
              style={{
                borderColor: "var(--cb-border-subtle)",
                background: "var(--cb-surface-panel)",
                color: "var(--cb-text-primary)",
              }}
            >
              <SelectValue placeholder={t("schedule.allDivisions")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t("schedule.allDivisions")}</SelectItem>
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
            <SelectTrigger
              className="w-full sm:w-[220px] h-11 text-[13px] font-semibold uppercase tracking-wide rounded-md"
              style={{
                borderColor: "var(--cb-border-subtle)",
                background: "var(--cb-surface-panel)",
                color: "var(--cb-text-primary)",
              }}
            >
              <SelectValue placeholder={t("schedule.selectSeason")} />
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

      <section
        className="py-10"
        style={{ background: "var(--cb-surface-muted)" }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-28 w-full rounded-[10px]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p
                className="text-[15px]"
                style={{ color: "var(--cb-text-secondary)" }}
              >
                {t("common.sectionError")}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-[13px] font-bold hover:underline transition-colors"
                style={{ color: "var(--cb-brand-accent)" }}
              >
                {t("common.retry")}
              </button>
            </div>
          ) : fixtures.length === 0 ? (
            <div className="text-center py-10">
              <p
                className="text-[15px]"
                style={{ color: "var(--cb-text-secondary)" }}
              >
                {t("schedule.noFixtures")}
              </p>
            </div>
          ) : (
            <div className="mb-12">
              {groupedFixtures.map(([groupKey, groupFixtures]) => (
                <div key={groupKey} className="mb-6">
                  <div
                    className="rounded-md px-5 py-2.5 mb-3"
                    style={{ background: "var(--cb-surface-muted)" }}
                  >
                    <span
                      className="text-[12px] uppercase font-bold tracking-wider"
                      style={{ color: "var(--cb-text-primary)" }}
                    >
                      {groupKey.length === 10
                        ? formatGroupDate(groupKey, locale)
                        : groupKey}
                    </span>
                  </div>
                  {groupFixtures.map((m, idx) => (
                    <MatchCard
                      key={m.id + "-" + idx}
                      m={m}
                      onClick={() => setSelectedFixture(m)}
                    />
                  ))}
                </div>
              ))}
              <PageNav
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
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

function formatGroupDate(isoDate: string, locale: string): string {
  const d = new Date(isoDate + "T00:00:00.000Z");
  return d.toLocaleDateString(dateLocale(locale), {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatDate(isoDate: string, locale: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString(dateLocale(locale), {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function TeamLogoImg({
  team,
}: {
  team?: { logoUrl?: string; shortCode?: string; name: string };
}) {
  if (!team) return null;
  if (team.logoUrl) {
    return (
      <img
        src={team.logoUrl}
        alt={team.name}
        className="w-10 h-10 rounded-[8px] object-contain"
        style={{ border: "1px solid var(--cb-border-subtle)" }}
      />
    );
  }
  return (
    <div
      className="w-10 h-10 rounded-[8px] text-[11px] font-bold flex items-center justify-center border"
      style={{
        background: "var(--cb-surface-muted)",
        color: "var(--cb-text-secondary)",
        borderColor: "var(--cb-border-subtle)",
      }}
    >
      {team.shortCode || generateInitials(team.name)}
    </div>
  );
}

function MatchCard({
  m,
  onClick,
}: {
  m: PublicFixture;
  onClick?: () => void;
}) {
  const { locale, t } = useI18n();
  const isCompleted = m.status === "completed";
  const statusLabel = isCompleted
    ? t("schedule.completed")
    : m.status === "scheduled"
      ? t("schedule.upcoming")
      : m.status;

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
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--cb-brand-accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--cb-border-subtle)";
      }}
      className="rounded-[10px] px-4 py-4 sm:px-7 sm:py-5 mb-2.5 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2"
      style={{
        background: "var(--cb-surface-panel)",
        border: "1px solid var(--cb-border-subtle)",
      }}
    >
      <div className="flex items-center justify-between gap-2 sm:hidden">
        <div
          className="text-[12px] font-bold"
          style={{ color: "var(--cb-text-primary)" }}
        >
          {formatDate(m.matchDate, locale)}
          {m.kickoffTime && (
            <span className="font-normal" style={{ color: "var(--cb-text-muted)" }}>
              {" "}&middot; {m.kickoffTime}
            </span>
          )}
        </div>
        <span
          className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0"
          style={{
            background: isCompleted
              ? "color-mix(in srgb, var(--cb-status-success), transparent 86%)"
              : "var(--cb-surface-muted)",
            color: isCompleted
              ? "var(--cb-status-success)"
              : "var(--cb-text-secondary)",
          }}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3 sm:mt-0 sm:gap-4">
        <div className="hidden sm:block sm:w-[15%] text-center">
          <div
            className="text-[13px] font-bold"
            style={{ color: "var(--cb-text-primary)" }}
          >
            {formatDate(m.matchDate, locale)}
          </div>
          {m.kickoffTime && (
            <div
              className="text-[12px]"
              style={{ color: "var(--cb-text-muted)" }}
            >
              {m.kickoffTime}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 sm:flex-none sm:w-[25%] flex items-center justify-end gap-2 sm:gap-2.5">
          <span
            className="text-[13px] sm:text-[15px] font-semibold text-right truncate"
            style={{ color: "var(--cb-text-primary)" }}
          >
            {m.homeTeam.name}
          </span>
          <TeamLogoImg team={m.homeTeam} />
        </div>
        <div className="shrink-0 w-[64px] sm:w-[20%] text-center">
          {isCompleted &&
          m.result?.homeScore != null &&
          m.result?.awayScore != null ? (
            <div
              className="text-[20px] sm:text-[28px] font-extrabold"
              style={{
                color: "var(--cb-text-primary)",
                textWrap: "balance",
              }}
            >
              {m.result.homeScore} &ndash; {m.result.awayScore}
            </div>
          ) : (
            <div
              className="text-[15px] sm:text-[20px]"
              style={{ color: "var(--cb-text-muted)" }}
            >
              {t("schedule.vs")}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 sm:flex-none sm:w-[25%] flex items-center gap-2 sm:gap-2.5">
          <TeamLogoImg team={m.awayTeam} />
          <span
            className="text-[13px] sm:text-[15px] font-semibold truncate"
            style={{ color: "var(--cb-text-primary)" }}
          >
            {m.awayTeam.name}
          </span>
        </div>
        <div className="hidden sm:block sm:w-[15%] text-right">
          <span
            className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full"
            style={{
              background: isCompleted
                ? "color-mix(in srgb, var(--cb-status-success), transparent 86%)"
                : "var(--cb-surface-muted)",
              color: isCompleted
                ? "var(--cb-status-success)"
                : "var(--cb-text-secondary)",
            }}
          >
            {statusLabel}
          </span>
        </div>
      </div>
      {m.venue?.name && (
        <div
          className="mt-3 pt-3 flex items-center justify-center gap-1.5 text-[12px]"
          style={{
            borderTop: "1px solid var(--cb-border-subtle)",
            color: "var(--cb-text-secondary)",
          }}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{m.venue.name}</span>
        </div>
      )}
    </div>
  );
}
