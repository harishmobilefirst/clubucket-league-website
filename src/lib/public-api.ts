import { getApiBaseUrl, getPublicSurface } from "./env";
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
  PublicHeroImage,
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
  slug: string,
  path: string,
  options?: { params?: Record<string, string | number | undefined>; init?: RequestInit },
): Promise<ApiEnvelope<T>> {
  const base = getApiBaseUrl();
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
  slug: string,
  path: string,
  options?: { params?: Record<string, string | number | undefined>; init?: RequestInit },
): Promise<T> {
  const envelope = await fetchPublicApiEnvelope<T>(slug, path, options);
  return envelope.data;
}

export async function postPublicApi<T>(
  slug: string,
  path: string,
  body: Record<string, unknown>,
  options?: { params?: Record<string, string | number | undefined>; init?: RequestInit },
): Promise<T> {
  const envelope = await fetchPublicApiEnvelope<T>(slug, path, {
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
  slug: string,
  path: string,
  options?: { params?: Record<string, string | number | undefined>; init?: RequestInit },
): Promise<{ data: T; meta?: PaginationMeta; teams?: Record<string, PublicRawTeam> }> {
  const envelope = await fetchPublicApiEnvelope<T>(slug, path, options);
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
export function resolveFixtureTeams<T extends { homeTeamId?: string; awayTeamId?: string }>(
  fixture: T,
  teams?: Record<string, PublicRawTeam>,
) {
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

/**
 * Locales shown when the API config doesn't declare a supported set. A
 * bilingual EN/ES site is the product default for the public league surface;
 * an explicit `supportedLocales` list from the API always wins over this.
 */
export const DEFAULT_SUPPORTED_LOCALES = [
  { label: "EN", locale: "en" },
  { label: "ES", locale: "es" },
];

/**
 * Normalize the hero image list into plain URL strings. The API returns an
 * array of `{ url, assetId }` objects; legacy plain strings are accepted too.
 */
export function normalizeHeroImages(
  value: (PublicHeroImage | string)[] | undefined,
): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const urls = value
    .map((item) => (typeof item === "string" ? item : item.url))
    .filter((url): url is string => typeof url === "string" && url.length > 0);
  return urls.length ? urls : undefined;
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
      (item) => item.appRoute && (item.key === "home" || enabledModules[item.key] !== false),
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
    heroImages: normalizeHeroImages(raw.heroImages),
    supportEmail: raw.supportEmail,
    defaultLocale,
    supportedLocales: supportedLocales.length ? supportedLocales : DEFAULT_SUPPORTED_LOCALES,
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
        .map((b) => (typeof b === "string" ? b : ((b as { text?: string })?.text ?? "")))
        .filter(Boolean)
        .join("\n\n");
    }
  }
  return "";
}

/**
 * Format an ISO `publishedAt`/`date` value into a short locale-aware label
 * ("Jun 1, 2026"). Passes through already-formatted strings untouched and
 * never throws on malformed input.
 */
export function formatContentDate(value: string | undefined | null, locale = "en"): string {
  if (!value) return "";
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const lang = locale.toLowerCase().startsWith("es") ? "es-MX" : "en-US";
  return date.toLocaleDateString(lang, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Pick the locale-appropriate variant of a bilingual field (`<base>En` /
 * `<base>Es`). Falls back across languages and to the legacy single field so
 * it works whether the API returns both languages or a pre-localized value.
 */
export function pickLocalized(raw: Record<string, unknown>, base: string, locale: string): unknown {
  const en = raw[`${base}En`];
  const es = raw[`${base}Es`];
  const preferred = locale?.toLowerCase().startsWith("es") ? es : en;
  return preferred ?? en ?? es ?? raw[base];
}

/**
 * Map a raw API content item onto the shape the UI expects: pick the locale
 * for bilingual title/summary/body, flatten `body`, and alias
 * `ctaLabel`/`publishedAt` to the `ctaText`/`date` fields the components read.
 * A real `category` (when the API sends one) is passed through; the internal
 * `module` key is not surfaced as a card eyebrow.
 */
export function normalizeContentItem(raw: PublicContentItemRaw, locale = "en"): PublicContentItem {
  const item = raw as Record<string, unknown>;
  return {
    ...(raw as unknown as PublicContentItem),
    title: (pickLocalized(item, "title", locale) as string) || (item.title as string) || "",
    summary:
      (pickLocalized(item, "summary", locale) as string) || (item.summary as string) || undefined,
    body: normalizeContentBody(pickLocalized(item, "body", locale) ?? item.body),
    date:
      formatContentDate((item.publishedAt as string) || (item.date as string), locale) || undefined,
    ctaText: (item.ctaLabel as string) || (item.ctaText as string) || undefined,
    category: (item.category as string) || undefined,
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

/**
 * Resolve the deep-link slug for a content item — the API may send either
 * `slug` or only `id`. Trims whitespace and returns `""` when neither exists
 * so callers can filter out items that cannot be routed to.
 */
export function contentItemSlug(item: { slug?: string; id?: string }): string {
  return item.slug?.trim() || item.id?.trim() || "";
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
    position: raw.player?.position,
    imageUrl: raw.player?.imageUrl,
  };
}
