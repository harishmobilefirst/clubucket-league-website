import { useEffect, useState } from "react";
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
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  return (
    <article className="overflow-hidden group h-full flex flex-col" style={{ background: "var(--cb-surface-panel)", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      {image && !imageFailed ? (
        <div className="relative h-[220px] shrink-0 overflow-hidden">
          <img src={image} alt={title} loading="lazy" width={800} height={512} onError={() => setImageFailed(true)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {mediaUrl && (
            <div className="absolute inset-0 flex items-center justify-center transition-colors" style={{ background: "rgba(0,0,0,0.30)" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ background: "var(--cb-brand-accent)", color: "var(--cb-text-inverse)" }}>
                <Play size={20} className="ml-0.5" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[220px] shrink-0 flex items-center justify-center text-[13px]" style={{ background: "var(--cb-surface-muted)", color: "var(--cb-text-muted)" }}>
          Highlight
        </div>
      )}
      <div className="p-5 flex-1 min-w-0">
        {category && (
          <div className="text-[11px] uppercase font-bold truncate" style={{ color: "var(--cb-brand-accent)" }}>
            {category}
          </div>
        )}
        <h3 className={("text-[16px] font-bold line-clamp-2" + (category ? " mt-2" : ""))} style={{ color: "var(--cb-text-primary)", textWrap: "balance" }}>
          {title}
        </h3>
        {date && (
          <div className="text-[12px] mt-1.5 truncate" style={{ color: "var(--cb-text-muted)" }}>
            {date}
          </div>
        )}
        {excerpt && (
          <p className="text-[13px] mt-2 line-clamp-2" style={{ color: "var(--cb-text-secondary)" }}>
            {excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
