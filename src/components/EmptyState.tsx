import { useI18n } from "@/lib/i18n";

export function EmptyState({ message, className }: { message?: string; className?: string }) {
  const { t } = useI18n();
  return (
    <div className={`flex flex-col items-center justify-center py-[var(--cb-space-section)] text-center ${className || ""}`}>
      <p className="text-[length:var(--cb-font-size-body)]" style={{ color: "var(--cb-text-secondary)" }}>{message ?? t("common.noItems")}</p>
    </div>
  );
}
