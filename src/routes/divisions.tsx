import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicDivisions } from "@/hooks/use-public-api";
import { generateInitials } from "@/lib/public-api";
import { useI18n, usePageTitle } from "@/lib/i18n";
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
  const { t } = useI18n();
  usePageTitle("meta.divisions");
  const { data, isLoading, error } = usePublicDivisions();

  return (
    <Layout>
      <section className="py-[60px]" style={{ background: "var(--cb-surface-muted)" }}>
        <div className="max-w-[1200px] mx-auto px-6 space-y-10">
          {isLoading ? (
            <>
              <DivisionCardSkeleton />
              <DivisionCardSkeleton />
            </>
          ) : error ? (
            <div className="text-center py-[60px]">
              <p className="text-[14px]" style={{ color: "var(--cb-text-secondary)" }}>{t("common.sectionError")}</p>
              <button onClick={() => window.location.reload()} className="mt-2 text-[12px] font-bold hover:underline transition-colors" style={{ color: "var(--cb-brand-accent)" }}>{t("common.retry")}</button>
            </div>
          ) : !data || data.length === 0 ? (
            <div className="text-center py-[60px] text-[14px]" style={{ color: "var(--cb-text-secondary)" }}>{t("divisions.empty")}</div>
          ) : (
            data.map((div, idx) => <DivisionCard key={`${div.id || div.name}-${idx}`} division={div} />)
          )}
        </div>
      </section>
    </Layout>
  );
}

function DivisionCard({ division }: { division: PublicDivision }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const CARD_STEP = 230;
  const { t } = useI18n();
  const [paused, setPaused] = useState(false);
  const [pos, setPos] = useState(0);
  const teams = division.teams || [];

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;
    const count = Math.max(1, Math.ceil(max / CARD_STEP));
    const timer = setInterval(() => {
      setPos((p) => {
        const next = (p + 1) % (count + 1);
        el.scrollTo({ left: next * CARD_STEP, behavior: next === 0 ? "auto" : "smooth" });
        return next;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, [paused, teams.length]);

  const shift = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;
    const count = Math.max(1, Math.ceil(max / CARD_STEP));
    setPos((p) => {
      const next = dir === "right" ? Math.min(p + 1, count) : Math.max(p - 1, 0);
      el.scrollTo({ left: next * CARD_STEP, behavior: "smooth" });
      return next;
    });
  };

  return (
    <div className="rounded-[10px] overflow-hidden" style={{ background: "var(--cb-surface-panel)", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      <div className="px-8 py-5 border-b" style={{ background: "var(--cb-surface-muted)", borderBottomColor: "var(--cb-border-subtle)" }}>
        <h2 className="text-[22px] font-bold" style={{ color: "var(--cb-brand-primary)" }}>{division.name}</h2>
      </div>
      <div className="relative px-6 py-10">
        {teams.length > 0 ? (
          <>
            <button type="button" onClick={() => shift("left")} aria-label={t("divisions.scrollLeft")} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors" style={{ backgroundColor: "var(--cb-brand-primary)", color: "var(--cb-text-inverse)" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--cb-brand-accent)"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--cb-brand-primary)"; }}><ChevronLeft className="w-5 h-5" /></button>
            <button type="button" onClick={() => shift("right")} aria-label={t("divisions.scrollRight")} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors" style={{ backgroundColor: "var(--cb-brand-primary)", color: "var(--cb-text-inverse)" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--cb-brand-accent)"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--cb-brand-primary)"; }}><ChevronRight className="w-5 h-5" /></button>
            <div ref={scrollerRef} className="overflow-x-auto" style={{ scrollbarWidth: "none" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
              <div className="flex items-stretch gap-5" style={{ width: "max-content" }}>
                {teams.map((t, idx) => (
                  <Link key={`${t.id}-${idx}`} to="/teams/$teamId" params={{ teamId: t.id }} className="w-[210px] shrink-0 group/team rounded-[14px] border hover:-translate-y-1 transition-all duration-300 flex flex-col" style={{ backgroundColor: "var(--cb-surface-panel)", borderColor: "var(--cb-border-subtle)", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--cb-brand-accent)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--cb-border-subtle)"; }}>
                    <div className="relative px-5 pt-5 pb-3 flex items-center justify-center h-[170px]">
                      {t.logoUrl ? (
                        <img src={t.logoUrl} alt={t.name} className="w-[110px] h-[110px] object-contain transition-transform group-hover/team:scale-105" />
                      ) : (
                        <div className="w-[110px] h-[110px] rounded-[14px] text-[20px] font-bold flex items-center justify-center transition-transform group-hover/team:scale-105" style={{ backgroundColor: "var(--cb-surface-muted)", color: "var(--cb-text-secondary)" }}>{t.initials || generateInitials(t.name)}</div>
                      )}
                    </div>
                    <div className="px-4 pb-5 text-center">
                      <div className="text-[15px] font-bold leading-tight transition-colors group-hover/team:text-[var(--cb-brand-accent)]" style={{ color: "var(--cb-text-primary)" }}>{t.name}</div>
                      <div className="text-[12px] mt-1" style={{ color: "var(--cb-text-secondary)" }}>{division.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-[14px]" style={{ color: "var(--cb-text-secondary)" }}>{t("divisions.noTeams")}</div>
        )}
      </div>
    </div>
  );
}

function DivisionCardSkeleton() {
  return (
    <div className="rounded-[10px] overflow-hidden" style={{ background: "var(--cb-surface-panel)", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      <div className="px-8 py-5 border-b" style={{ background: "var(--cb-surface-muted)", borderBottomColor: "var(--cb-border-subtle)" }}>
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="px-6 py-10">
        <div className="flex items-stretch gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[210px] shrink-0">
              <Skeleton className="h-[170px] w-full rounded-[14px]" />
              <div className="px-4 pb-5 mt-4 space-y-2">
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
