import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHeader } from "@/components/Layout";
import { Section } from "@/components/Section";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicAbout } from "@/hooks/use-public-api";
import { useLocale } from "@/lib/locale";
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
    title: "Our Mission",
    body: "Develop the next generation of Mexican soccer talent through competitive, well-organized league play.",
  },
  {
    title: "Our Vision",
    body: "Become the most respected semi-professional league in Latin America, known for fair play and community impact.",
  },
  {
    title: "Our Values",
    body: "Passion, discipline, community, and respect — on the field and beyond.",
  },
];

function About() {
  const { locale } = useLocale();
  const { data: about, isLoading } = usePublicAbout(locale);

  const hasData = about && (about.title || about.summary || about.bodySections?.length);

  const heroTitle = about?.title || "More Than a League. A Community.";
  const heroSummary =
    about?.summary ||
    "LigaD1 is Mexico's premier semi-professional soccer league, bringing together the most competitive clubs from across the country. Founded to bridge the gap between amateur football and the professional game, LigaD1 gives talented players a real platform to grow.";
  const heroImage = about?.imageUrl || seasonHighlights;
  const sections = about?.bodySections?.length ? about.bodySections : staticSections;

  return (
    <Layout>
      <PageHeader title="About Us" subtitle="The story behind LigaD1" />

      <Section className="bg-[var(--cb-surface-panel)]" containerClassName="grid md:grid-cols-2 gap-[var(--cb-space-48)] items-center">
        {isLoading ? (
          <>
            <div className="space-y-[var(--cb-space-lg)]">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-72" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-[var(--cb-radius-lg)]" />
          </>
        ) : (
          <>
            <div>
              <h2 className="cb-heading mt-[var(--cb-space-sm)]">{heroTitle}</h2>
              <p className="cb-body mt-[var(--cb-space-lg)]">{heroSummary}</p>
            </div>
            <div className="rounded-[var(--cb-radius-lg)] overflow-hidden">
              <img src={heroImage} alt="LigaD1" className="w-full h-full object-cover" />
            </div>
          </>
        )}
      </Section>

      <Section muted containerClassName="grid md:grid-cols-3 gap-[var(--cb-space-xl)]">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-md)] p-[var(--cb-space-xl)]">
                <Skeleton className="h-5 w-28 mb-[var(--cb-space-sm)]" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))
          : sections.map((s) => (
              <div key={s.title} className="bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-md)] p-[var(--cb-space-xl)] border border-[var(--cb-border-subtle)]">
                <h3 className="cb-title text-[var(--cb-brand-primary)]" style={{ textWrap: "balance" }}>{s.title}</h3>
                <p className="cb-body mt-[var(--cb-space-sm)]">{s.body}</p>
              </div>
            ))}
      </Section>
    </Layout>
  );
}
