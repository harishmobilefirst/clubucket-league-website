import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Check, AlertCircle } from "lucide-react";
import { Layout, PageHeader } from "@/components/Layout";
import { Section } from "@/components/Section";
import { useI18n, usePageTitle } from "@/lib/i18n";
import { useCreateInquiry, usePublicDivisions } from "@/hooks/use-public-api";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "New Team Membership — LigaD1" },
      { name: "description", content: "Submit a request to join LigaD1." },
    ],
  }),
  component: Register,
});

const inputCls =
  "w-full h-10 px-[var(--cb-space-md)] text-[length:var(--cb-font-size-body)] border border-[var(--cb-border-subtle)] rounded-[var(--cb-radius-md)] focus:outline-none focus:border-[var(--cb-text-primary)] disabled:opacity-50";
const labelCls =
  "block text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)] mb-[var(--cb-space-2xs)]";

function Register() {
  const [submitted, setSubmitted] = useState(false);
  const inquiry = useCreateInquiry();
  const { data: divisions, isLoading: divisionsLoading } = usePublicDivisions();
  const { t } = useI18n();
  usePageTitle("meta.register");

  const [form, setForm] = useState({
    teamName: "",
    city: "",
    contactName: "",
    contactRole: "",
    contactEmail: "",
    contactPhone: "",
    divisionInterestId: "",
    aboutTeam: "",
  });

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await inquiry.mutateAsync({
        ...form,
        divisionInterestId: form.divisionInterestId || null,
      });
      setSubmitted(true);
    } catch {
      // error state handled via inquiry.error
    }
  }

  return (
    <Layout>
      <PageHeader title={t("register.title")} subtitle={t("register.subtitle")} />
      <Section muted containerClassName="grid lg:grid-cols-[3fr_2fr] gap-[var(--cb-space-xl)]">
        <div className="bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-md)] p-[var(--cb-space-48)] border border-[var(--cb-border-subtle)]">
          {submitted ? (
            <div className="text-center py-[var(--cb-space-section)]">
              <CheckCircle2 size={40} className="text-[var(--cb-status-success)] mx-auto" />
              <h3
                className="text-[length:var(--cb-font-size-title)] font-[var(--cb-font-weight-heading)] mt-[var(--cb-space-md)]"
                style={{ textWrap: "balance" }}
              >
                {t("register.requestSubmitted")}
              </h3>
              <p className="text-[length:var(--cb-font-size-body)] text-[var(--cb-text-secondary)] mt-[var(--cb-space-sm)] max-w-md mx-auto">
                {t("register.thankYou")}
              </p>
              <Link to="/" className="inline-block mt-[var(--cb-space-lg)] cb-button-secondary">
                {t("register.backHome")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="cb-title" style={{ textWrap: "balance" }}>
                {t("register.formTitle")}
              </h2>
              <p className="cb-body mt-[var(--cb-space-xs)]">{t("register.formIntro")}</p>

              {inquiry.error && (
                <div className="mt-[var(--cb-space-lg)] flex items-start gap-[var(--cb-space-sm)] bg-[color-mix(in_srgb,var(--cb-status-danger),transparent_86%)] border border-[var(--cb-status-danger)] rounded-[var(--cb-radius-md)] px-[var(--cb-space-md)] py-[var(--cb-space-sm)]">
                  <AlertCircle
                    size={16}
                    className="text-[var(--cb-status-danger)] shrink-0 mt-[var(--cb-space-2xs)]"
                  />
                  <p className="text-[length:var(--cb-font-size-caption)] text-[var(--cb-status-danger)]">
                    {inquiry.error instanceof Error
                      ? inquiry.error.message
                      : t("register.genericError")}
                  </p>
                </div>
              )}

              <div className="mt-[var(--cb-space-xl)] space-y-[var(--cb-space-lg)]">
                <div className="grid md:grid-cols-2 gap-[var(--cb-space-lg)]">
                  <div>
                    <label className={labelCls}>{t("register.teamName")}</label>
                    <input
                      className={inputCls}
                      value={form.teamName}
                      onChange={set("teamName")}
                      required
                      disabled={inquiry.isPending}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{t("register.city")}</label>
                    <input
                      className={inputCls}
                      value={form.city}
                      onChange={set("city")}
                      required
                      disabled={inquiry.isPending}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-[var(--cb-space-lg)]">
                  <div>
                    <label className={labelCls}>{t("register.contactName")}</label>
                    <input
                      className={inputCls}
                      value={form.contactName}
                      onChange={set("contactName")}
                      required
                      disabled={inquiry.isPending}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{t("register.contactRole")}</label>
                    <input
                      className={inputCls}
                      value={form.contactRole}
                      onChange={set("contactRole")}
                      placeholder={t("register.contactRolePlaceholder")}
                      disabled={inquiry.isPending}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-[var(--cb-space-lg)]">
                  <div>
                    <label className={labelCls}>{t("register.email")}</label>
                    <input
                      type="email"
                      className={inputCls}
                      value={form.contactEmail}
                      onChange={set("contactEmail")}
                      required
                      disabled={inquiry.isPending}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{t("register.phone")}</label>
                    <input
                      className={inputCls}
                      value={form.contactPhone}
                      onChange={set("contactPhone")}
                      required
                      disabled={inquiry.isPending}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>{t("register.divisionInterest")}</label>
                  <select
                    className={inputCls}
                    value={form.divisionInterestId}
                    onChange={set("divisionInterestId")}
                    disabled={inquiry.isPending || divisionsLoading}
                  >
                    <option value="">
                      {divisionsLoading
                        ? t("register.loadingDivisions")
                        : t("register.noPreference")}
                    </option>
                    {divisions?.map((division) => (
                      <option key={division.id} value={division.id}>
                        {division.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("register.aboutTeam")}</label>
                  <textarea
                    rows={4}
                    className="w-full px-[var(--cb-space-md)] py-[var(--cb-space-sm)] text-[length:var(--cb-font-size-body)] border border-[var(--cb-border-subtle)] rounded-[var(--cb-radius-md)] focus:outline-none focus:border-[var(--cb-text-primary)] disabled:opacity-50"
                    value={form.aboutTeam}
                    onChange={set("aboutTeam")}
                    placeholder={t("register.aboutTeamPlaceholder")}
                    disabled={inquiry.isPending}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={inquiry.isPending}
                className="w-full mt-[var(--cb-space-xl)] cb-button-primary cb-focus disabled:opacity-50"
              >
                {inquiry.isPending ? t("register.submitting") : t("register.submit")}
              </button>
              <p className="text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-muted)] text-center mt-[var(--cb-space-sm)]">
                {t("register.consent")}
              </p>
            </form>
          )}
        </div>

        <aside className="bg-[var(--cb-brand-primary)] rounded-[var(--cb-radius-md)] p-[var(--cb-space-xl)] text-[var(--cb-text-inverse)] h-fit">
          <h3
            className="text-[length:var(--cb-font-size-title)] font-[var(--cb-font-weight-heading)]"
            style={{ textWrap: "balance" }}
          >
            {t("register.whyJoin")}
          </h3>
          <ul className="mt-[var(--cb-space-lg)] space-y-[var(--cb-space-lg)]">
            {[t("register.benefit1"), t("register.benefit2"), t("register.benefit3")].map(
              (text) => (
                <li key={text} className="flex gap-[var(--cb-space-sm)]">
                  <Check
                    size={16}
                    className="text-[var(--cb-brand-accent)] shrink-0 mt-[var(--cb-space-2xs)]"
                  />
                  <span className="text-[length:var(--cb-font-size-body)] text-[var(--cb-text-inverse)]/85 leading-[1.7]">
                    {text}
                  </span>
                </li>
              ),
            )}
          </ul>
          <div className="h-px bg-[var(--cb-surface-panel)]/10 my-[var(--cb-space-xl)]" />
          <p className="text-[length:var(--cb-font-size-body)] font-[var(--cb-font-weight-heading)]">
            {t("register.haveQuestions")}
          </p>
          <p className="text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-muted)] mt-[var(--cb-space-xs)]">
            info@ligad1.com
          </p>
        </aside>
      </Section>
    </Layout>
  );
}
