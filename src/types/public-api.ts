export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  message?: string;
  /** De-duped team map keyed by id, present as a sibling of `data` on
   *  /schedule and /top-scorers. Other endpoints nest it inside `data`. */
  teams?: Record<string, PublicRawTeam>;
};

export type PaginationMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

/** Value shape in every de-duped `teams` map (superset covering all endpoints). */
export type PublicRawTeam = {
  id: string;
  name: string;
  slug?: string;
  shortCode?: string;
  logoUrl?: string;
  status?: string;
  location?: string;
  division?: { id: string; name: string; sortOrder?: number };
  homeVenue?: PublicVenueInfo;
};

export type PublicConfigOrganization = {
  id: string;
  name: string;
  slug: string;
  status?: string;
};

export type PublicConfigLocale = {
  label: string;
  locale: string;
};

export type PublicConfigEnabledModules = Record<string, boolean>;

export type PublicHeroImage = {
  url: string;
  assetId?: string | null;
};

export type PublicConfigNavigationItem = {
  key: string;
  label: string;
  route: string;
};

export type NormalizedPublicConfigNavigationItem = PublicConfigNavigationItem & {
  appRoute: string;
};

export type PublicConfigSeason = {
  id: string;
  name: string;
  status?: string;
  startDate?: string;
  endDate?: string;
};

export type PublicConfigDivision = {
  id: string;
  name: string;
  status?: string;
  sortOrder?: number;
};

export type PublicTheme = {
  /** New flat shape returned by the API doc: { primary, secondary, accent }. */
  primary?: string;
  secondary?: string;
  accent?: string;
  media?: {
    imageRadius?: string;
    logoTreatment?: string;
  };
  radii?: Record<string, number>;
  colors?: {
    text?: {
      muted?: string;
      inverse?: string;
      primary?: string;
      secondary?: string;
    };
    brand?: {
      accent?: string;
      primary?: string;
      secondary?: string;
    };
    border?: {
      strong?: string;
      subtle?: string;
    };
    status?: {
      info?: string;
      danger?: string;
      success?: string;
      warning?: string;
    };
    surface?: {
      muted?: string;
      panel?: string;
      canvas?: string;
      inverse?: string;
    };
  };
  spacing?: Record<string, number>;
  typography?: {
    scale?: Record<string, number>;
    bodyWeight?: number;
    fontFamily?: string;
    headingWeight?: number;
  };
};

export type PublicConfigSettings = Record<string, string | number | boolean | null | undefined> & {
  appDestinationUrl?: string;
  seasonLabel?: string;
  defaultTimezone?: string;
  manualStoreBuilds?: boolean;
};

