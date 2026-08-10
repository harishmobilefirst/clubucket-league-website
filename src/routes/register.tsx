import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Check, AlertCircle } from "lucide-react";
import { Layout, PageHeader } from "@/components/Layout";
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

const inputCls = "w-full h-10 px-3.5 text-[14px] rounded-md focus:outline-none border disabled:opacity-50";
const inputStyle = { borderColor: "var(--cb-border-subtle)" };
const labelCls = "block text-[13px] font-semibold mb-1.5";

function Register() {
  const [submitted, setSubmitted] = useState(false);
  const inquiry = useCreateInquiry();
  const { data: divisions, isLoading: divisionsLoading } = usePublicDivisions();
  const { t } = useI18n();
  usePageTitle("meta.register");

  const [form, setForm] = useState({
    teamName: "", city: "", contactName: "", contactRole: "", contactEmail: "", contactPhone: "", divisionInterestId: "", aboutTeam: "",
  });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await inquiry.mutateAsync({ ...form, divisionInterestId: form.divisionInterestId || null });
      setSubmitted(true);
    } catch { /* handled via inquiry.error */ }
  }

  return (
    <Layout>
      <PageHeader title={t("register.title")} subtitle={t("register.subtitle")} />
      <section className="py-[60px]" style={{ background: "var(--cb-surface-muted)" }}>
        <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-[3fr_2fr] gap-8">
          <div className="rounded-[10px] p-10 border" style={{ background: "var(--cb-surface-panel)", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", borderColor: "var(--cb-border-subtle)" }}>
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle2 size={40} className="mx-auto" style={{ color: "var(--cb-status-success)" }} />
                <h3 className="text-[20px] font-bold mt-4" style={{ color: "var(--cb-text-primary)" }}>{t("register.requestSubmitted")}</h3>
                <p className="text-[14px] mt-3 max-w-md mx-auto" style={{ color: "var(--cb-text-secondary)" }}>{t("register.thankYou")}</p>
                <Link to="/" className="inline-block mt-6 rounded-md px-5 py-2.5 text-[13px] font-semibold transition-colors hover:opacity-90" style={{ background: "var(--cb-brand-primary)", color: "var(--cb-text-inverse)" }}>{t("register.backHome")}</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="text-[20px] font-bold" style={{ color: "var(--cb-text-primary)", textWrap: "balance" }}>{t("register.formTitle")}</h2>
                <p className="text-[14px] mt-2" style={{ color: "var(--cb-text-secondary)" }}>{t("register.formIntro")}</p>

                {inquiry.error && (
                  <div className="mt-5 flex items-start gap-2 border rounded-md px-3.5 py-2.5" style={{ background: "rgba(220,38,38,0.08)", borderColor: "var(--cb-status-danger)" }}>
                    <AlertCircle size={16} className="shrink-0 mt-0.5" style={{ color: "var(--cb-status-danger)" }} />
                    <p className="text-[13px]" style={{ color: "var(--cb-status-danger)" }}>{inquiry.error instanceof Error ? inquiry.error.message : t("register.genericError")}</p>
                  </div>
                )}

                <div className="mt-7 space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: "var(--cb-text-primary)" }}>{t("register.teamName")}</label>
                      <input className={inputCls} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "var(--cb-text-primary)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "var(--cb-border-subtle)"; }} value={form.teamName} onChange={set("teamName")} required disabled={inquiry.isPending} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: "var(--cb-text-primary)" }}>{t("register.city")}</label>
                      <input className={inputCls} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "var(--cb-text-primary)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "var(--cb-border-subtle)"; }} value={form.city} onChange={set("city")} required disabled={inquiry.isPending} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: "var(--cb-text-primary)" }}>{t("register.contactName")}</label>
                      <input className={inputCls} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "var(--cb-text-primary)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "var(--cb-border-subtle)"; }} value={form.contactName} onChange={set("contactName")} required disabled={inquiry.isPending} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: "var(--cb-text-primary)" }}>{t("register.contactRole")}</label>
                      <input className={inputCls} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "var(--cb-text-primary)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "var(--cb-border-subtle)"; }} value={form.contactRole} onChange={set("contactRole")} placeholder={t("register.contactRolePlaceholder")} disabled={inquiry.isPending} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls} style={{ color: "var(--cb-text-primary)" }}>{t("register.email")}</label>
                      <input type="email" className={inputCls} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "var(--cb-text-primary)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "var(--cb-border-subtle)"; }} value={form.contactEmail} onChange={set("contactEmail")} required disabled={inquiry.isPending} />
                    </div>
                    <div>
                      <label className={labelCls} style={{ color: "var(--cb-text-primary)" }}>{t("register.phone")}</label>
                      <input className={inputCls} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "var(--cb-text-primary)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "var(--cb-border-subtle)"; }} value={form.contactPhone} onChange={set("contactPhone")} required disabled={inquiry.isPending} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls} style={{ color: "var(--cb-text-primary)" }}>{t("register.divisionInterest")}</label>
                    <select className={inputCls} style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "var(--cb-text-primary)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "var(--cb-border-subtle)"; }} value={form.divisionInterestId} onChange={set("divisionInterestId")} disabled={inquiry.isPending || divisionsLoading}>
                      <option value="">{divisionsLoading ? t("register.loadingDivisions") : t("register.noPreference")}</option>
                      {divisions?.map((division) => (<option key={division.id} value={division.id}>{division.name}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls} style={{ color: "var(--cb-text-primary)" }}>{t("register.aboutTeam")}</label>
                    <textarea rows={4} className="w-full px-3.5 py-2.5 text-[14px] border rounded-md focus:outline-none disabled:opacity-50" style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = "var(--cb-text-primary)"; }} onBlur={(e) => { e.currentTarget.style.borderColor = "var(--cb-border-subtle)"; }} value={form.aboutTeam} onChange={set("aboutTeam")} placeholder={t("register.aboutTeamPlaceholder")} disabled={inquiry.isPending} />
                  </div>
                </div>

                <button type="submit" disabled={inquiry.isPending} className="w-full mt-7 text-white rounded-full py-3 text-[15px] font-bold uppercase disabled:opacity-50 transition-colors hover:opacity-90" style={{ background: "var(--cb-brand-accent)" }}>{inquiry.isPending ? t("register.submitting") : t("register.submit")}</button>
                <p className="text-[11px] text-center mt-3" style={{ color: "var(--cb-text-muted)" }}>{t("register.consent")}</p>
              </form>
            )}
          </div>

          <aside className="rounded-[10px] p-8 h-fit" style={{ background: "var(--cb-brand-primary)" }}>
            <h3 className="text-[18px] font-bold" style={{ color: "var(--cb-text-inverse)", textWrap: "balance" }}>{t("register.whyJoin")}</h3>
            <ul className="mt-5 space-y-4">
              {[t("register.benefit1"), t("register.benefit2"), t("register.benefit3")].map((text) => (
                <li key={text} className="flex gap-3">
                  <Check size={16} className="shrink-0 mt-0.5" style={{ color: "var(--cb-brand-accent)" }} />
                  <span className="text-[14px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.85)" }}>{text}</span>
                </li>
              ))}
            </ul>
            <div className="h-px my-6" style={{ background: "rgba(255,255,255,0.1)" }} />
            <p className="text-[14px] font-semibold" style={{ color: "var(--cb-text-inverse)" }}>{t("register.haveQuestions")}</p>
            <p className="text-[13px] mt-1" style={{ color: "var(--cb-text-muted)" }}>info@ligad1.com</p>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
