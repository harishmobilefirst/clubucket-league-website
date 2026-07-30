import { getApiBaseUrl, getOrganizationSlug, getPublicSurface } from "./env";
import type {
  ApiEnvelope,
  PaginationMeta,
  PublicConfig,
  PublicConfigEnabledModules,
  PublicConfigNavigationItem,
  PublicConfigRaw,
  PublicContentItem,
  PublicContentItemRaw,
  PublicDivision,
  PublicFixtureTeam,
  PublicRawTeam,
  PublicSeason,
  PublicSponsor,
  PublicSponsorRaw,
  PublicStandingRow,
  PublicStandingRowRaw,
  PublicTopScorer,
  PublicTopScorerRaw,
} from "@/types/public-api";

export class PublicApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "PublicApiError";
    this.status = status;
  }
}

async function fetchPublicApiEnvelope<T>(
  path: string,
  options?: { params?: Record<string, string | number | undefined>; init?: RequestInit },
): Promise<ApiEnvelope<T>> {
  const base = getApiBaseUrl();
  const slug = getOrganizationSlug();
  const url = new URL(`${base}/public/organizations/${slug}${path}`);

  url.searchParams.set("surface", getPublicSurface());

  if (options?.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...options?.init,
  });

  if (!response.ok) {
    throw new PublicApiError(
      `API request failed: ${response.status} ${response.statusText}`,
      response.status,
    );
  }

  const envelope: ApiEnvelope<T> = await response.json();

  if (!envelope.success) {
    throw new PublicApiError(
      envelope.message || "API returned unsuccessful response",
      response.status,
    );
  }

  return envelope;
}

export async function fetchPublicApi<T>(
  path: string,
  options?: { params?: Record<string, string | number | undefined>; init?: RequestInit },
): Promise<T> {
  const envelope = await fetchPublicApiEnvelope<T>(path, options);
  return envelope.data;
}

export async function postPublicApi<T>(
  path: string,
  body: Record<string, unknown>,
  options?: { params?: Record<string, string | number | undefined>; init?: RequestInit },
): Promise<T> {
  const envelope = await fetchPublicApiEnvelope<T>(path, {
    ...options,
    init: {
      method: "POST",
      body: JSON.stringify(body),
      ...options?.init,
    },
  });
  return envelope.data;
}

export async function fetchPublicApiWithMeta<T>(
  path: string,
  options?: { params?: Record<string, string | number | undefined>; init?: RequestInit },
): Promise<{ data: T; meta?: PaginationMeta; teams?: Record<string, PublicRawTeam> }> {
  const envelope = await fetchPublicApiEnvelope<T>(path, options);
  return { data: envelope.data, meta: envelope.meta, teams: envelope.teams };
}

/**
 * Resolve a team id against a de-duped `teams` map into the embedded team
 * object shape the UI consumes. Returns undefined when the id/map is missing.
 */
export function resolveTeam(
  id: string | undefined | null,
  teams?: Record<string, PublicRawTeam>,
): PublicFixtureTeam | undefined {
  if (!id || !teams) return undefined;
  const t = teams[id];
  if (!t) return undefined;
  return {
    id: t.id,
    name: t.name,
    shortCode: t.shortCode,
    logoUrl: t.logoUrl,
    slug: t.slug,
    location: t.location,
  };
}

/** Safe empty team so components that read `homeTeam.name` never crash when an
 *  id is missing from the `teams` map. */
const EMPTY_TEAM: PublicFixtureTeam = { id: "", name: "" };

/**
 * Turn a raw fixture (teams referenced by `homeTeamId`/`awayTeamId`) into the
 * embedded `homeTeam`/`awayTeam` shape the UI reads, resolving ids against the
 * de-duped `teams` map. Falls back to an empty team when the id is absent.
 */
export function resolveFixtureTeams<
  T extends { homeTeamId?: string; awayTeamId?: string },
>(fixture: T, teams?: Record<string, PublicRawTeam>) {
  return {
    ...fixture,
    homeTeam: resolveTeam(fixture.homeTeamId, teams) ?? EMPTY_TEAM,
    awayTeam: resolveTeam(fixture.awayTeamId, teams) ?? EMPTY_TEAM,
  };
}

/**
 * Turn a raw standings row (`teamId`) into the embedded `team` shape the table
 * reads, resolving against the response `teams` map.
 */