export type PublicConfigRaw = {
  id: string;
  organization: PublicConfigOrganization;
  surface?: string;
  status?: string;
  displayName?: string;
  subtitle?: string;
  logoUrl?: string;
  appIconUrl?: string;
  fallbackImageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  /** public_web surface extras */
  registrationEnabled?: boolean;
  heroTitle?: string;
  heroImages?: (PublicHeroImage | string)[];
  supportEmail?: string;
  defaultLocale: string;
  supportedLocales?: (PublicConfigLocale | string)[];
  /** May be a snake_case string array (new) or a boolean record (legacy). */
  enabledModules?: PublicConfigEnabledModules | string[];
  activeSeason?: PublicConfigSeason | null;
  defaultDivision?: PublicConfigDivision | null;
  navigation?: PublicConfigNavigationItem[];
  theme?: PublicTheme;
  settings?: PublicConfigSettings;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PublicConfig = {
  id: string;
  organizationSlug: string;
  displayName: string;
  subtitle?: string;
  logoUrl?: string;
  appIconUrl?: string;
  fallbackImageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  registrationEnabled?: boolean;
  heroTitle?: string;
  heroImages?: string[];
  supportEmail?: string;
  defaultLocale: string;
  supportedLocales: PublicConfigLocale[];
  enabledModules: PublicConfigEnabledModules;
  activeSeasonId?: string;
  activeSeason?: PublicConfigSeason;
  defaultDivisionId?: string;
  defaultDivision?: PublicConfigDivision | null;
  navigation: NormalizedPublicConfigNavigationItem[];
  theme?: PublicTheme;
  settings?: PublicConfigSettings;
  publishedAt?: string;
};

export type PublicDivision = {
  id: string;
  name: string;
  order?: number;
  sortOrder?: number;
  status?: string;
  teams?: PublicTeamSummary[];
};

export type PublicTeamSummary = {
  id: string;
  name: string;
  initials?: string;
  slug?: string;
  shortCode?: string;
  location?: string;
  logoUrl?: string;
  divisionId?: string;
  divisionName?: string;
};

export type PublicRosterEntry = {
  id: string;
  playerId: string;
  publicCode: string;
  fullName: string;
  imageUrl?: string;
  jerseyNumber?: number;
  position?: string;
  status?: string;
};

export type PublicTeamDetailRaw = {
  id: string;
  name: string;
  slug?: string;
  shortCode?: string;
  logoUrl?: string;
  location?: string;
  division: { id: string; name: string; sortOrder?: number };
  homeVenue?: PublicVenueInfo;
  status?: string;
  roster: PublicRosterEntry[];
  socialLinks?: Record<string, string>;
};

export type PublicTeamDetail = {
  id: string;
  name: string;
  initials?: string;
  logoUrl?: string;
  divisionId?: string;
  divisionName?: string;
  players?: PublicPlayer[];
  coaches?: PublicCoach[];
  socialLinks?: Record<string, string>;
};

export type PublicPlayer = {
  id: string;
  name: string;
  number?: number;
  position?: string;
  nationality?: string;
  imageUrl?: string;
};

export type PublicCoach = {
  id: string;
  name: string;
  role?: string;
  nationality?: string;
  imageUrl?: string;
};

export type PublicSeason = {
  id: string;
  name: string;
  status?: "active" | "upcoming" | "completed";
  isActive?: boolean;
  isCurrent?: boolean;
  startDate?: string;
  endDate?: string;
};

export type PublicVenueInfo = {
  id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
};

export type PublicFixtureTeam = {
  id: string;
  name: string;
  shortCode?: string;
  logoUrl?: string;
  slug?: string;
  location?: string;
};

export type PublicFixtureResult = {
  status?: string;
  outcome?: "home_win" | "away_win" | "draw";
  homeScore: number;
  awayScore: number;
  confirmedAt?: string;
};

/** Common fixture fields shared by the raw (id-referencing) and embedded shapes. */
type PublicFixtureBase = {
  id: string;
  round?: number;
  roundName?: string;
  matchDate: string;
  kickoffTime?: string;
  season: { id: string; name: string; status: string };
  division: { id: string; name: string; sortOrder: number };
  venue: PublicVenueInfo;
  status: "scheduled" | "completed" | "postponed" | "cancelled";
  result: PublicFixtureResult | null;
};

/** Raw fixture as returned by the API: teams referenced by id. */
export type PublicFixtureRaw = PublicFixtureBase & {
  homeTeamId: string;
  awayTeamId: string;
};

/** Fixture after the hook `select` resolves the teams map into embedded objects. */
export type PublicFixture = PublicFixtureBase & {
  homeTeamId?: string;
  awayTeamId?: string;
  homeTeam: PublicFixtureTeam;
  awayTeam: PublicFixtureTeam;
};

export type PublicFixtureGoalEvent = {
  id: string;
  teamId: string;
  teamName?: string | null;
  playerId: string;
  playerName?: string | null;
  goals: number;
};

export type PublicFixtureCardEvent = {
  id: string;
  teamId: string;
  teamName?: string | null;
  playerId: string;
  playerName?: string | null;
  cardType: "yellow" | "red";
  cards: number;
};

/** Raw fixture detail: id-referenced teams + nested `teams` map + events. */
export type PublicFixtureDetailRaw = PublicFixtureRaw & {
  teams?: Record<string, PublicRawTeam>;
  goalEvents: PublicFixtureGoalEvent[];
  cardEvents: PublicFixtureCardEvent[];
};

/** Fixture detail after `select` resolves the teams map. */
export type PublicFixtureDetail = PublicFixture & {
  goalEvents: PublicFixtureGoalEvent[];
  cardEvents: PublicFixtureCardEvent[];
};

export type PublicStandingTeam = {
  id: string;
  name: string;
  shortCode?: string;
  logoUrl?: string;
  slug?: string;
};

export type PublicStandingRow = {
  id: string;
  rank: number;
  team: PublicStandingTeam;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

/** Raw standings row: references its team by id into the response `teams` map. */
export type PublicStandingRowRaw = Omit<PublicStandingRow, "team"> & {
  teamId: string;
};

/** New /standings response: an object (rows + de-duped teams), null when empty. */
export type PublicStandingsResponse = {
  season: { id: string; name: string; status?: string } | null;
  division: { id: string; name: string; sortOrder?: number } | null;
  teams?: Record<string, PublicRawTeam>;
  rows: PublicStandingRowRaw[];
} | null;

export type PublicTopScorer = {
  playerId: string;
  playerName: string;
  teamId?: string;
  teamName?: string;
  teamInitials?: string;
  goals: number;
  position?: string;
  imageUrl?: string;
  rank: number;
};

export type PublicTopScorerRaw = {
  rank: number;
  playerId: string;
  player: {
    id: string;
    fullName: string;
    publicCode: string;
    imageUrl?: string;
    position?: string;
    status: string;
  };
  teamId?: string;
  /** Legacy embedded team (older API); new API references via teamId + teams map. */
  team?: {
    id: string;
    name: string;
    slug?: string;
    shortCode?: string;
    logoUrl?: string;
    location?: string;
    status?: string;
  };
  goals: number;
};

export type PublicContentItem = {
  id: string;
  title: string;
  slug?: string;
  category?: string;
  tags?: string[];
  date?: string;
  summary?: string;
  body?: string;
  bodySections?: { title?: string; body: string; order?: number }[];
  featuredImageUrl?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  ctaUrl?: string;
  ctaText?: string;
  author?: string;
};

/**
 * Raw content item from the new API — carries both languages plus extra
 * metadata. `normalizeContentItem(raw, locale)` collapses this into
 * `PublicContentItem`. Legacy single-language fields kept for resilience.
 */
export type PublicContentItemRaw = {
  id: string;
  module?: string;
  slug?: string;
  titleEn?: string;
  titleEs?: string;
  summaryEn?: string;
  summaryEs?: string;
  bodyEn?: unknown;
  bodyEs?: unknown;
  featuredImageUrl?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  publishedAt?: string;
  metadata?: Record<string, unknown>;
  relatedFixture?: unknown;
  relatedTeam?: unknown;
  ctaLabel?: string;
  ctaUrl?: string;
  // legacy fallbacks
  title?: string;
  summary?: string;
  body?: unknown;
  category?: string;
  date?: string;
  ctaText?: string;
  tags?: string[];
  author?: string;
  bodySections?: { title?: string; body: string; order?: number }[];
  [key: string]: unknown;
};

export type PublicSponsor = {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  order?: number;
};

/** Raw sponsor from the new API. */
export type PublicSponsorRaw = {
  id: string;
  title?: string;
  sortOrder?: number;
  featuredImageUrl?: string;
  publishedAt?: string;
  // legacy fields (older API) kept for resilience
  ctaUrl?: string;
  metadata?: { websiteUrl?: string };
};

export type PublicHome = {
  heroSlides?: {
    imageUrl?: string;
    headline?: string;
    subheadline?: string;
    ctaText?: string;
    ctaLink?: string;
  }[];
  aboutContent?: {
    title?: string;
    body?: string;
    imageUrl?: string;
  };
  divisions?: PublicDivision[];
  recentResults?: PublicFixture[];
  topScorers?: PublicTopScorer[];
  latestNews?: PublicContentItem[];
  highlights?: PublicContentItem[];
  sponsors?: PublicSponsor[];
};

/** Raw /home aggregate as returned by the new API. */
export type PublicHomeRaw = {
  config?: PublicConfigRaw;
  schedule?: PublicFixtureRaw[];
  scheduleTeams?: Record<string, PublicRawTeam>;
  standings?: PublicStandingsResponse;
  topScorers?: PublicTopScorerRaw[];
  topScorersTeams?: Record<string, PublicRawTeam>;
  news?: PublicContentItemRaw[];
  highlights?: PublicContentItemRaw[];
  sponsors?: PublicSponsorRaw[];
  aboutUs?: PublicContentItemRaw | null;
};

export type PublicAboutUs = {
  title?: string;
  summary?: string;
  bodySections?: { title?: string; body: string }[];
  imageUrl?: string;
};
