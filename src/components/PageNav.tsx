import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useI18n } from "@/lib/i18n";

export function PageNav({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const { t } = useI18n();
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-[var(--cb-space-section)]" aria-label={t("pagination.nav")}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-label={t("pagination.previous")}
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
            className={page <= 1 ? "pointer-events-none opacity-40" : "cursor-pointer transition-colors"}
          >
            {t("pagination.previousLabel")}
          </PaginationPrevious>
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <button
              onClick={() => onPageChange(p)}
              className="flex h-11 w-11 items-center justify-center font-[var(--cb-font-weight-heading)] transition-colors"
              style={{
                background: p === page ? "var(--cb-brand-primary)" : "transparent",
                color: p === page ? "var(--cb-text-inverse)" : "var(--cb-text-secondary)",
                borderRadius: "var(--cb-radius-md)",
              }}
              onMouseEnter={(e) => { if (p !== page) e.currentTarget.style.background = "var(--cb-surface-muted)"; }}
              onMouseLeave={(e) => { if (p !== page) e.currentTarget.style.background = "transparent"; }}
            >
              {p}
            </button>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            aria-label={t("pagination.next")}
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) onPageChange(page + 1);
            }}
            className={page >= totalPages ? "pointer-events-none opacity-40" : "cursor-pointer transition-colors"}
          >
            {t("pagination.nextLabel")}
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
