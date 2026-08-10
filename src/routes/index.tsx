import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import seasonHighlights from "@/assets/season-highlights.jpg";
import { Layout } from "@/components/Layout";
import { ScoreTicker } from "@/components/ScoreTicker";
import { NewsCard } from "@/components/NewsCard";
import { HighlightCard } from "@/components/HighlightCard";
import { Skeleton } from "@/components/ui/skeleton";
import hero1 from "@/assets/hero-1.png";
import hero2 from "@/assets/hero-2.png";
import hero3 from "@/assets/hero-3.png";
import { useLocale } from "@/lib/locale";
import { useI18n, usePageTitle } from "@/lib/i18n";
import {
  usePublicConfig,
  usePublicHome,
  usePublicAbout,
  usePublicDivisions,
  usePublicSeasons,
  usePublicTopScorers,
  usePublicSchedule,
  usePublicSponsors,
} from "@/hooks/use-public-api";
import {
  contentItemSlug,
  generateInitials,
  getDefaultSeasonId,
  normalizeContentImage,
  normalizeContentExcerpt,
} from "@/lib/public-api";
import type { PublicFixture, PublicTopScorer, PublicSponsor } from "@/types/public-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LigaD1 — The Heart of Mexican Soccer" },
      { name: "description", content: "LigaD1 — Mexico's premier semi-professional soccer league." },
    ],
  }),
  component: Home,
});

const fallbackSlides = [hero1, hero2, hero3];

function getCompletedMatches(scheduleMatches?: PublicFixture[], homeMatches?: PublicFixture[]): PublicFixture[] {
  const matches = scheduleMatches?.length ? scheduleMatches : homeMatches || [];
  return matches.filter((match) => match.status === "completed" && match.result?.homeScore != null && match.result?.awayScore != null).slice(0, 8);
}

