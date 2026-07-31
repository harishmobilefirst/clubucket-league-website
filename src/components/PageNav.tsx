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
            className={
              page <= 1
                ? "pointer-events-none opacity-40"
                : "cursor-pointer transition-colors cb-focus"
            }
          >
            {t("pagination.previousLabel")}
          </PaginationPrevious>
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <button
              onClick={() => onPageChange(p)}
              className={
                "flex h-11 w-11 items-center justify-center font-[var(--cb-font-weight-heading)] cb-pill transition-colors cb-focus " +
                (p === page
                  ? "bg-[var(--cb-brand-primary)] text-[var(--cb-text-inverse)]"
                  : "text-[var(--cb-text-secondary)] hover:bg-[var(--cb-surface-muted)]")
              }
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
            className={
              page >= totalPages
                ? "pointer-events-none opacity-40"
                : "cursor-pointer transition-colors cb-focus"
            }
          >
            {t("pagination.nextLabel")}
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
