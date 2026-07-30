import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicNewsItem } from "@/hooks/use-public-api";
import { normalizeContentImage } from "@/lib/public-api";
import { useLocale } from "@/lib/locale";
import { BackLink } from "@/components/BackLink";
import { EmptyState } from "@/components/EmptyState";
import { Container } from "@/components/Container";

export const Route = createFileRoute("/news_/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `News — ${params.slug} — LigaD1` }],
  }),
  component: NewsDetail,
});

function NewsDetail() {
  const { slug } = Route.useParams();
  const { locale } = useLocale();
  const { data: item, isLoading } = usePublicNewsItem(slug, locale);

  if (isLoading) {
    return (
      <Layout>
        <Container className="max-w-[750px] py-[var(--cb-space-section)]">
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
        </Container>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <Container className="max-w-[750px] py-[var(--cb-space-section)] text-center">
          <EmptyState message="Article not found." />
          <BackLink to="/news">Back to News</BackLink>
        </Container>
      </Layout>
    );
  }

  const imageUrl = normalizeContentImage(item);

  return (
    <Layout>
      <article className="max-w-[750px] mx-auto px-[var(--cb-space-xl)] py-[var(--cb-space-section)]">
        <BackLink to="/news">Back to News</BackLink>

        {item.category && (
          <div className="text-[length:var(--cb-font-size-caption)] uppercase font-[var(--cb-font-weight-heading)] text-[var(--cb-brand-accent)] mt-[var(--cb-space-lg)] tracking-normal">
            {item.category}
          </div>
        )}

        <h1 className="text-[length:var(--cb-font-size-screen)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)] mt-[var(--cb-space-sm)] leading-tight" style={{ textWrap: "balance" }}>{item.title}</h1>

        <div className="flex items-center gap-[var(--cb-space-sm)] text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-muted)] mt-[var(--cb-space-sm)]">
          {item.date && <span>{item.date}</span>}
          {item.author && (
            <>
              <span>&middot;</span>
              <span>{item.author}</span>
            </>
          )}
        </div>

        {imageUrl && (
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full rounded-[var(--cb-radius-lg)] mt-[var(--cb-space-xl)] object-cover max-h-[460px]"
          />
        )}

        <div className="mt-[var(--cb-space-xl)] cb-body leading-[1.7] space-y-[var(--cb-space-lg)]">
          {item.bodySections?.length ? (
            item.bodySections.map((section, i) => (
              <div key={i}>
                {section.title && (
                  <h2 className="text-[length:var(--cb-font-size-title)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)] mt-[var(--cb-space-xl)] mb-[var(--cb-space-sm)]" style={{ textWrap: "balance" }}>{section.title}</h2>
                )}
                <p>{section.body}</p>
              </div>
            ))
          ) : item.body ? (
            item.body.split("\n").map((line, i) => <p key={i}>{line}</p>)
          ) : item.summary ? (
            <p>{item.summary}</p>
          ) : null}

          {item.mediaUrl && (
            <div className="mt-[var(--cb-space-lg)]">
              <a
                href={item.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--cb-brand-accent)] font-[var(--cb-font-weight-heading)] hover:underline"
              >
                {item.ctaText || "Watch Video"}
              </a>
            </div>
          )}

          {item.ctaUrl && !item.mediaUrl && (
            <div className="mt-[var(--cb-space-lg)]">
              <a
                href={item.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cb-button-primary text-[length:var(--cb-font-size-caption)]"
              >
                {item.ctaText || "Learn More"}
              </a>
            </div>
          )}

          {item.tags?.length ? (
            <div className="flex flex-wrap gap-[var(--cb-space-xs)] mt-[var(--cb-space-xl)] pt-[var(--cb-space-lg)] border-t border-[var(--cb-border-subtle)]">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[length:var(--cb-font-size-caption)] bg-[var(--cb-surface-muted)] text-[var(--cb-text-secondary)] px-[var(--cb-space-sm)] py-[var(--cb-space-xs)] rounded-full font-[var(--cb-font-weight-heading)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </Layout>
  );
}
