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
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--cb-surface-canvas)" }}>
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold" style={{ color: "var(--cb-text-primary)" }}>404</h1>
        <h2 className="mt-4 text-xl font-semibold" style={{ color: "var(--cb-text-primary)" }}>
          {t("notFound.title")}
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--cb-text-muted)" }}>
          {t("notFound.body")}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: "var(--cb-brand-accent)", color: "var(--cb-text-inverse)" }}
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
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--cb-surface-canvas)" }}>
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight" style={{ color: "var(--cb-text-primary)" }}>
          {t("error.title")}
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--cb-text-muted)" }}>
          {error.message || t("error.body")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: "var(--cb-brand-accent)", color: "var(--cb-text-inverse)" }}
          >
            {t("error.tryAgain")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--cb-surface-muted)]"
            style={{ borderColor: "var(--cb-border-subtle)", background: "var(--cb-surface-canvas)", color: "var(--cb-text-primary)" }}
          >
            {t("error.goHome")}
          </a>
        </div>
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
    const favicon =
      loaderData?.kind === "published" ? loaderData.config.logoUrl : "/favicon.ico";

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
        {
          rel: "icon",
          href: favicon,
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
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center" style={{ background: "var(--cb-surface-canvas)" }}>
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold" style={{ color: "var(--cb-text-primary)" }}>Site not found</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--cb-text-muted)" }}>
            We couldn&apos;t find a Clubucket site at this address.
          </p>
        </div>
      </div>
    );
  }

  if (organization.kind === "coming_soon") {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center" style={{ background: "var(--cb-surface-canvas)" }}>
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold" style={{ color: "var(--cb-text-primary)" }}>Coming soon</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--cb-text-muted)" }}>
            This site is being set up and will be live shortly.
          </p>
        </div>
      </div>
    );
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
            <ThemeColorSync />
            <Outlet />
          </PublicThemeGate>
        </LocaleProvider>
      </OrganizationProvider>
    </QueryClientProvider>
  );
}

function PublicThemeGate({ children }: { children: React.ReactNode }) {
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
      <div className="min-h-screen flex items-center justify-center px-4 text-center" style={{ background: "var(--cb-surface-canvas)" }}>
        <div>
          <h1 className="text-[length:var(--cb-font-size-title)] font-[var(--cb-font-weight-heading)]" style={{ color: "var(--cb-text-primary)" }}>
            Website unavailable
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--cb-text-secondary)" }}>
            The public website configuration could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function ThemeColorSync() {
  const { data: config } = usePublicConfig();

  useEffect(() => {
    if (typeof document === "undefined" || !config?.theme) return;
    const root = document.documentElement.style;
    const { primary, secondary, accent } = config.theme;
    if (primary) root.setProperty("--cb-brand-primary", primary);
    if (secondary) root.setProperty("--cb-brand-secondary", secondary);
    if (accent) root.setProperty("--cb-brand-accent", accent);
  }, [config?.theme]);

  return null;
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
