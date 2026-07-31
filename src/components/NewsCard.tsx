import { useEffect, useState } from "react";

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

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  return (
    <article className="cb-card cb-shadow-panel overflow-hidden">
      {image && !imageFailed ? (
        <img
          src={image}
          alt={title}
          loading="lazy"
          width={800}
          height={512}
          onError={() => setImageFailed(true)}
          className="w-full h-[190px] object-cover"
        />
      ) : (
        <div className="h-[190px] cb-card-muted flex items-center justify-center cb-caption">
          Match Photo
        </div>
      )}
      <div className="p-[var(--cb-space-lg)]">
        {category && <div className="cb-eyebrow">{category}</div>}
        <h3 className={"cb-title line-clamp-2" + (category ? " mt-[var(--cb-space-sm)]" : "")}>
          {title}
        </h3>
        {date && <div className="cb-caption mt-[var(--cb-space-xs)]">{date}</div>}
        {excerpt && <p className="cb-body mt-[var(--cb-space-sm)] line-clamp-2">{excerpt}</p>}
      </div>
    </article>
  );
}
