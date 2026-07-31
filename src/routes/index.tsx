import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  generateInitials,
  getDefaultSeasonId,
  normalizeContentImage,
  normalizeContentExcerpt,
} from "@/lib/public-api";
import type { PublicFixture, PublicTopScorer, PublicSponsor } from "@/types/public-api";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LigaD1 — The Heart of Mexican Soccer" },
      {
        name: "description",
        content: "LigaD1 — Mexico's premier semi-professional soccer league.",
      },
    ],
  }),
  component: Home,
});

const fallbackSlides = [hero1, hero2, hero3];

function getCompletedMatches(
  scheduleMatches?: PublicFixture[],
  homeMatches?: PublicFixture[],
): PublicFixture[] {
  const matches = scheduleMatches?.length ? scheduleMatches : homeMatches || [];
  return matches
    .filter(
      (match) =>
        match.status === "completed" &&
        match.result?.homeScore != null &&
        match.result?.awayScore != null,
    )
    .slice(0, 8);
}

function HeroSlider({
  slides,
}: {
  slides?: {
    imageUrl?: string;
    headline?: string;
    subheadline?: string;
    ctaText?: string;
    ctaLink?: string;
  }[];
}) {
  const [current, setCurrent] = useState(0);
  const count = slides && slides.length > 0 ? slides.length : fallbackSlides.length;
  const { t } = useI18n();

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % count), 5000);
    return () => clearInterval(t);
  }, [count]);

  return (
    <section className="relative w-full h-[600px] overflow-hidden bg-[var(--cb-brand-primary)]">
      {(!slides || slides.length === 0
        ? fallbackSlides.map((src) => ({ imageUrl: src }))
        : slides
      ).map((slide, slideIdx) => (
        <div
          key={slideIdx}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: slideIdx === current ? 1 : 0,
            backgroundImage: slide.imageUrl ? `url(${slide.imageUrl})` : undefined,
            backgroundColor: slide.imageUrl ? undefined : "var(--cb-brand-primary)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, color-mix(in srgb, var(--cb-surface-inverse), transparent 35%), color-mix(in srgb, var(--cb-surface-inverse), transparent 75%))",
            }}
          />
        </div>
      ))}
      <div className="relative z-10 h-full flex items-center justify-center px-[var(--cb-space-xl)]">
        <div className="text-center max-w-3xl">
          {slides && slides[current]?.headline ? (
            <>
              <h1
                className="text-[var(--cb-text-inverse)] text-[length:var(--cb-font-size-screen)] font-[var(--cb-font-weight-heading)] uppercase leading-[1.05]"
                style={{ textWrap: "balance" }}
              >
                {slides[current].headline}
              </h1>
              {slides[current].subheadline && (
                <p className="text-[color-mix(in_srgb,var(--cb-text-inverse),transparent_20%)] text-[length:var(--cb-font-size-title)] mt-[var(--cb-space-lg)]">
                  {slides[current].subheadline}
                </p>
              )}
              {slides[current].ctaText && (
                <div className="mt-[var(--cb-space-xl)]">
                  <Link
                    to={slides[current].ctaLink || "/schedule"}
                    className="inline-block cb-button-primary"
                  >
                    {slides[current].ctaText}
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <h1
                className="text-[var(--cb-text-inverse)] text-[length:var(--cb-font-size-screen)] font-[var(--cb-font-weight-heading)] uppercase leading-[1.05]"
                style={{ textWrap: "balance" }}
              >
                {t("home.heroTitle")}
              </h1>
              <p className="text-[color-mix(in_srgb,var(--cb-text-inverse),transparent_20%)] text-[length:var(--cb-font-size-title)] mt-[var(--cb-space-lg)]">
                LigaD1
              </p>
              <div className="mt-[var(--cb-space-xl)]">
                <Link to="/schedule" className="inline-block cb-button-primary">
                  {t("home.heroCta")}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      {count > 1 && (
        <>
          <button
            onClick={() => setCurrent((current - 1 + count) % count)}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[var(--cb-surface-inverse)]/60 text-[var(--cb-text-inverse)] flex items-center justify-center hover:bg-[var(--cb-surface-inverse)]/40 cb-focus"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => setCurrent((current + 1) % count)}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[var(--cb-surface-inverse)]/60 text-[var(--cb-text-inverse)] flex items-center justify-center hover:bg-[var(--cb-surface-inverse)]/40 cb-focus"
          >
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-[var(--cb-space-xs)]">
            {Array.from({ length: count }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrent(dotIdx)}
                className="w-3 h-3 rounded-full cb-focus"
                style={{
                  background:
                    dotIdx === current
                      ? "var(--cb-text-inverse)"
                      : "color-mix(in srgb, var(--cb-text-inverse), transparent 65%)",
                }}
              />
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
  const { data: scheduleData, isLoading: scheduleLoading } = usePublicSchedule(
    seasonId,
    undefined,
    "completed",
  );
  const { data: aboutData } = usePublicAbout(locale);
  const { data: sponsorsData } = usePublicSponsors(locale);

  const apiDivisions = home?.divisions || divisionsData;
  const topScorers = home?.topScorers || topScorersData;
  const latestNews = home?.latestNews;
  const highlightsData = home?.highlights;
  const sponsors = home?.sponsors && home.sponsors.length > 0 ? home.sponsors : sponsorsData;
  const completedMatches = getCompletedMatches(scheduleData?.items, home?.recentResults);
  const tickerLoading = scheduleLoading && completedMatches.length === 0;
  const heroSlides = config?.heroImages?.length
    ? config.heroImages.map((img) => ({
        imageUrl: img,
        headline: config?.heroTitle,
        subheadline: config?.subtitle,
        ctaText: t("home.heroCta"),
        ctaLink: "/schedule",
      }))
    : home?.heroSlides;

  return (
    <Layout>
      <div>
        {tickerLoading ? (
          <div
            className="w-full py-[var(--cb-space-sm)]"
            style={{ background: "var(--cb-brand-primary)" }}
          >
            <Container>
              <div className="flex gap-[var(--cb-space-sm)]">
                <Skeleton className="h-10 w-[180px] rounded-[var(--cb-radius-md)] bg-[var(--cb-surface-panel)]/20" />
                <Skeleton className="h-10 w-[180px] rounded-[var(--cb-radius-md)] bg-[var(--cb-surface-panel)]/20" />
                <Skeleton className="h-10 w-[180px] rounded-[var(--cb-radius-md)] bg-[var(--cb-surface-panel)]/20" />
              </div>
            </Container>
          </div>
        ) : (
          <ScoreTicker results={completedMatches} />
        )}
        <HeroSlider slides={heroSlides} />
      </div>

      {homeError && (
        <Section muted containerClassName="text-center">
          <p className="cb-body">{t("common.sectionCouldNotLoad")}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-[var(--cb-space-sm)] text-[length:var(--cb-font-size-caption)] text-[var(--cb-brand-accent)] font-[var(--cb-font-weight-heading)] hover:underline cb-focus"
          >
            {t("common.retry")}
          </button>
        </Section>
      )}

      {/* About */}
      <Section muted containerClassName="grid md:grid-cols-2 gap-[var(--cb-space-xl)] items-center">
        <div>
          <h2 className="cb-heading">
            {aboutData?.title || home?.aboutContent?.title || t("home.aboutTitle")}
          </h2>
          {aboutData?.summary || home?.aboutContent?.body ? (
            <p className="cb-body mt-[var(--cb-space-lg)]">
              {aboutData?.summary || home?.aboutContent?.body}
            </p>
          ) : null}
          <Link
            to="/about"
            className="mt-[var(--cb-space-xl)] inline-block text-[var(--cb-brand-accent)] text-[length:var(--cb-font-size-body)] uppercase font-[var(--cb-font-weight-heading)] hover:underline"
          >
            {t("common.learnMore")} &rarr;
          </Link>
        </div>
        <div className="rounded-[var(--cb-radius-lg)] overflow-hidden min-h-[280px]">
          <img
            src={aboutData?.imageUrl || home?.aboutContent?.imageUrl || seasonHighlights}
            alt={aboutData?.title || t("home.aboutImgAlt")}
            width={1280}
            height={896}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </Section>

      {/* Our Divisions */}
      <Section inverse>
        <h2
          className="text-[length:var(--cb-font-size-screen)] font-[var(--cb-font-weight-heading)] uppercase tracking-normal"
          style={{ textWrap: "balance" }}
        >
          <span className="text-[var(--cb-text-inverse)]">{t("home.our")} </span>
          <span className="text-[var(--cb-brand-accent)]">{t("home.divisions")}</span>
        </h2>
        {apiDivisions && apiDivisions.length > 0 ? (
          <div className="mt-[var(--cb-space-section)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--cb-space-xl)]">
            {apiDivisions.map((div, idx) => (
              <Link
                key={`${div.id || div.name}-${idx}`}
                to="/divisions"
                className="group relative bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-md)] p-[var(--cb-space-xl)] overflow-hidden hover:-translate-y-1 transition-all duration-300 cb-shadow-panel cb-focus"
              >
                <span className="absolute top-0 left-0 h-1 w-0 bg-[var(--cb-brand-accent)] group-hover:w-full transition-all duration-300" />
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-[var(--cb-radius-md)] border-2 border-[var(--cb-brand-primary)] flex items-center justify-center bg-[var(--cb-surface-panel)]">
                    <span className="text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] text-[var(--cb-brand-primary)]">
                      {config?.displayName ? generateInitials(config.displayName) : "L1"}
                    </span>
                  </div>
                </div>
                <h3 className="mt-[var(--cb-space-lg)] text-[length:var(--cb-font-size-title)] font-[var(--cb-font-weight-heading)] uppercase tracking-normal text-[var(--cb-brand-primary)] leading-tight">
                  {div.name}
                </h3>
                <div className="mt-[var(--cb-space-lg)] flex items-center justify-between">
                  <span className="text-[length:var(--cb-font-size-caption)] uppercase font-[var(--cb-font-weight-heading)] tracking-normal text-[var(--cb-brand-accent)]">
                    {t("home.viewStandings")}
                  </span>
                  <div className="w-9 h-9 rounded-[var(--cb-radius-md)] bg-[var(--cb-brand-accent)] text-[var(--cb-text-inverse)] flex items-center justify-center group-hover:opacity-90 transition-colors">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : homeLoading ? (
          <div className="mt-[var(--cb-space-section)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--cb-space-xl)]">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-md)] p-[var(--cb-space-xl)]"
              >
                <Skeleton className="w-12 h-12 rounded-[var(--cb-radius-md)]" />
                <Skeleton className="h-7 w-3/4 mt-[var(--cb-space-lg)]" />
                <Skeleton className="h-4 w-1/3 mt-[var(--cb-space-lg)]" />
              </div>
            ))}
          </div>
        ) : null}
      </Section>

      {/* Top Scorers */}
      {topScorers && topScorers.length > 0 && <TopScorersSection scorers={topScorers} />}

      {/* News */}
      {latestNews && latestNews.length > 0 ? (
        <Section muted>
          <div className="flex items-center justify-between">
            <h2 className="cb-heading">{t("home.latestNews")}</h2>
            <Link
              to="/news"
              className="text-[length:var(--cb-font-size-caption)] uppercase font-[var(--cb-font-weight-heading)] text-[var(--cb-brand-accent)]"
            >
              {t("home.viewAllNews")} &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-[var(--cb-space-xl)] mt-[var(--cb-space-xl)]">
            {latestNews.slice(0, 3).map((item, idx) => (
              <Link
                key={`${item.id || item.title}-${idx}`}
                to="/news/$slug"
                params={{ slug: item.slug || item.id }}
              >
                <NewsCard
                  category={item.category || ""}
                  title={item.title}
                  date={item.date || ""}
                  excerpt={normalizeContentExcerpt(item)}
                  image={normalizeContentImage(item)}
                />
              </Link>
            ))}
          </div>
        </Section>
      ) : homeLoading ? (
        <SectionSkeleton />
      ) : null}

      {/* Highlights */}
      {highlightsData && highlightsData.length > 0 ? (
        <Section muted>
          <div className="flex items-center justify-between">
            <h2 className="cb-heading">{t("home.highlights")}</h2>
            <Link
              to="/highlights"
              className="text-[length:var(--cb-font-size-caption)] uppercase font-[var(--cb-font-weight-heading)] text-[var(--cb-brand-accent)]"
            >
              {t("home.viewAllHighlights")} &rarr;
            </Link>
          </div>
          <div className="mt-[var(--cb-space-xl)] grid md:grid-cols-2 gap-[var(--cb-space-xl)]">
            {highlightsData.slice(0, 3).map((item, idx) => (
              <Link
                key={`${item.id || item.title}-${idx}`}
                to="/highlights/$slug"
                params={{ slug: item.slug || item.id }}
                className={idx === 0 ? "md:col-span-2" : ""}
              >
                <HighlightCard
                  title={item.title}
                  date={item.date || ""}
                  excerpt={normalizeContentExcerpt(item)}
                  image={normalizeContentImage(item)}
                  mediaUrl={item.mediaUrl}
                  category={item.category || ""}
                />
              </Link>
            ))}
          </div>
        </Section>
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
    <Section muted>
      <Skeleton className="h-8 w-48" />
      <div className="grid md:grid-cols-2 gap-[var(--cb-space-xl)] mt-[var(--cb-space-xl)]">
        <div className="md:col-span-2 bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-md)] overflow-hidden">
          <Skeleton className="h-[220px] w-full rounded-none" />
          <div className="p-[var(--cb-space-lg)] space-y-[var(--cb-space-md)]">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-md)] overflow-hidden"
          >
            <Skeleton className="h-[220px] w-full rounded-none" />
            <div className="p-[var(--cb-space-lg)] space-y-[var(--cb-space-md)]">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function SectionSkeleton() {
  return (
    <Section muted>
      <Skeleton className="h-8 w-48" />
      <div className="grid md:grid-cols-3 gap-[var(--cb-space-xl)] mt-[var(--cb-space-xl)]">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-md)] overflow-hidden"
          >
            <Skeleton className="h-[190px] w-full rounded-none" />
            <div className="p-[var(--cb-space-lg)] space-y-[var(--cb-space-md)]">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function TopScorersSection({ scorers }: { scorers: PublicTopScorer[] }) {
  const { t } = useI18n();
  return (
    <Section muted>
      <div className="flex items-center justify-between mb-[var(--cb-space-xl)]">
        <h2 className="cb-heading">{t("home.topScorers")}</h2>
        <Link
          to="/top-scorers"
          className="text-[length:var(--cb-font-size-caption)] uppercase font-[var(--cb-font-weight-heading)] text-[var(--cb-brand-accent)]"
        >
          {t("common.viewAll")} &rarr;
        </Link>
      </div>
      <div className="relative">
        <div className="overflow-x-auto">
          <div
            className="flex items-stretch gap-[var(--cb-space-lg)]"
            style={{ width: "max-content" }}
          >
            {scorers.map((p, idx) => (
              <div
                key={`${p.playerId || p.playerName}-${idx}`}
                className="w-[210px] shrink-0 bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-lg)] overflow-hidden hover:-translate-y-1 transition-transform duration-300 flex flex-col cb-shadow-panel"
              >
                <div className="relative aspect-[3/4] bg-gradient-to-b from-[var(--cb-surface-muted)] to-[var(--cb-border-subtle)] flex items-center justify-center text-[var(--cb-text-secondary)] font-[var(--cb-font-weight-heading)] text-[length:var(--cb-font-size-screen)]">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.playerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    generateInitials(p.playerName)
                  )}
                </div>
                <div className="px-[var(--cb-space-md)] pt-[var(--cb-space-sm)] pb-[var(--cb-space-md)]">
                  <div className="flex items-center gap-[var(--cb-space-xs)] text-[var(--cb-text-primary)] font-[var(--cb-font-weight-heading)] text-[length:var(--cb-font-size-title)]">
                    <span aria-hidden className="text-[length:var(--cb-font-size-body)]">
                      ⚽
                    </span>
                    <span>{p.goals}</span>
                  </div>
                  <h3 className="mt-[var(--cb-space-xs)] text-[length:var(--cb-font-size-body)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)] leading-tight">
                    {p.playerName}
                  </h3>
                  <p className="text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-secondary)] mt-[var(--cb-space-2xs)]">
                    {p.teamName || ""}
                  </p>
                  <p className="mt-[var(--cb-space-sm)] text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-muted)] tracking-normal">
                    {p.position || ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function SponsorsSection({ sponsors }: { sponsors: PublicSponsor[] }) {
  const { t } = useI18n();
  return (
    <Section
      className="border-t-4 border-[var(--cb-brand-accent)]"
      containerClassName="text-center pb-[var(--cb-space-section)]"
    >
      <h2
        className="text-[length:var(--cb-font-size-title)] font-[var(--cb-font-weight-heading)] tracking-normal text-[var(--cb-text-primary)] uppercase"
        style={{ textWrap: "balance" }}
      >
        {t("home.sponsors")}
      </h2>
      <div className="mt-[var(--cb-space-xl)] flex items-center justify-center gap-[var(--cb-space-xl)] flex-wrap">
        {sponsors.map((s, idx) =>
          s.logoUrl ? (
            <img
              key={`${s.id}-${idx}`}
              src={s.logoUrl}
              alt={s.name}
              className="h-16 object-contain"
            />
          ) : null,
        )}
      </div>
    </Section>
  );
}
