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
    <article className="cb-card cb-shadow-panel overflow-hidden h-full flex flex-col">
      {image && !imageFailed ? (
        <img
          src={image}
          alt={title || ""}
          loading="lazy"
          width={800}
          height={512}
          onError={() => setImageFailed(true)}
          className="w-full h-[190px] shrink-0 object-cover"
        />
      ) : (
        <div className="h-[190px] shrink-0 cb-card-muted flex items-center justify-center cb-caption">
          {t("cards.matchPhoto")}
        </div>
      )}
      <div className="p-[var(--cb-space-lg)] flex-1 min-w-0">
        {category && <div className="cb-eyebrow truncate">{category}</div>}
        <h3 className={"cb-title line-clamp-2" + (category ? " mt-[var(--cb-space-sm)]" : "")}>
          {title}
        </h3>
        {date && <div className="cb-caption mt-[var(--cb-space-xs)] truncate">{date}</div>}
        {excerpt && <p className="cb-body mt-[var(--cb-space-sm)] line-clamp-2">{excerpt}</p>}
      </div>
    </article>
  );
}