export function resolveStandingRow(
  row: PublicStandingRowRaw,
  teams?: Record<string, PublicRawTeam>,
): PublicStandingRow {
  const t = row.teamId ? teams?.[row.teamId] : undefined;
  return {
    ...row,
    id: row.id ?? row.teamId,
    team: {
      id: t?.id ?? row.teamId,
      name: t?.name ?? "",
      shortCode: t?.shortCode,
      logoUrl: t?.logoUrl,
      slug: t?.slug,
    },
  };
}

const moduleRouteMap: Record<string, string | undefined> = {
  home: "/",
  divisions: "/divisions",
  schedule: "/schedule",
  standings: "/standing",
  news: "/news",
  highlights: "/highlights",
  aboutUs: "/about",
  topScorers: "/top-scorers",
};

export function normalizePublicRoute(item: PublicConfigNavigationItem): string | undefined {
  return moduleRouteMap[item.key];
}

/**
 * The API now sends `enabledModules` as a snake_case string array
 * (e.g. ["about_us", "top_scorers"]) while nav/footer gate on camelCase keys
 * (aboutUs, topScorers). Build a record that answers BOTH key styles. Falls
 * back to the legacy boolean-record form when given an object.
 */
export function toEnabledRecord(
  value: PublicConfigEnabledModules | string[] | undefined,
): PublicConfigEnabledModules {
  if (Array.isArray(value)) {
    const rec: PublicConfigEnabledModules = {};
    for (const m of value) {
      const key = String(m);
      rec[key] = true;
      rec[key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())] = true;
    }
    return rec;
  }
  return value || {};
}

export function normalizePublicConfig(raw: PublicConfigRaw): PublicConfig {
  const enabledModules = toEnabledRecord(raw.enabledModules);
  const supportedLocales =
    raw.supportedLocales?.map((item) =>
      typeof item === "string" ? { label: item.toUpperCase(), locale: item } : item,
    ) || [];
  const defaultLocale = raw.defaultLocale || supportedLocales[0]?.locale || "en";
  const navigation = (raw.navigation || [])
    .map((item) => ({ ...item, appRoute: normalizePublicRoute(item) }))
    .filter(
      (item) =>
        item.appRoute &&
        (item.key === "home" || enabledModules[item.key] !== false),
    ) as PublicConfig["navigation"];

  return {
    id: raw.id,
    organizationSlug: raw.organization.slug,
    displayName: raw.displayName || raw.organization.name || raw.organization.slug,
    subtitle: raw.subtitle,
    logoUrl: raw.logoUrl,
    appIconUrl: raw.appIconUrl,
    fallbackImageUrl: raw.fallbackImageUrl,
    contactEmail: raw.contactEmail,
    contactPhone: raw.contactPhone,
    website: raw.website,
    socialLinks: raw.socialLinks,
    registrationEnabled: raw.registrationEnabled,
    heroTitle: raw.heroTitle,
    heroImages: raw.heroImages,
    supportEmail: raw.supportEmail,
    defaultLocale,
    supportedLocales: supportedLocales.length
      ? supportedLocales
      : [{ label: defaultLocale.toUpperCase(), locale: defaultLocale }],
    enabledModules,
    activeSeasonId: raw.activeSeason?.id,
    activeSeason: raw.activeSeason || undefined,
    defaultDivisionId: raw.defaultDivision?.id,
    defaultDivision: raw.defaultDivision,
    navigation,
    theme: raw.theme,
    settings: raw.settings,
    publishedAt: raw.publishedAt,
  };
}

export function isModuleEnabled(config: PublicConfig | undefined, key: string): boolean {
  if (!config) return true;
  // The public API no longer sends `enabledModules`, so a module is treated as
  // enabled unless a (legacy) config explicitly disables it with `false`.
  return config.enabledModules[key] !== false;
}

export function getDefaultSeasonId(
  config: PublicConfig | undefined,
  seasons: PublicSeason[] | undefined,
): string | undefined {
  if (config?.activeSeasonId) return config.activeSeasonId;
  const active = seasons?.find((s) => s.status === "active" || s.isActive || s.isCurrent);
  return active?.id || seasons?.[0]?.id;
}

export function getDefaultDivisionId(
  config: PublicConfig | undefined,
  divisions: PublicDivision[] | undefined,
): string | undefined {
  return config?.defaultDivisionId || divisions?.[0]?.id;
}

