import type { PublicFixture } from "@/types/public-api";
import { generateInitials } from "@/lib/public-api";
import { Container } from "./Container";

function TeamBadge({
  team,
  accent = false,
}: {
  team: PublicFixture["homeTeam"];
  accent?: boolean;
}) {
  if (!team) return null;
  if (team.logoUrl) {
    return (
      <img
        src={team.logoUrl}
        alt={team.name}
        className="w-6 h-6 rounded-full object-contain shrink-0"
        style={{ background: "var(--cb-surface-panel)" }}
      />
    );
  }

  return (
    <div
      className="w-6 h-6 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0"
      style={{
        background: accent ? "var(--cb-brand-accent)" : "var(--cb-brand-primary)",
        color: "var(--cb-text-inverse)",
      }}
    >
      {team.shortCode || generateInitials(team.name)}
    </div>
  );
}

function Item(f: PublicFixture) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2 mx-2 rounded-md shrink-0 cb-panel cb-shadow-panel"
      style={{ border: "1px solid color-mix(in srgb, var(--cb-border-subtle), white 10%)" }}
    >
      <TeamBadge team={f.homeTeam} />
      <div
        className="text-[13px] font-bold tabular-nums whitespace-nowrap"
        style={{ color: "var(--cb-text-primary)" }}
      >
        {f.result?.homeScore ?? "-"}{" "}
        <span className="mx-0.5" style={{ color: "var(--cb-text-muted)" }}>
          &ndash;
        </span>{" "}
        {f.result?.awayScore ?? "-"}
      </div>
      <TeamBadge team={f.awayTeam} accent />
    </div>
  );
}

export function ScoreTicker({ results }: { results?: PublicFixture[] }) {
  if (!results || results.length === 0) return null;
  const items = [...results, ...results];
  return (
    <div className="w-full py-3" style={{ background: "var(--cb-brand-primary)" }}>
      <Container>
        <div className="overflow-hidden relative">
          <div className="ticker-track flex items-center w-max">
            {items.map((f, i) => (
              <Item key={`${f.id || i}-${i}`} {...f} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
