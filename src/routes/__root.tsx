import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";

import appCss from "../styles.css?url";
import { LocaleProvider } from "@/lib/locale";
import { useLocale } from "@/lib/locale";
import { useI18n } from "@/lib/i18n";
import { usePublicConfig } from "@/hooks/use-public-api";
import { LoadingState } from "@/components/LoadingState";
import { resolveOrganization } from "@/lib/organization";
import { OrganizationProvider } from "@/lib/organization-context";

function NotFoundComponent() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-[var(--cb-space-md)]">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-[var(--cb-font-weight-heading)] text-foreground">404</h1>
        <h2 className="mt-[var(--cb-space-md)] text-xl font-[var(--cb-font-weight-heading)] text-foreground">
          {t("notFound.title")}
        </h2>
        <p className="mt-[var(--cb-space-xs)] text-sm text-muted-foreground">
          {t("notFound.body")}
        </p>
        <div className="mt-[var(--cb-space-lg)]">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-[var(--cb-radius-md)] bg-[var(--cb-brand-accent)] px-[var(--cb-space-md)] py-[var(--cb-space-sm)] text-sm font-[var(--cb-font-weight-medium)] text-[var(--cb-text-inverse)] transition-colors hover:bg-[var(--cb-brand-accent)]/90"
          >
            {t("notFound.goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-[var(--cb-space-md)]">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-[var(--cb-font-weight-heading)] tracking-normal text-foreground">
          {t("error.title")}
        </h1>
        <p className="mt-[var(--cb-space-xs)] text-sm text-muted-foreground">
          {error.message || t("error.body")}
        </p>
        <div className="mt-[var(--cb-space-lg)] flex flex-wrap justify-center gap-[var(--cb-space-xs)]">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-[var(--cb-radius-md)] bg-[var(--cb-brand-accent)] px-[var(--cb-space-md)] py-[var(--cb-space-sm)] text-sm font-[var(--cb-font-weight-medium)] text-[var(--cb-text-inverse)] transition-colors hover:bg-[var(--cb-brand-accent)]/90"
          >
            {t("error.tryAgain")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-[var(--cb-radius-md)] border border-[var(--cb-border-subtle)] bg-[var(--cb-surface-canvas)] px-[var(--cb-space-md)] py-[var(--cb-space-sm)] text-sm font-[var(--cb-font-weight-medium)] text-[var(--cb-text-primary)] transition-colors hover:bg-[var(--cb-surface-muted)]"
          >
            {t("error.goHome")}
          </a>
        </div>
      </div>
    </div>
  );
}

function OrganizationNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold text-foreground">Site not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t find a Clubucket site at this address.
        </p>
      </div>
    </div>
  );
}

function OrganizationComingSoon() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold text-foreground">Coming soon</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This site is being set up and will be live shortly.
        </p>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: () => resolveOrganization(),
  head: ({ loaderData }) => {
    const title =
      loaderData?.kind === "published"
        ? `${loaderData.config.displayName || loaderData.config.organization.name} — Clubucket`
        : "Clubucket";
    const description =
      loaderData?.kind === "published"
        ? loaderData.config.subtitle || `${loaderData.config.displayName} on Clubucket`
        : "Clubucket — team and league management.";

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const organization = Route.useLoaderData();

  if (organization.kind === "not_found") {
    return <OrganizationNotFound />;
  }

  if (organization.kind === "coming_soon") {
    return <OrganizationComingSoon />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <OrganizationProvider
        organizationSlug={organization.organizationSlug}
        initialConfig={organization.config}
      >
        <LocaleProvider defaultLocale="en">
          <PublicThemeGate>
            <ConfigLocaleSync />
            <Outlet />
          </PublicThemeGate>
        </LocaleProvider>
      </OrganizationProvider>
    </QueryClientProvider>
  );
}

function px(value: number | undefined): string | undefined {
  return value == null ? undefined : `${value}px`;
}

function PublicThemeGate({ children }: { children: ReactNode }) {
  const { data: config, isLoading, error } = usePublicConfig();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center px-[var(--cb-space-md)] text-center">
        <div>
          <h1 className="cb-heading text-[length:var(--cb-font-size-title)]">
            Website unavailable
          </h1>
          <p className="mt-[var(--cb-space-xs)] cb-body">
            The public website configuration could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const theme = config.theme;
  const colors = theme?.colors;
  const radii = theme?.radii;
  const spacing = theme?.spacing;
  const typography = theme?.typography;

  const themeVars = {
    // The API returns a flat brand shape ({ primary, secondary, accent }); the
    // nested colors.brand.* path is kept as a fallback for forward-compat.
    "--cb-brand-primary": theme?.primary ?? colors?.brand?.primary,
    "--cb-brand-accent": theme?.accent ?? colors?.brand?.accent,
    "--cb-brand-secondary": theme?.secondary ?? colors?.brand?.secondary,
    "--cb-text-primary": colors?.text?.primary,
    "--cb-text-secondary": colors?.text?.secondary,
    "--cb-text-muted": colors?.text?.muted,
    "--cb-text-inverse": colors?.text?.inverse,
    "--cb-surface-canvas": colors?.surface?.canvas,
    "--cb-surface-panel": colors?.surface?.panel,
    "--cb-surface-muted": colors?.surface?.muted,
    "--cb-surface-inverse": colors?.surface?.inverse,
    "--cb-border-subtle": colors?.border?.subtle,
    "--cb-border-strong": colors?.border?.strong,
    "--cb-status-success": colors?.status?.success,
    "--cb-status-warning": colors?.status?.warning,
    "--cb-status-danger": colors?.status?.danger,
    "--cb-status-info": colors?.status?.info,
    "--cb-radius-xs": px(radii?.xs),
    "--cb-radius-sm": px(radii?.sm),
    "--cb-radius-md": px(radii?.md),
    "--cb-radius-lg": px(radii?.lg),
    "--cb-space-xs": px(spacing?.xs),
    "--cb-space-sm": px(spacing?.sm),
    "--cb-space-md": px(spacing?.md),
    "--cb-space-lg": px(spacing?.lg),
    "--cb-space-xl": px(spacing?.xl),
    "--cb-space-section": px(spacing?.section),
    "--cb-font-family": "'DM Sans', sans-serif",
    "--cb-font-size-caption": px(typography?.scale?.caption),
    "--cb-font-size-body": px(typography?.scale?.body),
    "--cb-font-size-title": px(typography?.scale?.title),
    "--cb-font-size-screen": px(typography?.scale?.screen),
    "--cb-font-weight-body": typography?.bodyWeight,
    "--cb-font-weight-heading": typography?.headingWeight,
  } as CSSProperties;

  return (
    <div className="cb-page" style={themeVars}>
      {children}
    </div>
  );
}

function ConfigLocaleSync() {
  const { data: config } = usePublicConfig();
  const { locale, setLocale } = useLocale();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale === "es" ? "es" : "en";
    }
  }, [locale]);

  useEffect(() => {
    if (!config) return;
    const supported = config.supportedLocales.map((item) => item.locale);
    const savedLocale =
      typeof window === "undefined" ? null : window.localStorage.getItem("public_locale");
    if (!savedLocale && locale !== config.defaultLocale) {
      setLocale(config.defaultLocale);
      return;
    }
    if (!supported.includes(locale)) setLocale(config.defaultLocale);
  }, [config, locale, setLocale]);

  return null;
}
