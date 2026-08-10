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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center px-6" style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(8px)" }}>
      <div className="rounded-2xl p-10 max-w-[340px] w-full text-center shadow-2xl" style={{ background: "var(--cb-surface-panel)" }}>
        <div className="w-20 h-20 rounded-full text-[var(--cb-text-inverse)] text-[length:var(--cb-font-size-title)] font-[var(--cb-font-weight-heading)] flex items-center justify-center mx-auto" style={{ background: "var(--cb-brand-accent)" }}>
          L1
        </div>
        <h3 className="text-[17px] font-bold mt-5" style={{ color: "var(--cb-text-primary)" }}>{t("appPrompt.title")}</h3>
        <p className="text-[14px] mt-3" style={{ color: "var(--cb-text-secondary)" }}>{t("appPrompt.subtitle")}</p>
        <a href={appDestinationUrl} target="_blank" rel="noopener noreferrer" className="w-full mt-7 rounded-full py-3 text-[14px] font-bold uppercase inline-block transition-colors hover:opacity-90" style={{ background: "var(--cb-brand-accent)", color: "var(--cb-text-inverse)" }}>
          {t("appPrompt.getApp", { league: leagueName })}
        </a>
        <button onClick={dismiss} className="block mt-4 text-[13px] hover:underline mx-auto" style={{ color: "var(--cb-text-secondary)" }}>
          {t("appPrompt.continue")}
        </button>
      </div>
    </div>
  );
}
