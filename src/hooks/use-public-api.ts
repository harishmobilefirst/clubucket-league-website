import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchPublicApi,
  fetchPublicApiWithMeta,
  postPublicApi,
  normalizeTopScorer,
  normalizeSponsor,
  normalizePublicConfig,
  normalizeContentItem,
  resolveFixtureTeams,
  resolveStandingRow,
} from "@/lib/public-api";
import { useOrganizationSlug, useInitialOrganizationConfig } from "@/lib/organization-context";
import type {
  PublicConfigRaw,
  PublicDivision,
  PublicTeamDetail,
  PublicTeamDetailRaw,
  PublicSeason,
  PublicFixtureRaw,
  PublicFixtureDetail,
  PublicFixtureDetailRaw,
  PublicStandingRow,
  PublicStandingRowRaw,
  PublicTopScorer,
  PublicTopScorerRaw,
  PublicRawTeam,
  PublicContentItem,
  PublicContentItemRaw,
  PublicSponsor,
  PublicHome,
  PublicHomeRaw,
  PublicAboutUs,
  PaginationMeta,
} from "@/types/public-api";

export const queryKeys = (slug: string) => ({
  config: ["public-config", slug] as const,
  home: (locale: string) => ["public-home", slug, locale] as const,
  divisions: ["public-divisions", slug] as const,
  team: (teamId: string) => ["public-team", slug, teamId] as const,
  seasons: ["public-seasons", slug] as const,
  schedule: (seasonId?: string, divisionId?: string, status?: string, page?: number) =>
    ["public-schedule", slug, seasonId, divisionId, status, page] as const,
  fixture: (fixtureId: string) => ["public-fixture", slug, fixtureId] as const,
  standings: (seasonId?: string, divisionId?: string) =>
    ["public-standings", slug, seasonId, divisionId] as const,
  topScorers: (seasonId?: string, divisionId?: string) =>
    ["public-top-scorers", slug, seasonId, divisionId] as const,
  topScorersPage: (seasonId?: string, divisionId?: string, page?: number) =>
    ["public-top-scorers-page", slug, seasonId, divisionId, page] as const,
  news: (locale: string, page?: number) => ["public-news", slug, locale, page] as const,
  newsItem: (itemSlug: string, locale: string) =>
    ["public-news-item", slug, itemSlug, locale] as const,
  highlights: (locale: string, page?: number) => ["public-highlights", slug, locale, page] as const,
  highlightItem: (itemSlug: string, locale: string) =>
    ["public-highlight-item", slug, itemSlug, locale] as const,
  sponsors: (locale: string) => ["public-sponsors", slug, locale] as const,
  about: (locale: string) => ["public-about", slug, locale] as const,
});

export function usePublicConfig() {
  const slug = useOrganizationSlug();
  const initialConfig = useInitialOrganizationConfig();
  return useQuery({
    queryKey: queryKeys(slug).config,
    queryFn: () => fetchPublicApi<PublicConfigRaw>(slug, "/config"),
    select: normalizePublicConfig,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    initialData: initialConfig,
  });
}

export function usePublicHome(locale: string) {
  const slug = useOrganizationSlug();
  return useQuery({
    queryKey: queryKeys(slug).home(locale),
    queryFn: () =>
      fetchPublicApi<PublicHomeRaw>(slug, "/home", {
        params: { locale },
      }),
    select: (data): PublicHome => ({
      recentResults: (data.schedule ?? []).map((f) => resolveFixtureTeams(f, data.scheduleTeams)),
      topScorers: (data.topScorers ?? []).map((s) => normalizeTopScorer(s, data.topScorersTeams)),
      latestNews: (data.news ?? []).map((n) => normalizeContentItem(n, locale)),
      highlights: (data.highlights ?? []).map((n) => normalizeContentItem(n, locale)),
      sponsors: (data.sponsors ?? []).map(normalizeSponsor),
    }),
    staleTime: 2 * 60 * 1000,
    enabled: !!locale,
  });
}

