import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function EmptyState({ message, className }: { message?: string; className?: string }) {
  const { t } = useI18n();
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-[var(--cb-space-section)] text-center",
        className,
      )}
    >
      <p className="cb-body">{message ?? t("common.noItems")}</p>
    </div>
  );
}
