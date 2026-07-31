import { useEffect, useState } from "react";
import { usePublicConfig } from "@/hooks/use-public-api";
import { useI18n } from "@/lib/i18n";

export function MobileAppPrompt() {
  const { data: config } = usePublicConfig();
  const [show, setShow] = useState(false);
  const { t } = useI18n();

  const appDestinationUrl = config?.settings?.appDestinationUrl;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!appDestinationUrl) {
      setShow(false);
      return;
    }
    const isMobile = window.innerWidth < 768;
    const dismissed = localStorage.getItem("ligad1_app_prompt_dismissed");
    if (isMobile && !dismissed) setShow(true);
  }, [appDestinationUrl]);

  const dismiss = () => {
    localStorage.setItem("ligad1_app_prompt_dismissed", "1");
    setShow(false);
  };

  if (!show || !appDestinationUrl) return null;

  const leagueName = config?.displayName || "LigaD1";

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center px-[var(--cb-space-xl)]"
      role="dialog"
      aria-modal="true"
      aria-label={t("appPrompt.ariaLabel")}
      style={{
        background: "color-mix(in srgb, var(--cb-surface-inverse), transparent 20%)",
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") dismiss();
      }}
    >
      <div className="cb-panel cb-shadow-panel p-[var(--cb-space-48)] max-w-[340px] w-full text-center">
        <div className="w-20 h-20 rounded-full text-[var(--cb-text-inverse)] text-[length:var(--cb-font-size-title)] font-[var(--cb-font-weight-heading)] flex items-center justify-center mx-auto bg-[var(--cb-brand-accent)]">
          L1
        </div>
        <h3 className="cb-title mt-[var(--cb-space-lg)]">{t("appPrompt.title")}</h3>
        <p className="cb-body mt-[var(--cb-space-md)]">{t("appPrompt.subtitle")}</p>
        <a
          href={appDestinationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cb-button-primary w-full mt-[var(--cb-space-xl)] text-center cb-focus"
        >
          {t("appPrompt.getApp", { league: leagueName })}
        </a>
        <button
          onClick={dismiss}
          className="block mt-[var(--cb-space-lg)] cb-body hover:underline mx-auto cb-focus"
        >
          {t("appPrompt.continue")}
        </button>
      </div>
    </div>
  );
}
