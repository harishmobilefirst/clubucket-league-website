import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/Layout";
import { Container } from "@/components/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicAbout } from "@/hooks/use-public-api";
import { useLocale } from "@/lib/locale";
import { useI18n, usePageTitle } from "@/lib/i18n";
import seasonHighlights from "@/assets/season-highlights.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — LigaD1" },
      {
        name: "description",
        content: "Learn about LigaD1, Mexico's premier semi-professional soccer league.",
      },
      { property: "og:title", content: "About Us — LigaD1" },
      {
        property: "og:description",
        content: "Learn about LigaD1, Mexico's premier semi-professional soccer league.",
      },
    ],
  }),
  component: About,
});

const staticSections = [
  {
    titleKey: "about.mission.title",
    bodyKey: "about.mission.body",
  },
  {
    titleKey: "about.vision.title",
    bodyKey: "about.vision.body",
  },
  {
    titleKey: "about.values.title",
    bodyKey: "about.values.body",
  },
] as const;

function About() {
  const { locale } = useLocale();
  const { t } = useI18n();
  usePageTitle("meta.about");
  const { data: about, isLoading } = usePublicAbout(locale);

  const heroTitle = about?.title || t("about.fallbackTitle");
  const heroSummary = about?.summary || t("about.fallbackSummary");
  const heroImage = about?.imageUrl || seasonHighlights;
  const sections = about?.bodySections?.length
    ? about.bodySections
    : staticSections.map((s) => ({ title: t(s.titleKey), body: t(s.bodyKey) }));

  return (
    <Layout>
      <PageHeader title={t("about.title")} subtitle={t("about.subtitle")} />

      <section className="py-20" style={{ background: "var(--cb-surface-panel)" }}>
        <Container className="grid md:grid-cols-2 gap-16 items-center">
          {isLoading ? (
            <>
              <div className="space-y-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-72" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </>
          ) : (
            <>
              <div>
                <div
                  className="text-[14px] font-extrabold uppercase tracking-[2.5px]"
                  style={{ color: "var(--cb-brand-accent)" }}
                >
                  {t("about.eyebrow", { defaultValue: "Who We Are" })}
                </div>
                <h2
                  className="text-[32px] font-bold mt-3"
                  style={{ color: "var(--cb-text-primary)" }}
                >
                  {heroTitle}
                </h2>
                <p
                  className="text-[15px] leading-[1.7] mt-5"
                  style={{ color: "var(--cb-text-secondary)" }}
                >
                  {heroSummary}
                </p>
                {about?.additionalSummary && (
                  <p
                    className="text-[15px] leading-[1.7] mt-3"
                    style={{ color: "var(--cb-text-secondary)" }}
                  >
                    {about.additionalSummary}
                  </p>
                )}
              </div>
              <div className="rounded-xl overflow-hidden">
                <img src={heroImage} alt="LigaD1" className="w-full h-full object-cover" />
              </div>
            </>
          )}
        </Container>
      </section>

      <section className="py-20" style={{ background: "var(--cb-surface-muted)" }}>
        <Container className="grid md:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="p-6 rounded-[10px]"
                  style={{ background: "var(--cb-surface-panel)" }}
                >
                  <Skeleton className="h-5 w-28 mb-3" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))
            : sections.map((s) => (
                <div
                  key={s.title}
                  className="p-6 rounded-[10px]"
                  style={{
                    background: "var(--cb-surface-panel)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  }}
                >
                  <h3
                    className="text-[18px] font-bold"
                    style={{ color: "var(--cb-brand-primary)" }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-[14px] leading-[1.7] mt-3"
                    style={{ color: "var(--cb-text-secondary)" }}
                  >
                    {s.body}
                  </p>
                </div>
              ))}
        </Container>
      </section>
    </Layout>
  );
}
