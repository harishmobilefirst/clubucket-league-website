import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicHighlightsItem } from "@/hooks/use-public-api";
import { normalizeContentImage } from "@/lib/public-api";
import { useI18n } from "@/lib/i18n";
import { BackLink } from "@/components/BackLink";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/highlights_/$slug")({
  head: ({ params }) => ({ meta: [{ title: `Highlights — ${params.slug}` }] }),
  component: HighlightsDetail,
});

function HighlightsDetail() {
  const { slug } = Route.useParams();
  const { locale, t } = useI18n();
  const { data: item, isLoading, error, refetch } = usePublicHighlightsItem(slug, locale);
  const [imageFailed, setImageFailed] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-[750px] mx-auto px-6 py-[var(--cb-space-section)]">
          <Skeleton className="h-4 w-24 mb-[var(--cb-space-xl)]" />
          <Skeleton className="h-8 w-full mb-[var(--cb-space-md)]" />
          <Skeleton className="h-5 w-48 mb-[var(--cb-space-xl)]" />
          <Skeleton className="h-[400px] w-full rounded-[var(--cb-radius-lg)] mb-[var(--cb-space-xl)]" />
          <div className="space-y-[var(--cb-space-md)]">
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
        <div className="max-w-[750px] mx-auto px-6 py-[var(--cb-space-section)] text-center">
          <EmptyState message={t("common.sectionCouldNotLoad")} />
          <button onClick={() => refetch()} className="mt-[var(--cb-space-sm)] text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] hover:underline transition-colors" style={{ color: "var(--cb-brand-accent)" }}>{t("common.retry")}</button>
          <div className="mt-[var(--cb-space-lg)]"><BackLink to="/highlights">{t("highlights.backToHighlights")}</BackLink></div>
        </div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="max-w-[750px] mx-auto px-6 py-[var(--cb-space-section)] text-center">
          <EmptyState message={t("highlights.notFound")} />
          <div className="mt-[var(--cb-space-lg)]"><BackLink to="/highlights">{t("highlights.backToHighlights")}</BackLink></div>
        </div>
      </Layout>
    );
  }

  const imageUrl = normalizeContentImage(item);
  const isVideo = item.mediaUrl || item.category?.toLowerCase().includes("video");

  return (
    <Layout>
      <article className="max-w-[750px] mx-auto px-6 py-[var(--cb-space-section)]">
        <BackLink to="/highlights">{t("highlights.backToHighlights")}</BackLink>

        {item.category && (<div className="text-[length:var(--cb-font-size-caption)] uppercase font-[var(--cb-font-weight-heading)] mt-[var(--cb-space-lg)] tracking-normal" style={{ color: "var(--cb-brand-accent)" }}>{item.category}</div>)}

        <h1 className="text-[length:var(--cb-font-size-screen)] font-[var(--cb-font-weight-heading)] mt-[var(--cb-space-sm)] leading-tight" style={{ color: "var(--cb-text-primary)", textWrap: "balance" }}>{item.title}</h1>

        <div className="flex items-center gap-[var(--cb-space-sm)] text-[length:var(--cb-font-size-caption)] mt-[var(--cb-space-sm)]" style={{ color: "var(--cb-text-muted)" }}>
          {item.date && <span>{item.date}</span>}
          {item.author && (<><span>&middot;</span><span>{item.author}</span></>)}
        </div>

        {isVideo && item.mediaUrl ? (
          <div className="mt-[var(--cb-space-xl)] aspect-video rounded-[var(--cb-radius-lg)] overflow-hidden" style={{ background: "var(--cb-surface-inverse)" }}>
            <iframe src={item.mediaUrl} title={item.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        ) : imageUrl && !imageFailed ? (
          <img src={imageUrl} alt={item.title} onError={() => setImageFailed(true)} className="w-full rounded-[var(--cb-radius-lg)] mt-[var(--cb-space-xl)] object-cover max-h-[460px]" />
        ) : null}

        <div className="mt-[var(--cb-space-xl)] leading-[1.7] space-y-[var(--cb-space-lg)]" style={{ color: "var(--cb-text-secondary)", fontSize: "var(--cb-font-size-body)" }}>
          {item.bodySections?.length ? (
            item.bodySections.map((section, i) => (
              <div key={i}>
                {section.title && (<h2 className="text-[length:var(--cb-font-size-title)] font-[var(--cb-font-weight-heading)] mt-[var(--cb-space-xl)] mb-[var(--cb-space-sm)]" style={{ color: "var(--cb-text-primary)", textWrap: "balance" }}>{section.title}</h2>)}
                <p>{section.body}</p>
              </div>
            ))
          ) : item.body ? (
            item.body.split("\n").map((line, i) => <p key={i}>{line}</p>)
          ) : item.summary ? (<p>{item.summary}</p>) : null}

          {item.ctaUrl && !item.mediaUrl && (
            <div className="mt-[var(--cb-space-lg)]">
              <a href={item.ctaUrl} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full px-7 py-3 text-[14px] font-bold uppercase transition-colors hover:opacity-90" style={{ background: "var(--cb-brand-accent)", color: "var(--cb-text-inverse)" }}>{item.ctaText || t("news.learnMore")}</a>
            </div>
          )}

          {item.tags?.length ? (
            <div className="flex flex-wrap gap-[var(--cb-space-xs)] mt-[var(--cb-space-xl)] pt-[var(--cb-space-lg)] border-t" style={{ borderColor: "var(--cb-border-subtle)" }}>
              {item.tags.map((tag) => (<span key={tag} className="text-[length:var(--cb-font-size-caption)] px-[var(--cb-space-sm)] py-[var(--cb-space-xs)] rounded-full font-[var(--cb-font-weight-heading)]" style={{ background: "var(--cb-surface-muted)", color: "var(--cb-text-secondary)" }}>{tag}</span>))}
            </div>
          ) : null}
        </div>
      </article>
    </Layout>
  );
}