function HeroSlider({ slides }: { slides?: { imageUrl?: string; headline?: string; subheadline?: string; ctaText?: string; ctaLink?: string }[] }) {
  const [current, setCurrent] = useState(0);
  const count = slides && slides.length > 0 ? slides.length : fallbackSlides.length;
  const { t } = useI18n();

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % count), 5000);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <section className="relative w-full h-[600px] overflow-hidden" style={{ background: "var(--cb-brand-primary)" }}>
      {(!slides || slides.length === 0 ? fallbackSlides.map((src) => ({ imageUrl: src })) : slides).map((slide, slideIdx) => (
        <div key={slideIdx} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: slideIdx === current ? 1 : 0, backgroundImage: slide.imageUrl ? `url(${slide.imageUrl})` : undefined, backgroundColor: slide.imageUrl ? undefined : "var(--cb-brand-primary)", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.25))" }} />
        </div>
      ))}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          {slides && slides[current]?.headline ? (
            <>
              <h1 className="text-[52px] font-extrabold uppercase leading-[1.05]" style={{ color: "var(--cb-text-inverse)", textWrap: "balance" }}>{slides[current].headline}</h1>
              {slides[current].subheadline && <p className="text-[18px] mt-5" style={{ color: "rgba(255,255,255,0.80)" }}>{slides[current].subheadline}</p>}
              {slides[current].ctaText && (
                <div className="mt-8">
                  <Link to={slides[current].ctaLink || "/schedule"} className="inline-block rounded-full px-7 py-3 text-[14px] font-bold uppercase transition-colors hover:opacity-90" style={{ background: "var(--cb-brand-accent)", color: "var(--cb-text-inverse)" }}>{slides[current].ctaText}</Link>
                </div>
              )}
            </>
          ) : (
            <>
              <h1 className="text-[52px] font-extrabold uppercase leading-[1.05]" style={{ color: "var(--cb-text-inverse)", textWrap: "balance" }}>{t("home.heroTitle")}</h1>
              <p className="text-[18px] mt-5" style={{ color: "rgba(255,255,255,0.80)" }}>LigaD1</p>
              <div className="mt-8">
                <Link to="/schedule" className="inline-block rounded-full px-7 py-3 text-[14px] font-bold uppercase transition-colors hover:opacity-90" style={{ background: "var(--cb-brand-accent)", color: "var(--cb-text-inverse)" }}>{t("home.heroCta")}</Link>
              </div>
            </>
          )}
        </div>
      </div>
      {count > 1 && (
        <>
          <button onClick={() => setCurrent((current - 1 + count) % count)} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-colors hover:bg-black/60" style={{ background: "rgba(0,0,0,0.40)", color: "var(--cb-text-inverse)" }}><ChevronLeft size={22} /></button>
          <button onClick={() => setCurrent((current + 1) % count)} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-colors hover:bg-black/60" style={{ background: "rgba(0,0,0,0.40)", color: "var(--cb-text-inverse)" }}><ChevronRight size={22} /></button>
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
            {Array.from({ length: count }).map((_, dotIdx) => (
              <button key={dotIdx} onClick={() => setCurrent(dotIdx)} className="w-2.5 h-2.5 rounded-full transition-colors" style={{ background: dotIdx === current ? "var(--cb-text-inverse)" : "color-mix(in srgb, var(--cb-text-inverse), transparent 65%)" }} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function Home() {
  const { locale } = useLocale();
  const { t } = useI18n();
  usePageTitle("meta.home");
  const { data: config } = usePublicConfig();
  const { data: home, isLoading: homeLoading, error: homeError } = usePublicHome(locale);
  const { data: divisionsData } = usePublicDivisions();
  const { data: seasonsData } = usePublicSeasons();
  const seasonId = getDefaultSeasonId(config, seasonsData);
  const { data: topScorersData } = usePublicTopScorers(seasonId);
  const { data: scheduleData, isLoading: scheduleLoading } = usePublicSchedule(seasonId, undefined, "completed");
  const { data: aboutData } = usePublicAbout(locale);
  const { data: sponsorsData } = usePublicSponsors(locale);

  const apiDivisions = home?.divisions || divisionsData;
  const topScorers = home?.topScorers || topScorersData;
  const latestNews = (home?.latestNews || []).filter((n) => contentItemSlug(n));
  const highlightsData = (home?.highlights || []).filter((h) => contentItemSlug(h));
  const sponsors = home?.sponsors && home.sponsors.length > 0 ? home.sponsors : sponsorsData;
  const completedMatches = getCompletedMatches(scheduleData?.items, home?.recentResults);
  const tickerLoading = scheduleLoading && completedMatches.length === 0;
  const heroSlides = config?.heroImages?.length ? config.heroImages.map((img) => ({ imageUrl: img, headline: config?.heroTitle, subheadline: config?.subtitle, ctaText: t("home.heroCta"), ctaLink: "/schedule" })) : home?.heroSlides;

  return (
    <Layout>
      <div>
        {tickerLoading ? (
          <div className="w-full py-3" style={{ background: "var(--cb-brand-primary)" }}>
            <div className="max-w-[1200px] mx-auto px-6 flex gap-2">
              <Skeleton className="h-10 w-[180px] rounded-md" style={{ background: "rgba(255,255,255,0.15)" }} />
              <Skeleton className="h-10 w-[180px] rounded-md" style={{ background: "rgba(255,255,255,0.15)" }} />
              <Skeleton className="h-10 w-[180px] rounded-md" style={{ background: "rgba(255,255,255,0.15)" }} />
            </div>
          </div>
        ) : (
          <ScoreTicker results={completedMatches} />
        )}
        <HeroSlider slides={heroSlides} />
      </div>

      {homeError && (
        <section className="py-[var(--cb-space-section)]" style={{ background: "var(--cb-surface-muted)" }}>
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <p className="text-[15px]" style={{ color: "var(--cb-text-secondary)", lineHeight: 1.7 }}>{t("common.sectionCouldNotLoad")}</p>
            <button onClick={() => window.location.reload()} className="mt-7 text-[14px] uppercase font-semibold hover:underline transition-colors" style={{ color: "var(--cb-brand-accent)" }}>{t("common.retry")}</button>
          </div>
        </section>
      )}

      {/* About */}
      <section className="py-20" style={{ background: "var(--cb-surface-muted)" }}>
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[16px] font-extrabold uppercase tracking-[2.5px]" style={{ color: "var(--cb-brand-accent)" }}>{(aboutData as any)?.eyebrow || t("home.aboutEyebrow")}</div>
            <h2 className="text-[32px] font-bold mt-3" style={{ color: "var(--cb-text-primary)", textWrap: "balance" }}>{aboutData?.title || home?.aboutContent?.title || t("home.aboutTitle")}</h2>
            <p className="text-[15px] mt-5" style={{ color: "var(--cb-text-secondary)", lineHeight: 1.7 }}>{aboutData?.summary || home?.aboutContent?.body || t("home.aboutBody1")}</p>
            <p className="text-[15px] mt-3" style={{ color: "var(--cb-text-secondary)", lineHeight: 1.7 }}>{(aboutData as any)?.summary2 || t("home.aboutBody2")}</p>
            <Link to="/about" className="mt-7 inline-block text-[14px] uppercase font-semibold hover:underline transition-colors" style={{ color: "var(--cb-brand-accent)" }}>{t("common.learnMore")} &rarr;</Link>
          </div>
          <div className="rounded-xl overflow-hidden min-h-[280px]">
            <img src={aboutData?.imageUrl || home?.aboutContent?.imageUrl || seasonHighlights} alt={aboutData?.title || t("home.aboutImgAlt")} width={1280} height={896} loading="lazy" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Our Divisions */}
      <section className="py-20" style={{ background: "var(--cb-brand-primary)" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[40px] md:text-[44px] font-extrabold uppercase tracking-tight" style={{ textWrap: "balance" }}>
            <span style={{ color: "var(--cb-text-inverse)" }}>{t("home.our")} </span>
            <span style={{ color: "var(--cb-brand-accent)" }}>{t("home.divisions")}</span>
          </h2>
          {apiDivisions && apiDivisions.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {apiDivisions.map((div, idx) => (
                <Link key={`${div.id || div.name}-${idx}`} to="/divisions" className="group relative overflow-hidden hover:-translate-y-1 transition-all duration-300" style={{ background: "var(--cb-surface-panel)", borderRadius: 12, padding: 24, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
                  <span className="absolute top-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300" style={{ background: "var(--cb-brand-accent)" }} />
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-[10px] border-2 flex items-center justify-center" style={{ borderColor: "var(--cb-brand-primary)", background: "var(--cb-surface-panel)" }}>
                      <span className="text-[10px] font-extrabold" style={{ color: "var(--cb-brand-primary)" }}>{config?.displayName ? generateInitials(config.displayName) : "L1"}</span>
                    </div>
                  </div>
                  <h3 className="mt-6 text-[22px] font-extrabold uppercase tracking-tight leading-tight" style={{ color: "var(--cb-brand-primary)" }}>{div.name}</h3>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[12px] uppercase font-bold tracking-[1.5px]" style={{ color: "var(--cb-brand-accent)" }}>{t("home.viewStandings")}</span>
                    <div className="w-9 h-9 rounded-md flex items-center justify-center group-hover:opacity-90 transition-colors" style={{ background: "var(--cb-brand-accent)", color: "var(--cb-text-inverse)" }}><ChevronRight size={18} /></div>
                  </div>
                </Link>
              ))}
            </div>
          ) : homeLoading ? (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6" style={{ background: "var(--cb-surface-panel)", borderRadius: 12 }}>
                  <Skeleton className="w-12 h-12 rounded-[10px]" />
                  <Skeleton className="h-7 w-3/4 mt-6" />
                  <Skeleton className="h-4 w-1/3 mt-6" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Top Scorers */}
      {topScorers && topScorers.length > 0 && <TopScorersSection scorers={topScorers} />}

      {/* News */}
      {latestNews.length > 0 ? (
        <section className="pt-10 pb-20" style={{ background: "var(--cb-surface-muted)" }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[32px] font-bold" style={{ color: "var(--cb-text-primary)" }}>{t("home.latestNews")}</h2>
              <Link to="/news" className="text-[13px] uppercase font-semibold transition-colors hover:underline" style={{ color: "var(--cb-brand-accent)" }}>{t("home.viewAllNews")} &rarr;</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {latestNews.slice(0, 3).map((item, idx) => (
                <NewsCard key={`${item.id || item.title}-${idx}`} category={item.category || ""} title={item.title} date={item.date || ""} excerpt={normalizeContentExcerpt(item)} image={normalizeContentImage(item)} />
              ))}
            </div>
          </div>
        </section>
      ) : homeLoading ? (
        <SectionSkeleton />
      ) : null}

      {/* Highlights */}
      {highlightsData.length > 0 ? (
        <section className="pb-20" style={{ background: "var(--cb-surface-muted)" }}>
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[32px] font-bold" style={{ color: "var(--cb-text-primary)" }}>{t("home.highlights")}</h2>
              <Link to="/highlights" className="text-[13px] uppercase font-semibold transition-colors hover:underline" style={{ color: "var(--cb-brand-accent)" }}>{t("home.viewAllHighlights")} &rarr;</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {highlightsData.slice(0, 3).map((item, idx) => (
                <HighlightCard key={`${item.id || item.title}-${idx}`} title={item.title} date={item.date || ""} excerpt={normalizeContentExcerpt(item)} image={normalizeContentImage(item)} mediaUrl={item.mediaUrl} category={item.category || ""} />
              ))}
            </div>
          </div>
        </section>
      ) : homeLoading ? (
        <SectionHighlightSkeleton />
      ) : null}

      {/* Sponsors */}
      {sponsors && sponsors.length > 0 && <SponsorsSection sponsors={sponsors} />}
    </Layout>
  );
}

function SectionHighlightSkeleton() {
  return (
    <section className="pb-20" style={{ background: "var(--cb-surface-muted)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden" style={{ background: "var(--cb-surface-panel)", borderRadius: 10 }}>
              <Skeleton className="h-[220px] w-full rounded-none" />
              <div className="p-5 space-y-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionSkeleton() {
  return (
    <section className="pt-10 pb-20" style={{ background: "var(--cb-surface-muted)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden" style={{ background: "var(--cb-surface-panel)", borderRadius: 10 }}>
              <Skeleton className="h-[190px] w-full rounded-none" />
              <div className="p-5 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TopScorersSection({ scorers }: { scorers: PublicTopScorer[] }) {
  const { t } = useI18n();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -230 : 230, behavior: "smooth" });
  };
  return (
    <section className="pt-20 pb-10" style={{ background: "var(--cb-surface-muted)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[32px] font-bold" style={{ color: "var(--cb-text-primary)" }}>{t("home.topScorers")}</h2>
          <div className="flex gap-2">
            <button onClick={() => scrollBy("left")} aria-label="Scroll left" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: "var(--cb-brand-primary)", color: "var(--cb-text-inverse)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cb-brand-accent)")} onMouseLeave={(e) => (e.currentTarget.style.background = "var(--cb-brand-primary)")}><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => scrollBy("right")} aria-label="Scroll right" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: "var(--cb-brand-primary)", color: "var(--cb-text-inverse)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cb-brand-accent)")} onMouseLeave={(e) => (e.currentTarget.style.background = "var(--cb-brand-primary)")}><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div ref={scrollerRef} className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <div className="flex items-stretch gap-5" style={{ width: "max-content" }}>
            {scorers.map((p, idx) => (
              <div key={`${p.playerId || p.playerName}-${idx}`} className="w-[210px] shrink-0 overflow-hidden hover:-translate-y-1 transition-transform duration-300 flex flex-col" style={{ background: "var(--cb-surface-panel)", borderRadius: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                <div className="relative aspect-[3/4] flex items-center justify-center font-extrabold" style={{ background: "linear-gradient(to bottom, var(--cb-surface-muted), var(--cb-border-subtle))", color: "var(--cb-text-secondary)", fontSize: 48 }}>
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.playerName} className="w-full h-full object-cover" /> : generateInitials(p.playerName)}
                </div>
                <div className="px-4 pt-3 pb-4">
                  <div className="flex items-center gap-1.5 font-extrabold text-[18px]" style={{ color: "var(--cb-text-primary)" }}>
                    <span aria-hidden className="text-[16px]">⚽</span>
                    <span>{p.goals}</span>
                  </div>
                  <h3 className="mt-2 text-[15px] font-extrabold leading-tight" style={{ color: "var(--cb-text-primary)" }}>{p.playerName}</h3>
                  <p className="text-[12px] mt-0.5" style={{ color: "var(--cb-text-secondary)" }}>{p.teamName || ""}</p>
                  <p className="mt-3 text-[11px] font-bold tracking-[1.5px]" style={{ color: "var(--cb-text-muted)" }}>{p.position || ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SponsorsSection({ sponsors }: { sponsors: PublicSponsor[] }) {
  const { t } = useI18n();
  return (
    <section className="py-14 border-t-4 border-b-4" style={{ background: "var(--cb-surface-panel)", borderTopColor: "var(--cb-brand-accent)", borderBottomColor: "var(--cb-brand-accent)" }}>
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <h2 className="text-[20px] font-bold tracking-[3px] uppercase" style={{ color: "var(--cb-text-primary)", textWrap: "balance" }}>{t("home.sponsors")}</h2>
        <div className="mt-8 flex items-center justify-center gap-16 flex-wrap">
          {sponsors.map((s, idx) => s.logoUrl ? <img key={`${s.id}-${idx}`} src={s.logoUrl} alt={s.name} className="h-16 object-contain" /> : null)}
        </div>
      </div>
    </section>
  );
}
