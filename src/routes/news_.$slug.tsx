import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicNewsItem } from "@/hooks/use-public-api";
import { normalizeContentImage } from "@/lib/public-api";
import { useI18n } from "@/lib/i18n";
import { BackLink } from "@/components/BackLink";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/news_/$slug")({
  head: ({ params }) => ({ meta: [{ title: `News — ${params.slug} — Clubucket` }] }),
  component: NewsDetail,
});

function NewsDetail() {
  const { slug } = Route.useParams();
  const { locale, t } = useI18n();
  const { data: item, isLoading, error, refetch } = usePublicNewsItem(slug, locale);
  const [imageFailed, setImageFailed] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-[750px] mx-auto px-6 py-[60px]">
          <Skeleton className="h-4 w-24 mb-8" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-5 w-48 mb-8" />
          <Skeleton className="h-[400px] w-full rounded-[10px] mb-8" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-[750px] mx-auto px-6 py-[60px] text-center">
          <EmptyState message={t("common.sectionCouldNotLoad")} />
          <button onClick={() => refetch()} className="mt-3 text-[14px] font-bold hover:underline transition-colors" style={{ color: "var(--cb-brand-accent)" }}>{t("common.retry")}</button>
          <div className="mt-5"><BackLink to="/news">{t("news.backToNews")}</BackLink></div>
        </div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="max-w-[750px] mx-auto px-6 py-[60px] text-center">
          <EmptyState message={t("news.notFound")} />
          <div className="mt-5"><BackLink to="/news">{t("news.backToNews")}</BackLink></div>
        </div>
      </Layout>
    );
  }

  const imageUrl = normalizeContentImage(item);

  return (
    <Layout>
      <article className="max-w-[750px] mx-auto px-6 py-[60px]" style={{ background: "var(--cb-surface-canvas)" }}>
        <BackLink to="/news">{t("news.backToNews")}</BackLink>

        {item.category && (<div className="text-[11px] uppercase font-bold mt-5 tracking-[2.5px]" style={{ color: "var(--cb-brand-accent)" }}>{item.category}</div>)}

        <h1 className={("text-[32px] font-bold leading-tight" + (item.category ? " mt-3" : " mt-5"))} style={{ color: "var(--cb-text-primary)", textWrap: "balance" }}>{item.title}</h1>

        <div className="flex items-center gap-2 text-[12px] mt-2" style={{ color: "var(--cb-text-muted)" }}>
          {item.date && <span>{item.date}</span>}
          {item.author && (<><span>&middot;</span><span>{item.author}</span></>)}
        </div>

        {imageUrl && !imageFailed ? (<img src={imageUrl} alt={item.title} onError={() => setImageFailed(true)} className="w-full rounded-[10px] mt-5 object-cover max-h-[460px]" />) : null}

        <div className="mt-5 space-y-5" style={{ color: "var(--cb-text-secondary)", fontSize: 15, lineHeight: 1.7 }}>
          {item.bodySections?.length ? (
            item.bodySections.map((section, i) => (
              <div key={i}>
                {section.title && (<h2 className="text-[20px] font-bold mt-6 mb-3" style={{ color: "var(--cb-text-primary)", textWrap: "balance" }}>{section.title}</h2>)}
                <p>{section.body}</p>
              </div>
            ))
          ) : item.body ? (
            item.body.split("\n").map((line, i) => <p key={i}>{line}</p>)
          ) : item.summary ? (<p>{item.summary}</p>) : null}

          {item.mediaUrl && (
            <div className="mt-5">
              <a href={item.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-[15px] font-bold hover:underline transition-colors" style={{ color: "var(--cb-brand-accent)" }}>{item.ctaText || t("news.watchVideo")}</a>
            </div>
          )}

          {item.tags?.length ? (
            <div className="flex flex-wrap gap-2 mt-8 pt-5" style={{ borderTop: "1px solid var(--cb-border-subtle)" }}>
              {item.tags.map((tag) => (<span key={tag} className="text-[12px] px-3 py-1.5 rounded-full font-bold" style={{ background: "var(--cb-surface-muted)", color: "var(--cb-text-secondary)" }}>{tag}</span>))}
            </div>
          ) : null}
        </div>
      </article>
    </Layout>
  );
}
