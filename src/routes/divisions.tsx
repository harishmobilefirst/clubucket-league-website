import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { EmptyState } from "@/components/EmptyState";
import { BackLink } from "@/components/BackLink";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicDivisions } from "@/hooks/use-public-api";
import { generateInitials } from "@/lib/public-api";
import type { PublicDivision } from "@/types/public-api";

export const Route = createFileRoute("/divisions")({
  head: () => ({
    meta: [
      { title: "Divisions — LigaD1" },
      { name: "description", content: "All LigaD1 divisions and clubs —" },
    ],
  }),
  component: Divisions,
});

function Divisions() {
  const { data, isLoading, error } = usePublicDivisions();

  return (
    <Layout>
      <Section muted containerClassName="space-y-[var(--cb-space-section)]">
          {isLoading ? (
            <>
              <DivisionCardSkeleton />
              <DivisionCardSkeleton />
            </>
          ) : error ? (
            <div className="text-center py-[var(--cb-space-section)]">
              <p className="text-[length:var(--cb-font-size-body)] text-[var(--cb-text-secondary)]">This section could not load.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-[var(--cb-space-sm)] text-[length:var(--cb-font-size-caption)] text-[var(--cb-brand-accent)] font-[var(--cb-font-weight-heading)] hover:underline cb-focus"
              >
                Retry
              </button>
            </div>
          ) : !data || data.length === 0 ? (
            <EmptyState message="No divisions are published yet." />
          ) : (
            data.map((div, idx) => (
              <DivisionCard key={`${div.id || div.name}-${idx}`} division={div} />
            ))
          )}
      </Section>
    </Layout>
  );
}

function DivisionCard({ division }: { division: PublicDivision }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const CARD_STEP = 234;

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -CARD_STEP : CARD_STEP, behavior: "smooth" });
  };

  const teams = division.teams || [];

  return (
    <div className="bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-md)] overflow-hidden cb-shadow-panel">
      <div className="bg-[var(--cb-surface-muted)] px-[var(--cb-space-xl)] py-[var(--cb-space-lg)] border-b border-[var(--cb-border-subtle)]">
        <h2 className="cb-title text-[var(--cb-brand-primary)]" style={{ textWrap: "balance" }}>{division.name}</h2>
      </div>
      <div className="relative px-[var(--cb-space-xl)] py-[var(--cb-space-section)]">
        {teams.length > 0 ? (
          <>
            <button
              type="button"
              onClick={() => scrollBy("left")}
              aria-label="Scroll left"
              className="absolute left-[var(--cb-space-12)] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--cb-brand-primary)] text-[var(--cb-text-inverse)] flex items-center justify-center cb-shadow-panel hover:bg-[var(--cb-brand-accent)] transition-colors cb-focus"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy("right")}
              aria-label="Scroll right"
              className="absolute right-[var(--cb-space-12)] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--cb-brand-primary)] text-[var(--cb-text-inverse)] flex items-center justify-center cb-shadow-panel hover:bg-[var(--cb-brand-accent)] transition-colors cb-focus"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div
              ref={scrollerRef}
              className="overflow-x-auto scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              <div className="flex items-stretch gap-[var(--cb-space-lg)]" style={{ width: "max-content" }}>
                {teams.map((t, idx) => (
                  <Link
                    key={`${t.id}-${idx}`}
                    to="/teams/$teamId"
                    params={{ teamId: t.id }}
                    className="w-[210px] shrink-0 group/team bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-lg)] border border-[var(--cb-border-subtle)] hover:border-[var(--cb-brand-accent)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative px-[var(--cb-space-lg)] pt-[var(--cb-space-lg)] pb-[var(--cb-space-sm)] flex items-center justify-center h-[170px]">
                      {t.logoUrl ? (
                        <img
                          src={t.logoUrl}
                          alt={t.name}
                          className="w-[110px] h-[110px] object-contain transition-transform group-hover/team:scale-105"
                        />
                      ) : (
                        <div className="w-[110px] h-[110px] rounded-[var(--cb-radius-lg)] bg-[var(--cb-surface-muted)] text-[var(--cb-text-secondary)] text-[length:var(--cb-font-size-title)] font-[var(--cb-font-weight-heading)] flex items-center justify-center transition-transform group-hover/team:scale-105">
                          {t.initials || generateInitials(t.name)}
                        </div>
                      )}
                    </div>
                    <div className="px-[var(--cb-space-md)] pb-[var(--cb-space-lg)] text-center">
                      <div className="text-[length:var(--cb-font-size-body)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)] leading-tight group-hover/team:text-[var(--cb-brand-accent)] transition-colors">
                        {t.name}
                      </div>
                      <div className="text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-secondary)] mt-[var(--cb-space-xs)]">{division.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          <EmptyState message="No teams in this division yet." />
        )}
      </div>
    </div>
  );
}

function DivisionCardSkeleton() {
  return (
    <div className="bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-md)] overflow-hidden cb-shadow-panel">
      <div className="bg-[var(--cb-surface-muted)] px-[var(--cb-space-xl)] py-[var(--cb-space-lg)] border-b border-[var(--cb-border-subtle)]">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="px-[var(--cb-space-xl)] py-[var(--cb-space-section)]">
        <div className="flex items-stretch gap-[var(--cb-space-lg)]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[210px] shrink-0">
              <Skeleton className="h-[170px] w-full rounded-[var(--cb-radius-lg)]" />
              <div className="px-[var(--cb-space-md)] pb-[var(--cb-space-lg)] mt-[var(--cb-space-md)] space-y-[var(--cb-space-sm)]">
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <Skeleton className="h-3 w-1/2 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
