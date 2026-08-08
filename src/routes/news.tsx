import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout, PageHeader } from "@/components/Layout";
import { NewsCard } from "@/components/NewsCard";
import { Section } from "@/components/Section";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { PageNav } from "@/components/PageNav";
import { usePublicNews } from "@/hooks/use-public-api";
import { contentItemSlug, normalizeContentImage, normalizeContentExcerpt } from "@/lib/public-api";
import { useI18n, usePageTitle } from "@/lib/i18n";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Updates — LigaD1" },
      { name: "description", content: "Latest news, match reports, and updates from LigaD1." },
    ],
  }),
  component: News,
});

function News() {
  const { locale, t } = useI18n();
  usePageTitle("meta.news");
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePublicNews(locale, page);
  const items = (data?.items ?? []).filter((n) => contentItemSlug(n));
  const totalPages = data?.meta?.totalPages ?? 1;

  useEffect(() => {
    setPage(1);
  }, [locale]);

  return (
    <Layout>
      <PageHeader title={t("news.title")} subtitle={t("news.subtitle")} />
      <Section muted>
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-[var(--cb-space-xl)]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-md)] overflow-hidden cb-shadow-panel"
              >
                <Skeleton className="h-[190px] w-full rounded-none" />
                <div className="p-[var(--cb-space-lg)] space-y-[var(--cb-space-md)]">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-[var(--cb-space-section)]">
            <p className="cb-body">{t("common.sectionError")}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-[var(--cb-space-sm)] text-[length:var(--cb-font-size-caption)] text-[var(--cb-brand-accent)] font-[var(--cb-font-weight-heading)] hover:underline cb-focus"
            >
              {t("common.retry")}
            </button>
          </div>
        ) : items.length === 0 ? (
          <EmptyState message={t("news.empty")} />
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-[var(--cb-space-xl)]">
              {items.map((n, idx) => (
                <Link
                  key={`${n.id}-${idx}`}
                  to="/news/$slug"
                  params={{ slug: contentItemSlug(n) }}
                  className="block h-full"
                >
                  <NewsCard
                    category={n.category || ""}
                    title={n.title}
                    date={n.date || ""}
                    excerpt={normalizeContentExcerpt(n)}
                    image={normalizeContentImage(n)}
                  />
                </Link>
              ))}
            </div>
            <PageNav page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </Section>
    </Layout>
  );
}
