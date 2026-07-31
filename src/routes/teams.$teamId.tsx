import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Globe } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { BackLink } from "@/components/BackLink";
import { EmptyState } from "@/components/EmptyState";
import { usePublicTeam } from "@/hooks/use-public-api";
import { generateInitials } from "@/lib/public-api";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/teams/$teamId")({
  head: () => ({ meta: [{ title: "Team Profile — LigaD1" }] }),
  component: TeamProfile,
});

function TeamProfile() {
  const { teamId } = Route.useParams();
  const { t } = useI18n();
  const { data: team, isLoading, error } = usePublicTeam(teamId);

  if (error && !isLoading) {
    return (
      <Layout>
        <div className="w-full bg-[var(--cb-brand-primary)] h-[220px] flex items-center justify-center" />
        <Section muted containerClassName="text-center">
          <EmptyState message={t("teams.notFound")} />
          <BackLink to="/divisions">{t("teams.backToDivisions")}</BackLink>
        </Section>
      </Layout>
    );
  }

  if (!team && !isLoading) throw notFound();

  const players = team?.players || [];
  const coaches = team?.coaches || [];
  const socialLinks = team?.socialLinks;

  return (
    <Layout>
      <div className="w-full bg-[var(--cb-brand-primary)] h-[220px] flex items-center justify-center">
        <div className="text-center px-[var(--cb-space-xl)]">
          {team ? (
            <>
              <div className="text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-muted)]">
                <Link to="/divisions" className="hover:text-[var(--cb-text-inverse)]">
                  {t("teams.divisions")}
                </Link>
                {team.divisionName && (
                  <>
                    <span className="text-[var(--cb-text-inverse)]/60 mx-[var(--cb-space-xs)]">
                      &rsaquo;
                    </span>
                    <span>{team.divisionName}</span>
                  </>
                )}
                <span className="text-[var(--cb-text-inverse)]/60 mx-[var(--cb-space-xs)]">
                  &rsaquo;
                </span>
                <span className="text-[var(--cb-text-inverse)]">{team.name}</span>
              </div>
              <div className="mx-auto mt-[var(--cb-space-sm)] w-[72px] h-[72px] rounded-[var(--cb-radius-lg)] flex items-center justify-center border-2 border-[var(--cb-text-inverse)] overflow-hidden">
                {team.logoUrl ? (
                  <img
                    src={team.logoUrl}
                    alt={team.name}
                    className="w-full h-full object-contain bg-[var(--cb-surface-panel)]"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--cb-surface-muted)] text-[var(--cb-text-secondary)] font-[var(--cb-font-weight-heading)] flex items-center justify-center text-[length:var(--cb-font-size-title)]">
                    {team.initials || generateInitials(team.name)}
                  </div>
                )}
              </div>
              <h1
                className="text-[var(--cb-text-inverse)] text-[length:var(--cb-font-size-screen)] font-[var(--cb-font-weight-heading)] uppercase mt-[var(--cb-space-sm)]"
                style={{ textWrap: "balance" }}
              >
                {team.name}
              </h1>
              {socialLinks && Object.keys(socialLinks).length > 0 && (
                <div className="flex items-center justify-center gap-[var(--cb-space-sm)] mt-[var(--cb-space-xs)]">
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      aria-label="Instagram"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[color-mix(in_srgb,var(--cb-text-inverse),transparent_30%)] hover:text-[var(--cb-text-inverse)] transition-colors"
                    >
                      <Instagram size={18} />
                    </a>
                  )}
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      aria-label="Facebook"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[color-mix(in_srgb,var(--cb-text-inverse),transparent_30%)] hover:text-[var(--cb-text-inverse)] transition-colors"
                    >
                      <Facebook size={18} />
                    </a>
                  )}
                  {(socialLinks.x || socialLinks.twitter) && (
                    <a
                      href={socialLinks.x || socialLinks.twitter}
                      aria-label="X (Twitter)"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[color-mix(in_srgb,var(--cb-text-inverse),transparent_30%)] hover:text-[var(--cb-text-inverse)] transition-colors"
                    >
                      <Twitter size={18} />
                    </a>
                  )}
                  {(socialLinks.website || socialLinks.other) && (
                    <a
                      href={socialLinks.website || socialLinks.other}
                      aria-label="Website"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[color-mix(in_srgb,var(--cb-text-inverse),transparent_30%)] hover:text-[var(--cb-text-inverse)] transition-colors"
                    >
                      <Globe size={18} />
                    </a>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <Skeleton className="h-4 w-48 mx-auto bg-[var(--cb-surface-panel)]/20" />
              <Skeleton className="w-[72px] h-[72px] rounded-[var(--cb-radius-lg)] mx-auto mt-[var(--cb-space-sm)] bg-[var(--cb-surface-panel)]/20" />
              <Skeleton className="h-9 w-56 mx-auto mt-[var(--cb-space-sm)] bg-[var(--cb-surface-panel)]/20" />
            </>
          )}
        </div>
      </div>

      <Section muted>
        <BackLink to="/divisions">{t("teams.backToDivisions")}</BackLink>

        <h2 className="cb-title mb-[var(--cb-space-lg)]" style={{ textWrap: "balance" }}>
          {t("teams.squad")}
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[var(--cb-space-xl)]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-lg)] overflow-hidden"
              >
                <Skeleton className="aspect-[3/4] w-full rounded-none" />
                <div className="px-[var(--cb-space-md)] pt-[var(--cb-space-sm)] pb-[var(--cb-space-md)] space-y-[var(--cb-space-sm)]">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : players.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[var(--cb-space-xl)]">
            {players.map((p, idx) => (
              <div
                key={`${p.id || p.name}-${idx}`}
                className="bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-lg)] overflow-hidden hover:-translate-y-1 transition-transform duration-300 flex flex-col"
              >
                <div className="relative aspect-[3/4] bg-gradient-to-b from-[var(--cb-surface-muted)] to-[var(--cb-border-subtle)] flex items-center justify-center text-[var(--cb-text-secondary)] font-[var(--cb-font-weight-heading)] text-[length:var(--cb-font-size-screen)]">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    generateInitials(p.name)
                  )}
                </div>
                <div className="px-[var(--cb-space-md)] pt-[var(--cb-space-sm)] pb-[var(--cb-space-md)]">
                  <div className="flex items-center gap-[var(--cb-space-xs)] text-[var(--cb-text-primary)] font-[var(--cb-font-weight-heading)] text-[length:var(--cb-font-size-title)]">
                    <span aria-hidden className="text-[length:var(--cb-font-size-body)]">
                      ⚽
                    </span>
                    <span>{p.number ?? "-"}</span>
                  </div>
                  <h3 className="mt-[var(--cb-space-xs)] text-[length:var(--cb-font-size-body)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)] leading-tight">
                    {p.name}
                  </h3>
                  <p className="text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-secondary)] mt-[var(--cb-space-2xs)]">
                    {team?.name || ""}
                  </p>
                  <p className="mt-[var(--cb-space-sm)] text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-muted)] tracking-normal">
                    {(p.position || "").toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message={t("teams.noPlayers")} />
        )}

        <h2
          className="text-[length:var(--cb-font-size-title)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)] mb-[var(--cb-space-lg)] mt-[var(--cb-space-section)]"
          style={{ textWrap: "balance" }}
        >
          {t("teams.coaches")}
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[var(--cb-space-xl)]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-lg)] overflow-hidden"
              >
                <Skeleton className="aspect-[3/4] w-full rounded-none" />
                <div className="px-[var(--cb-space-md)] pt-[var(--cb-space-sm)] pb-[var(--cb-space-md)] space-y-[var(--cb-space-sm)]">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : coaches.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[var(--cb-space-xl)]">
            {coaches.map((c, idx) => (
              <div
                key={`${c.id || c.name}-${idx}`}
                className="bg-[var(--cb-surface-panel)] rounded-[var(--cb-radius-lg)] overflow-hidden hover:-translate-y-1 transition-transform duration-300 flex flex-col"
              >
                <div className="relative aspect-[3/4] bg-gradient-to-b from-[var(--cb-brand-secondary)] to-[var(--cb-brand-primary)] flex items-center justify-center text-[var(--cb-text-inverse)] font-[var(--cb-font-weight-heading)] text-[length:var(--cb-font-size-screen)]">
                  {c.imageUrl ? (
                    <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    generateInitials(c.name)
                  )}
                </div>
                <div className="px-[var(--cb-space-md)] pt-[var(--cb-space-sm)] pb-[var(--cb-space-md)]">
                  <h3 className="text-[length:var(--cb-font-size-body)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-primary)] leading-tight">
                    {c.name}
                  </h3>
                  <p className="text-[length:var(--cb-font-size-caption)] text-[var(--cb-text-secondary)] mt-[var(--cb-space-2xs)]">
                    {team?.name || ""}
                  </p>
                  <p className="mt-[var(--cb-space-sm)] text-[length:var(--cb-font-size-caption)] font-[var(--cb-font-weight-heading)] text-[var(--cb-text-muted)] tracking-normal uppercase">
                    {c.role || ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message={t("teams.noCoaches")} />
        )}
      </Section>
    </Layout>
  );
}
