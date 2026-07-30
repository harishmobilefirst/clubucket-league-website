import { Play } from "lucide-react";

export function HighlightCard({
  title,
  date,
  excerpt,
  image,
  mediaUrl,
  category,
}: {
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  mediaUrl?: string;
  category?: string;
}) {
  return (
    <article className="cb-card cb-shadow-panel overflow-hidden group">
      {image ? (
        <div className="relative h-[220px] overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            width={800}
            height={512}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {mediaUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--cb-surface-inverse)]/30 group-hover:bg-[var(--cb-surface-inverse)]/40 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[var(--cb-brand-accent)] text-[var(--cb-text-inverse)] flex items-center justify-center shadow-lg">
                <Play size={20} className="ml-0.5" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[220px] cb-card-muted flex items-center justify-center cb-caption">
          Highlight
        </div>
      )}
      <div className="p-[var(--cb-space-lg)]">
        {category && <div className="cb-eyebrow">{category}</div>}
        <h3 className="cb-title mt-[var(--cb-space-sm)] line-clamp-2">{title}</h3>
        <div className="cb-caption mt-[var(--cb-space-xs)]">{date}</div>
        <p className="cb-body mt-[var(--cb-space-sm)] line-clamp-2">{excerpt}</p>
      </div>
    </article>
  );
}