export function usePublicDivisions() {
  const slug = useOrganizationSlug();
  return useQuery({
    queryKey: queryKeys(slug).divisions,
    queryFn: () => fetchPublicApi<PublicDivision[]>(slug, "/divisions"),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicTeam(teamId: string) {
  const slug = useOrganizationSlug();
  return useQuery({
    queryKey: queryKeys(slug).team(teamId),
    queryFn: () => fetchPublicApi<PublicTeamDetailRaw>(slug, `/teams/${teamId}`),
    select: (raw): PublicTeamDetail => ({
      id: raw.id,
      name: raw.name,
      logoUrl: raw.logoUrl,
      divisionName: raw.division?.name,
      divisionId: raw.division?.id,
      players: (raw.roster || []).map((r) => ({
        id: r.id,
        name: r.fullName,
        number: r.jerseyNumber,
        position: r.position,
        imageUrl: r.imageUrl,
      })),
      coaches: [],
      socialLinks: raw.socialLinks,
    }),
    staleTime: 5 * 60 * 1000,
    enabled: !!teamId,
    retry: 1,
  });
}

export function usePublicSeasons() {
  const slug = useOrganizationSlug();
  return useQuery({
    queryKey: queryKeys(slug).seasons,
    queryFn: () => fetchPublicApi<PublicSeason[]>(slug, "/seasons"),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePublicSchedule(
  seasonId?: string,
  divisionId?: string,
  status?: string,
  page?: number,
) {
  const slug = useOrganizationSlug();
  return useQuery({
    queryKey: queryKeys(slug).schedule(seasonId, divisionId, status, page),
    queryFn: () =>
      fetchPublicApiWithMeta<PublicFixtureRaw[]>(slug, "/schedule", {
        params: { seasonId, divisionId, status, page: page ?? 1, limit: 50 },
      }),
    staleTime: 2 * 60 * 1000,
    enabled: !!seasonId,
    select: (envelope) => ({
      items: (envelope.data ?? []).map((f) => resolveFixtureTeams(f, envelope.teams)),
      meta: envelope.meta,
    }),
  });
}

export function usePublicFixture(fixtureId?: string) {
  const slug = useOrganizationSlug();
  return useQuery({
    queryKey: queryKeys(slug).fixture(fixtureId ?? ""),
    queryFn: () => fetchPublicApi<PublicFixtureDetailRaw>(slug, `/schedule/${fixtureId}`),
    select: (raw): PublicFixtureDetail => ({
      ...resolveFixtureTeams(raw, raw.teams),
      goalEvents: raw.goalEvents ?? [],
      cardEvents: raw.cardEvents ?? [],
    }),
    staleTime: 2 * 60 * 1000,
    enabled: !!fixtureId,
    retry: 1,
  });
}

export function usePublicStandings(seasonId?: string, divisionId?: string) {
  const slug = useOrganizationSlug();
  return useQuery({
    queryKey: queryKeys(slug).standings(seasonId, divisionId),
    queryFn: () =>
      fetchPublicApi<unknown>(slug, "/standings", {
        params: { seasonId, divisionId },
      }),
    staleTime: 2 * 60 * 1000,
    enabled: !!divisionId,
    select: (data): PublicStandingRow[] => {
      if (Array.isArray(data)) {
        return (data as PublicStandingRowRaw[]).map((r) => resolveStandingRow(r));
      }
      if (data && typeof data === "object") {
        const obj = data as {
          rows?: PublicStandingRowRaw[];
          data?: PublicStandingRowRaw[];
          standings?: PublicStandingRowRaw[];
          teams?: Record<string, PublicRawTeam>;
        };
        const rows = obj.rows ?? obj.data ?? obj.standings;
        if (Array.isArray(rows)) {
          return rows.map((r) => resolveStandingRow(r, obj.teams));
        }
      }
      return [];
    },
  });
}

export function usePublicTopScorers(seasonId?: string, divisionId?: string) {
  const slug = useOrganizationSlug();
  return useQuery({
    queryKey: queryKeys(slug).topScorers(seasonId, divisionId),
    queryFn: () =>
      fetchPublicApiWithMeta<PublicTopScorerRaw[]>(slug, "/top-scorers", {
        params: { seasonId, divisionId, limit: 20 },
      }),
    select: (envelope) => (envelope.data ?? []).map((s) => normalizeTopScorer(s, envelope.teams)),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePublicTopScorersPaginated(page: number, seasonId?: string, divisionId?: string) {
  const slug = useOrganizationSlug();
  return useQuery({
    queryKey: queryKeys(slug).topScorersPage(seasonId, divisionId, page),
    queryFn: () =>
      fetchPublicApiWithMeta<PublicTopScorerRaw[]>(slug, "/top-scorers", {
        params: { seasonId, divisionId, page, limit: 50 },
      }),
    select: (raw) => ({
      items: (raw.data ?? []).map((s) => normalizeTopScorer(s, raw.teams)),
      meta: raw.meta,
    }),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePublicNews(locale: string, page?: number) {
  const slug = useOrganizationSlug();
  return useQuery({
    queryKey: queryKeys(slug).news(locale, page),
    queryFn: () =>
      fetchPublicApiWithMeta<PublicContentItemRaw[]>(slug, "/news", {
        params: { locale, page: page ?? 1, limit: 20 },
      }),
    staleTime: 2 * 60 * 1000,
    enabled: !!locale,
    select: (envelope) => ({
      items: (envelope.data ?? []).map((n) => normalizeContentItem(n, locale)),
      meta: envelope.meta,
    }),
  });
}

export function usePublicHighlights(locale: string, page?: number) {
  const slug = useOrganizationSlug();
  return useQuery({
    queryKey: queryKeys(slug).highlights(locale, page),
    queryFn: () =>
      fetchPublicApiWithMeta<PublicContentItemRaw[]>(slug, "/highlights", {
        params: { locale, page: page ?? 1, limit: 20 },
      }),
    staleTime: 2 * 60 * 1000,
    enabled: !!locale,
    select: (envelope) => ({
      items: (envelope.data ?? []).map((n) => normalizeContentItem(n, locale)),
      meta: envelope.meta,
    }),
  });
}

export function usePublicNewsItem(itemSlug: string, locale: string) {
  const slug = useOrganizationSlug();
  return useQuery({
    queryKey: queryKeys(slug).newsItem(itemSlug, locale),
    queryFn: () =>
      fetchPublicApi<PublicContentItemRaw>(slug, `/news/${itemSlug}`, {
        params: { locale },
      }),
    select: (raw) => normalizeContentItem(raw, locale),
    staleTime: 2 * 60 * 1000,
    enabled: !!locale && !!itemSlug,
    retry: 1,
  });
}

export function usePublicHighlightsItem(itemSlug: string, locale: string) {
  const slug = useOrganizationSlug();
  return useQuery({
    queryKey: queryKeys(slug).highlightItem(itemSlug, locale),
    queryFn: () =>
      fetchPublicApi<PublicContentItemRaw>(slug, `/highlights/${itemSlug}`, {
        params: { locale },
      }),
    select: (raw) => normalizeContentItem(raw, locale),
    staleTime: 2 * 60 * 1000,
    enabled: !!locale && !!itemSlug,
    retry: 1,
  });
}

export function usePublicSponsors(locale: string) {
  const slug = useOrganizationSlug();
  return useQuery({
    queryKey: queryKeys(slug).sponsors(locale),
    queryFn: () =>
      fetchPublicApi<Parameters<typeof normalizeSponsor>[0][]>(slug, "/sponsors", {
        params: { locale, limit: 20 },
      }),
    select: (data) => data.map(normalizeSponsor),
    staleTime: 5 * 60 * 1000,
    enabled: !!locale,
  });
}

export function usePublicAbout(locale: string) {
  const slug = useOrganizationSlug();
  return useQuery({
    queryKey: queryKeys(slug).about(locale),
    queryFn: () =>
      fetchPublicApi<PublicAboutUs>(slug, "/about-us", {
        params: { locale },
      }),
    staleTime: 10 * 60 * 1000,
    enabled: !!locale,
  });
}

export type CreateInquiryBody = {
  teamName?: string;
  city?: string;
  divisionInterestId?: string | null;
  contactName?: string;
  contactRole?: string;
  contactEmail?: string;
  contactPhone?: string;
  aboutTeam?: string;
};

export type CreateInquiryResponse = {
  id: string;
  status: string;
  submittedAt: string;
};

export function useCreateInquiry() {
  const slug = useOrganizationSlug();
  return useMutation({
    mutationFn: (body: CreateInquiryBody) =>
      postPublicApi<CreateInquiryResponse>(slug, "/inquiries", body),
  });
}
