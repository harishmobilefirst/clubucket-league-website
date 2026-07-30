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
import { getOrganizationSlug } from "@/lib/env";
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

const slug = getOrganizationSlug();

export const queryKeys = {
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
};

export function usePublicConfig() {
  return useQuery({
    queryKey: queryKeys.config,
    queryFn: () => fetchPublicApi<PublicConfigRaw>("/config"),
    select: normalizePublicConfig,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function usePublicHome(locale: string) {
  return useQuery({
    queryKey: queryKeys.home(locale),
    queryFn: () =>
      fetchPublicApi<PublicHomeRaw>("/home", {
        params: { locale },
      }),
    select: (data): PublicHome => ({
      recentResults: (data.schedule ?? []).map((f) =>
        resolveFixtureTeams(f, data.scheduleTeams),
      ),
      topScorers: (data.topScorers ?? []).map((s) =>
        normalizeTopScorer(s, data.topScorersTeams),
      ),
      latestNews: (data.news ?? []).map((n) => normalizeContentItem(n, locale)),
      highlights: (data.highlights ?? []).map((n) => normalizeContentItem(n, locale)),
      sponsors: (data.sponsors ?? []).map(normalizeSponsor),
    }),
    staleTime: 2 * 60 * 1000,
    enabled: !!locale,
  });
}

export function usePublicDivisions() {
  return useQuery({
    queryKey: queryKeys.divisions,
    queryFn: () => fetchPublicApi<PublicDivision[]>("/divisions"),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicTeam(teamId: string) {
  return useQuery({
    queryKey: queryKeys.team(teamId),
    queryFn: () => fetchPublicApi<PublicTeamDetailRaw>(`/teams/${teamId}`),
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
  return useQuery({
    queryKey: queryKeys.seasons,
    queryFn: () => fetchPublicApi<PublicSeason[]>("/seasons"),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePublicSchedule(
  seasonId?: string,
  divisionId?: string,
  status?: string,
  page?: number,
) {
  return useQuery({
    queryKey: queryKeys.schedule(seasonId, divisionId, status, page),
    queryFn: () =>
      fetchPublicApiWithMeta<PublicFixtureRaw[]>("/schedule", {
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
  return useQuery({
    queryKey: queryKeys.fixture(fixtureId ?? ""),
    queryFn: () => fetchPublicApi<PublicFixtureDetailRaw>(`/schedule/${fixtureId}`),
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
  return useQuery({
    queryKey: queryKeys.standings(seasonId, divisionId),
    queryFn: () =>
      fetchPublicApi<unknown>("/standings", {
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
  return useQuery({
    queryKey: queryKeys.topScorers(seasonId, divisionId),
    queryFn: () =>
      fetchPublicApiWithMeta<PublicTopScorerRaw[]>("/top-scorers", {
        params: { seasonId, divisionId, limit: 20 },
      }),
    select: (envelope) =>
      (envelope.data ?? []).map((s) => normalizeTopScorer(s, envelope.teams)),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePublicTopScorersPaginated(page: number, seasonId?: string, divisionId?: string) {
  return useQuery({
    queryKey: queryKeys.topScorersPage(seasonId, divisionId, page),
    queryFn: () =>
      fetchPublicApiWithMeta<PublicTopScorerRaw[]>("/top-scorers", {
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
  return useQuery({
    queryKey: queryKeys.news(locale, page),
    queryFn: () =>
      fetchPublicApiWithMeta<PublicContentItem[]>("/news", {
        params: { locale, page: page ?? 1, limit: 20 },
      }),
    staleTime: 2 * 60 * 1000,
    enabled: !!locale,
    select: (envelope) => ({
      items: envelope.data ?? [],
      meta: envelope.meta,
    }),
  });
}

export function usePublicHighlights(locale: string, page?: number) {
  return useQuery({
    queryKey: queryKeys.highlights(locale, page),
    queryFn: () =>
      fetchPublicApiWithMeta<PublicContentItem[]>("/highlights", {
        params: { locale, page: page ?? 1, limit: 20 },
      }),
    staleTime: 2 * 60 * 1000,
    enabled: !!locale,
    select: (envelope) => ({
      items: envelope.data ?? [],
      meta: envelope.meta,
    }),
  });
}

export function usePublicNewsItem(itemSlug: string, locale: string) {
  return useQuery({
    queryKey: queryKeys.newsItem(itemSlug, locale),
    queryFn: () =>
      fetchPublicApi<PublicContentItemRaw>(`/news/${itemSlug}`, {
        params: { locale },
      }),
    select: (raw) => normalizeContentItem(raw, locale),
    staleTime: 2 * 60 * 1000,
    enabled: !!locale && !!itemSlug,
    retry: 1,
  });
}

export function usePublicHighlightsItem(itemSlug: string, locale: string) {
  return useQuery({
    queryKey: queryKeys.highlightItem(itemSlug, locale),
    queryFn: () =>
      fetchPublicApi<PublicContentItemRaw>(`/highlights/${itemSlug}`, {
        params: { locale },
      }),
    select: (raw) => normalizeContentItem(raw, locale),
    staleTime: 2 * 60 * 1000,
    enabled: !!locale && !!itemSlug,
    retry: 1,
  });
}

export function usePublicSponsors(locale: string) {
  return useQuery({
    queryKey: queryKeys.sponsors(locale),
    queryFn: () =>
      fetchPublicApi<Parameters<typeof normalizeSponsor>[0][]>("/sponsors", {
        params: { locale, limit: 20 },
      }),
    select: (data) => data.map(normalizeSponsor),
    staleTime: 5 * 60 * 1000,
    enabled: !!locale,
  });
}

export function usePublicAbout(locale: string) {
  return useQuery({
    queryKey: queryKeys.about(locale),
    queryFn: () =>
      fetchPublicApi<PublicAboutUs>("/about-us", {
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
  return useMutation({
    mutationFn: (body: CreateInquiryBody) =>
      postPublicApi<CreateInquiryResponse>("/inquiries", body),
  });
}
