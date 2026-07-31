import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicFixture } from "@/hooks/use-public-api";
import { generateInitials } from "@/lib/public-api";
import { useI18n, dateLocale } from "@/lib/i18n";
import type {
  PublicFixture,
  PublicFixtureCardEvent,
  PublicFixtureGoalEvent,
} from "@/types/public-api";

type Props = {
  fixture: PublicFixture | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function TeamBadge({ team }: { team: { logoUrl?: string; shortCode?: string; name: string } }) {
  if (team.logoUrl) {
    return (
      <img
        src={team.logoUrl}
        alt={team.name}
        className="w-12 h-12 rounded-[var(--cb-radius-md)] object-contain border border-[var(--cb-border-subtle)] bg-[var(--cb-surface-panel)]"
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-[var(--cb-radius-md)] bg-[var(--cb-surface-muted)] text-[var(--cb-text-secondary)] text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] flex items-center justify-center border border-[var(--cb-border-subtle)]">
      {team.shortCode || generateInitials(team.name)}
    </div>
  );
}

function formatDate(isoDate: string, locale: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString(dateLocale(locale), {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Small colored rectangle representing a booking. */
function CardChip({ type }: { type: "yellow" | "red" }) {
  return (
    <span
      aria-hidden
      className="inline-block w-2.5 h-3.5 rounded-[2px] shrink-0"
      style={{
        background: type === "red" ? "var(--cb-status-danger)" : "var(--cb-status-warning)",
      }}
    />
  );
}

function CountTag({ count }: { count: number }) {
  if (count <= 1) return null;
  return (
    <span className="text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-muted)]">
      &times;{count}
    </span>
  );
}

/**
 * One side of an event section. `align` decides whether rows read left→right
 * (home team) or right→left (away team) so each column visually belongs to its side.
 */
function GoalColumn({
  goals,
  align,
}: {
  goals: PublicFixtureGoalEvent[];
  align: "left" | "right";
}) {
  const rowJustify = align === "right" ? "justify-end" : "justify-start";
  const textAlign = align === "right" ? "text-right" : "text-left";
  const { t } = useI18n();
  if (goals.length === 0) {
    return (
      <p
        className={`text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-muted)] ${textAlign}`}
      >
        &mdash;
      </p>
    );
  }
  return (
    <ul className="space-y-[var(--cb-space-xs)]">
      {goals.map((g) => (
        <li key={g.id} className={`flex items-center gap-[var(--cb-space-xs)] ${rowJustify}`}>
          <span className="text-[length:var(--cb-font-size-body)] text-[var(--cb-text-primary)]">
            {g.playerName || t("fixture.unknownPlayer")}
          </span>
          <CountTag count={g.goals} />
        </li>
      ))}
    </ul>
  );
}

function CardColumn({
  cards,
  align,
}: {
  cards: PublicFixtureCardEvent[];
  align: "left" | "right";
}) {
  const rowJustify = align === "right" ? "justify-end" : "justify-start";
  const textAlign = align === "right" ? "text-right" : "text-left";
  const { t } = useI18n();
  if (cards.length === 0) {
    return (
      <p
        className={`text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-muted)] ${textAlign}`}
      >
        &mdash;
      </p>
    );
  }
  return (
    <ul className="space-y-[var(--cb-space-xs)]">
      {cards.map((c) => (
        <li key={c.id} className={`flex items-center gap-[var(--cb-space-xs)] ${rowJustify}`}>
          {align === "right" ? (
            <>
              <span className="text-[length:var(--cb-font-size-body)] text-[var(--cb-text-primary)]">
                {c.playerName || t("fixture.unknownPlayer")}
              </span>
              <CountTag count={c.cards} />
              <CardChip type={c.cardType} />
            </>
          ) : (
            <>
              <CardChip type={c.cardType} />
              <span className="text-[length:var(--cb-font-size-body)] text-[var(--cb-text-primary)]">
                {c.playerName || t("fixture.unknownPlayer")}
              </span>
              <CountTag count={c.cards} />
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] uppercase tracking-normal text-[var(--cb-text-secondary)] text-center mb-[var(--cb-space-sm)]">
      {children}
    </h4>
  );
}

function TeamColumnHeaders({ homeName, awayName }: { homeName: string; awayName: string }) {
  return (
    <div className="grid grid-cols-2 gap-[var(--cb-space-lg)] mb-[var(--cb-space-sm)] pb-[var(--cb-space-xs)] border-b border-[var(--cb-border-subtle)]">
      <span className="text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)] text-left truncate">
        {homeName}
      </span>
      <span className="text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)] text-right truncate">
        {awayName}
      </span>
    </div>
  );
}

export function MatchDetailDialog({ fixture, open, onOpenChange }: Props) {
  const { locale, t } = useI18n();
  const { data, isLoading, error } = usePublicFixture(open && fixture ? fixture.id : undefined);

  const detail = data ?? fixture;
  const homeTeam = detail?.homeTeam;
  const awayTeam = detail?.awayTeam;

  const homeGoals = data?.goalEvents?.filter((e) => e.teamId === homeTeam?.id) ?? [];
  const awayGoals = data?.goalEvents?.filter((e) => e.teamId === awayTeam?.id) ?? [];
  const homeCards = data?.cardEvents?.filter((e) => e.teamId === homeTeam?.id) ?? [];
  const awayCards = data?.cardEvents?.filter((e) => e.teamId === awayTeam?.id) ?? [];

  const hasGoals = homeGoals.length > 0 || awayGoals.length > 0;
  const hasCards = homeCards.length > 0 || awayCards.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] max-h-[85vh] overflow-y-auto bg-[var(--cb-surface-panel)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--cb-text-primary)]">
            {t("fixture.details")}
          </DialogTitle>
        </DialogHeader>

        {!detail ? null : (
          <>
            {/* Scoreline */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-[var(--cb-space-md)] py-[var(--cb-space-md)]">
              <div className="flex flex-col items-center gap-[var(--cb-space-xs)] text-center">
                <TeamBadge team={homeTeam!} />
                <span className="text-[length:var(--cb-font-size-body)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)] leading-tight">
                  {homeTeam!.name}
                </span>
              </div>
              <div className="text-center pt-[var(--cb-space-sm)]">
                {detail.status === "completed" &&
                detail.result?.homeScore != null &&
                detail.result?.awayScore != null ? (
                  <div className="text-[length:var(--cb-font-size-screen)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)] whitespace-nowrap">
                    {detail.result.homeScore} &ndash; {detail.result.awayScore}
                  </div>
                ) : (
                  <div className="text-[length:var(--cb-font-size-title)] text-[var(--cb-text-muted)]">
                    {t("schedule.vs")}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-[var(--cb-space-xs)] text-center">
                <TeamBadge team={awayTeam!} />
                <span className="text-[length:var(--cb-font-size-body)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)] leading-tight">
                  {awayTeam!.name}
                </span>
              </div>
            </div>

            {/* Meta */}
            <div className="text-center text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-secondary)] space-y-[var(--cb-space-2xs)] pb-[var(--cb-space-md)] border-b border-[var(--cb-border-subtle)]">
              <div>
                {formatDate(detail.matchDate, locale)}
                {detail.kickoffTime ? ` · ${detail.kickoffTime}` : ""}
              </div>
              {detail.venue?.name && (
                <div className="flex items-center justify-center gap-[var(--cb-space-xs)]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{detail.venue.name}</span>
                </div>
              )}
              {detail.roundName && <div>{detail.roundName}</div>}
            </div>

            {/* Events */}
            <div className="pt-[var(--cb-space-lg)]">
              {isLoading ? (
                <div className="space-y-[var(--cb-space-sm)]">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ) : error ? (
                <p className="text-center text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-secondary)] py-[var(--cb-space-lg)]">
                  {t("fixture.detailsError")}
                </p>
              ) : !hasGoals && !hasCards ? (
                <p className="text-center text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-secondary)] py-[var(--cb-space-lg)]">
                  {t("fixture.noEvents")}
                </p>
              ) : (
                <div className="space-y-[var(--cb-space-xl)]">
                  {/* Goals section */}
                  <section>
                    <SectionHeading>{t("fixture.goals")}</SectionHeading>
                    {hasGoals ? (
                      <>
                        <TeamColumnHeaders homeName={homeTeam!.name} awayName={awayTeam!.name} />
                        <div className="grid grid-cols-2 gap-[var(--cb-space-lg)]">
                          <GoalColumn goals={homeGoals} align="left" />
                          <GoalColumn goals={awayGoals} align="right" />
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-muted)]">
                        {t("fixture.noGoals")}
                      </p>
                    )}
                  </section>

                  {/* Cards section */}
                  <section>
                    <SectionHeading>{t("fixture.cards")}</SectionHeading>
                    {hasCards ? (
                      <>
                        <TeamColumnHeaders homeName={homeTeam!.name} awayName={awayTeam!.name} />
                        <div className="grid grid-cols-2 gap-[var(--cb-space-lg)]">
                          <CardColumn cards={homeCards} align="left" />
                          <CardColumn cards={awayCards} align="right" />
                        </div>
                        <div className="flex items-center justify-center gap-[var(--cb-space-lg)] mt-[var(--cb-space-md)] pt-[var(--cb-space-sm)] border-t border-[var(--cb-border-subtle)] text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-muted)]">
                          <span className="flex items-center gap-[var(--cb-space-xs)]">
                            <CardChip type="yellow" /> {t("fixture.yellow")}
                          </span>
                          <span className="flex items-center gap-[var(--cb-space-xs)]">
                            <CardChip type="red" /> {t("fixture.red")}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-muted)]">
                        {t("fixture.noCards")}
                      </p>
                    )}
                  </section>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
