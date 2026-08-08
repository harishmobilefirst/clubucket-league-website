import { createServerFn } from "@tanstack/react-start";
import { getRequestHost, setResponseStatus } from "@tanstack/react-start/server";
import { getApiBaseUrl, getPublicSurface } from "./env";
import type { PublicConfigRaw } from "@/types/public-api";

export type OrganizationResolution =
  | { kind: "published"; organizationSlug: string; hostname: string; config: PublicConfigRaw }
  | { kind: "coming_soon"; organizationSlug: string; hostname: string }
  | { kind: "not_found"; hostname: string };

// Dev/test override: when VITE_ORGANIZATION_SLUG is set, skip hostname-based
// resolution and load the organization's published config directly by slug.
// Without this the site only renders on a hostname the API has a portal domain
// mapping for, so `localhost` (and other ad-hoc hosts) always end up "not found".
const devOrganizationSlug = import.meta.env.VITE_ORGANIZATION_SLUG as string | undefined;

// Prefer X-Forwarded-Host: the Cloudflare Worker fan-out sets it, and Amplify/Cloudflare
// may otherwise rewrite the plain Host header before it reaches this app.
export const resolveOrganization = createServerFn({ method: "GET" }).handler(
  async (): Promise<OrganizationResolution> => {
    const hostname = getRequestHost({ xForwardedHost: true });

    let response: Response;
    try {
      if (devOrganizationSlug) {
        response = await fetch(
          `${getApiBaseUrl()}/public/organizations/${encodeURIComponent(devOrganizationSlug)}/config?surface=${getPublicSurface()}`,
        );
      } else {
        response = await fetch(
          `${getApiBaseUrl()}/public/website-config?hostname=${encodeURIComponent(hostname)}`,
        );
      }
    } catch {
      setResponseStatus(404);
      return { kind: "not_found", hostname };
    }

    if (!response.ok) {
      setResponseStatus(404);
      return { kind: "not_found", hostname };
    }

    const envelope = await response.json().catch(() => null);
    const data = envelope?.data;

    if (data?.status === "coming_soon") {
      return {
        kind: "coming_soon",
        organizationSlug: data.organization?.slug ?? data.organizationSlug,
        hostname,
      };
    }

    if (data?.status === "published" && data?.organization?.slug) {
      return {
        kind: "published",
        organizationSlug: devOrganizationSlug || data.organization.slug,
        hostname,
        config: data,
      };
    }

    setResponseStatus(404);
    return { kind: "not_found", hostname };
  },
);
