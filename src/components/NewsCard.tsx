import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export function NewsCard({
  category,
  title,
  date,
  excerpt,
  image,
}: {
  category: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  return (
    <article className="overflow-hidden h-full flex flex-col" style={{ background: "var(--cb-surface-panel)", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      {image && !imageFailed ? (
        <img src={image} alt={title || ""} loading="lazy" width={800} height={512} onError={() => setImageFailed(true)} className="w-full h-[190px] shrink-0 object-cover" />
      ) : (
        <div className="h-[190px] shrink-0 flex items-center justify-center text-[13px]" style={{ background: "var(--cb-surface-muted)", color: "var(--cb-text-muted)" }}>
          {t("cards.matchPhoto")}
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
