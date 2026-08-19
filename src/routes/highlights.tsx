import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout, PageHeader } from "@/components/Layout";
import { HighlightCard } from "@/components/HighlightCard";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { PageNav } from "@/components/PageNav";
import { usePublicConfig, usePublicHighlights } from "@/hooks/use-public-api";
import { contentItemSlug, normalizeContentImage, normalizeContentExcerpt } from "@/lib/public-api";
import { useI18n, usePageTitle } from "@/lib/i18n";

export const Route = createFileRoute("/highlights")({
  head: () => ({
    meta: [
      { title: "Highlights" },
      { name: "description", content: "Match highlights, top goals, and standout moments." },
      { property: "og:title", content: "Highlights" },
      { property: "og:description", content: "Match highlights, top goals, and standout moments." },
    ],
  }),
  component: Highlights,
});

function Highlights() {
  const { locale, t } = useI18n();
  const { data: config } = usePublicConfig();
  usePageTitle("meta.highlights", { orgName: config?.displayName || "Clubucket" });
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePublicHighlights(locale, page);
  const items = (data?.items ?? []).filter((h) => contentItemSlug(h));
  const totalPages = data?.meta?.totalPages ?? 1;

  useEffect(() => { setPage(1); }, [locale]);

  return (
    <Layout>
      <PageHeader title={t("highlights.title")} subtitle={t("highlights.subtitle", { orgName: config?.displayName || "Clubucket" })} />
      <section className="py-[60px]" style={{ background: "var(--cb-surface-muted)" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-[10px] overflow-hidden" style={{ background: "var(--cb-surface-panel)", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                  <Skeleton className="h-[220px] w-full rounded-none" />
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
            <EmptyState message={t("highlights.empty")} />
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                {items.map((h, idx) => (
                  <HighlightLinkWrapper key={`${h.id}-${idx}`} to="/highlights_/$slug" params={{ slug: contentItemSlug(h) }}>
                    <HighlightCard title={h.title} date={h.date || ""} excerpt={normalizeContentExcerpt(h)} image={normalizeContentImage(h)} mediaUrl={h.mediaUrl} category={h.category || ""} />
                  </HighlightLinkWrapper>
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

function HighlightLinkWrapper({ to, params, children }: { to: string; params: Record<string, string>; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={to} params={params} className="block h-full rounded-[10px] transition-all duration-200" style={{ transform: hovered ? "translateY(-2px)" : "translateY(0)", boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.07)" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {children}
    </Link>
  );
}
