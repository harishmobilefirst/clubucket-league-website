import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout, PageHeader } from "@/components/Layout";
import { NewsCard } from "@/components/NewsCard";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { PageNav } from "@/components/PageNav";
import { usePublicConfig, usePublicNews } from "@/hooks/use-public-api";
import { contentItemSlug, normalizeContentImage, normalizeContentExcerpt } from "@/lib/public-api";
import { useI18n, usePageTitle } from "@/lib/i18n";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Updates — Clubucket" },
      { name: "description", content: "Latest news, match reports, and updates." },
    ],
  }),
  component: News,
});

function News() {
  const { locale, t } = useI18n();
  const { data: config } = usePublicConfig();
  usePageTitle("meta.news", { orgName: config?.displayName || "Clubucket" });
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePublicNews(locale, page);
  const items = (data?.items ?? []).filter((n) => contentItemSlug(n));
  const totalPages = data?.meta?.totalPages ?? 1;

  useEffect(() => { setPage(1); }, [locale]);

  return (
    <Layout>
      <PageHeader title={t("news.title")} subtitle={t("news.subtitle", { orgName: config?.displayName || "Clubucket" })} />
      <section className="py-[60px]" style={{ background: "var(--cb-surface-muted)" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-[10px] overflow-hidden" style={{ background: "var(--cb-surface-panel)", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                  <Skeleton className="h-[190px] w-full rounded-none" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-[60px]">
              <p className="text-[15px] leading-[1.7]" style={{ color: "var(--cb-text-secondary)" }}>{t("common.sectionError")}</p>
              <button onClick={() => window.location.reload()} className="mt-3 text-[14px] font-bold hover:underline transition-colors" style={{ color: "var(--cb-brand-accent)" }}>{t("common.retry")}</button>
            </div>
          ) : items.length === 0 ? (
            <EmptyState message={t("news.empty")} />
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                {items.map((n, idx) => (
                  <NewsLinkWrapper key={`${n.id}-${idx}`} to="/news/$slug" params={{ slug: contentItemSlug(n) }}>
                    <NewsCard category={n.category || ""} title={n.title} date={n.date || ""} excerpt={normalizeContentExcerpt(n)} image={normalizeContentImage(n)} />
                  </NewsLinkWrapper>
                ))}
              </div>
              <div className="mt-[60px]">
                <PageNav page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}

function NewsLinkWrapper({ to, params, children }: { to: string; params: Record<string, string>; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={to} params={params} className="block h-full rounded-[10px] transition-all duration-200" style={{ transform: hovered ? "translateY(-2px)" : "translateY(0)", boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.07)" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {children}
    </Link>
  );
}
