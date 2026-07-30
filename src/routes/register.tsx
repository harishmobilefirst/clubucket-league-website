import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Check, AlertCircle } from "lucide-react";
import { Layout, PageHeader } from "@/components/Layout";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
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
      <PageHeader title="New Team Membership" subtitle="Submit a request to join LigaD1." />
      <Section muted containerClassName="grid lg:grid-cols-[3fr_2fr] gap-[var(--cb-space-xl)]">
          <div className="bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-md)] p-[var(--cb-space-48)] border border-[var(--cb-border-subtle)]">
            {submitted ? (
              <div className="text-center py-[var(--cb-space-section)]">
                <CheckCircle2 size={40} className="text-[var(--cb-status-success)] mx-auto" />
                <h3 className="text-[length:var(--cb-font-size-title)] font-[var(--cb-font-weight-heading)] mt-[var(--cb-space-md)]" style={{ textWrap: "balance" }}>
                  Request Submitted!
                </h3>
                <p className="text-[length:var(--cb-font-size-body)] text-[var(--cb-text-secondary)] mt-[var(--cb-space-sm)] max-w-md mx-auto">
                  Thank you for your interest. Our team will review your application and reach out
                  within 3–5 business days.
                </p>
                <Link
                  to="/"
                  className="inline-block mt-[var(--cb-space-lg)] cb-button-secondary"
                >
                  Back to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="cb-title" style={{ textWrap: "balance" }}>
                  Team Registration Request
                </h2>
                <p className="cb-body mt-[var(--cb-space-xs)]">
                  Fill in the details below and our team will get back to you within 3–5 business
                  days.
                </p>

                {inquiry.error && (
                  <div className="mt-[var(--cb-space-lg)] flex items-start gap-[var(--cb-space-sm)] bg-[color-mix(in_srgb,var(--cb-status-danger),transparent_86%)] border border-[var(--cb-status-danger)] rounded-[var(--cb-radius-md)] px-[var(--cb-space-md)] py-[var(--cb-space-sm)]">
                    <AlertCircle
                      size={16}
                      className="text-[var(--cb-status-danger)] shrink-0 mt-[var(--cb-space-2xs)]"
                    />
                    <p className="text-[length:var(--cb-font-size-caption)] text-[var(--cb-status-danger)]">
                      {inquiry.error instanceof Error
                        ? inquiry.error.message
                        : "Something went wrong. Please try again."}
                    </p>
                  </div>
                )}

                <div className="mt-[var(--cb-space-xl)] space-y-[var(--cb-space-lg)]">
                  <div className="grid md:grid-cols-2 gap-[var(--cb-space-lg)]">
                    <div>
                      <label className={labelCls}>Team Name *</label>
                      <input
                        className={inputCls}
                        value={form.teamName}
                        onChange={set("teamName")}
                        required
                        disabled={inquiry.isPending}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>City *</label>
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
                      <label className={labelCls}>Contact Person Full Name *</label>
                      <input
                        className={inputCls}
                        value={form.contactName}
                        onChange={set("contactName")}
                        required
                        disabled={inquiry.isPending}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Describe your Role</label>
                      <input
                        className={inputCls}
                        value={form.contactRole}
                        onChange={set("contactRole")}
                        placeholder="e.g. Team Manager"
                        disabled={inquiry.isPending}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-[var(--cb-space-lg)]">
                    <div>
                      <label className={labelCls}>Email Address *</label>
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
                      <label className={labelCls}>Phone Number *</label>
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
                    <label className={labelCls}>Division Interest</label>
                    <select
                      className={inputCls}
                      value={form.divisionInterestId}
                      onChange={set("divisionInterestId")}
                      disabled={inquiry.isPending || divisionsLoading}
                    >
                      <option value="">
                        {divisionsLoading ? "Loading divisions..." : "No Preference"}
                      </option>
                      {divisions?.map((division) => (
                        <option key={division.id} value={division.id}>
                          {division.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Tell us about your team</label>
                    <textarea
                      rows={4}
                      className="w-full px-[var(--cb-space-md)] py-[var(--cb-space-sm)] text-[length:var(--cb-font-size-body)] border border-[var(--cb-border-subtle)] rounded-[var(--cb-radius-md)] focus:outline-none focus:border-[var(--cb-text-primary)] disabled:opacity-50"
                      value={form.aboutTeam}
                      onChange={set("aboutTeam")}
                      placeholder="Share any relevant background — how long active, number of players, previous league experience..."
                      disabled={inquiry.isPending}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={inquiry.isPending}
                  className="w-full mt-[var(--cb-space-xl)] cb-button-primary cb-focus disabled:opacity-50"
                >
                  {inquiry.isPending ? "Submitting..." : "Submit Request"}
                </button>
                <p className="text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-muted)] text-center mt-[var(--cb-space-sm)]">
                  By submitting this form you agree to be contacted by LigaD1 regarding your
                  application.
                </p>
              </form>
            )}
          </div>

          <aside className="bg-[var(--cb-brand-primary)] rounded-[var(--cb-radius-md)] p-[var(--cb-space-xl)] text-[var(--cb-text-inverse)] h-fit">
            <h3 className="text-[length:var(--cb-font-size-title)] font-[var(--cb-font-weight-heading)]" style={{ textWrap: "balance" }}>
              Why Join LigaD1?
            </h3>
            <ul className="mt-[var(--cb-space-lg)] space-y-[var(--cb-space-lg)]">
              {[
                "Compete in one of Mexico's most organised semi-professional leagues",
                "Full access to LigaD1's scheduling, standings, and digital platform",
                "Exposure for your players and club to scouts and fans across the region",
              ].map((t) => (
                <li key={t} className="flex gap-[var(--cb-space-sm)]">
                  <Check
                    size={16}
                    className="text-[var(--cb-brand-accent)] shrink-0 mt-[var(--cb-space-2xs)]"
                  />
                  <span className="text-[length:var(--cb-font-size-body)] text-[var(--cb-text-inverse)]/85 leading-[1.7]">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
            <div className="h-px bg-[var(--cb-surface-panel)]/10 my-[var(--cb-space-xl)]" />
            <p className="text-[length:var(--cb-font-size-body)] font-[var(--cb-font-weight-heading)]">
              Have questions?
            </p>
            <p className="text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-muted)] mt-[var(--cb-space-xs)]">
              info@ligad1.com
            </p>
          </aside>
      </Section>
    </Layout>
  );
}