export function normalizeContentImage(
  item: { featuredImageUrl?: string; thumbnailUrl?: string },
  fallbackImageUrl?: string,
): string | undefined {
  return item.featuredImageUrl || item.thumbnailUrl || fallbackImageUrl;
}

/**
 * Content bodies come from the API as a rich-text JSON object
 * (`{ blocks: [{ text, type }] }`), a plain string, or null. Flatten any of
 * these into a newline-separated string the detail page can render.
 */
export function normalizeContentBody(body: unknown): string {
  if (!body) return "";
  if (typeof body === "string") return body;
  if (typeof body === "object") {
    const blocks = (body as { blocks?: unknown }).blocks;
    if (Array.isArray(blocks)) {
      return blocks
        .map((b) =>
          typeof b === "string" ? b : (b as { text?: string })?.text ?? "",
        )
        .filter(Boolean)
        .join("\n\n");
    }
  }
  return "";
}

/**
 * Pick the locale-appropriate variant of a bilingual field (`<base>En` /
 * `<base>Es`). Falls back across languages and to the legacy single field so
 * it works whether the API returns both languages or a pre-localized value.
 */
export function pickLocalized(
  raw: Record<string, unknown>,
  base: string,
  locale: string,
): unknown {
  const en = raw[`${base}En`];
  const es = raw[`${base}Es`];
  const preferred = locale?.toLowerCase().startsWith("es") ? es : en;
  return preferred ?? en ?? es ?? raw[base];
}

/**
 * Map a raw API content item onto the shape the UI expects: pick the locale
 * for bilingual title/summary/body, flatten `body`, and alias
 * `ctaLabel`/`publishedAt`/`module` to the `ctaText`/`date`/`category` fields
 * the components read.
 */
export function normalizeContentItem(
  raw: PublicContentItemRaw,
  locale = "en",
): PublicContentItem {
  const item = raw as Record<string, unknown>;
  return {
    ...(raw as unknown as PublicContentItem),
    title:
      (pickLocalized(item, "title", locale) as string) || (item.title as string) || "",
    summary:
      (pickLocalized(item, "summary", locale) as string) ||
      (item.summary as string) ||
      undefined,
    body: normalizeContentBody(pickLocalized(item, "body", locale) ?? item.body),
    date: (item.publishedAt as string) || (item.date as string) || undefined,
    ctaText: (item.ctaLabel as string) || (item.ctaText as string) || undefined,
    category: (item.category as string) || (item.module as string) || undefined,
  };
}

export function normalizeContentExcerpt(item: {
  summary?: string;
  body?: unknown;
  bodySections?: { title?: string; body: string }[];
}): string {
  if (item.summary) return item.summary;
  const body = normalizeContentBody(item.body);
  if (body) return body;
  if (item.bodySections?.length && item.bodySections[0].body) {
    return item.bodySections[0].body;
  }
  return "";
}

export function generateInitials(name: string | undefined | null): string {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function displaySafeString(value: string | undefined | null): string {
  return value || "";
}

export function normalizeSponsor(raw: {
  id: string;
  title?: string;
  featuredImageUrl?: string;
  ctaUrl?: string;
  metadata?: { websiteUrl?: string };
  sortOrder?: number;
}): PublicSponsor {
  return {
    id: raw.id,
    name: raw.title || "",
    logoUrl: raw.featuredImageUrl,
    websiteUrl: raw.ctaUrl || raw.metadata?.websiteUrl,
    order: raw.sortOrder,
  };
}

/**
 * Normalize a raw top-scorer row. The new API references the team by id only
 * (`teamId`) and returns the full team in the sibling `teams` map, so resolve
 * from there — preferring an embedded `team` when present (legacy resilience).
 * Never throws when the team is missing.
 */
export function normalizeTopScorer(
  raw: PublicTopScorerRaw,
  teams?: Record<string, PublicRawTeam>,
): PublicTopScorer {
  const team = raw.team ?? (raw.teamId ? teams?.[raw.teamId] : undefined);
  return {
    rank: raw.rank,
    playerId: raw.playerId,
    playerName: raw.player?.fullName ?? "",
    teamId: raw.teamId,
    teamName: team?.name,
    teamInitials: team?.shortCode ?? generateInitials(team?.name),
    goals: raw.goals,
    imageUrl: raw.player?.imageUrl,
  };
}
