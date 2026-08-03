import { createServerFn } from "@tanstack/react-start";
import { getRequestHost, setResponseStatus } from "@tanstack/react-start/server";
import { getApiBaseUrl } from "./env";
import type { PublicConfigRaw } from "@/types/public-api";

export type OrganizationResolution =
  | { kind: "published"; organizationSlug: string; hostname: string; config: PublicConfigRaw }
  | { kind: "coming_soon"; organizationSlug: string; hostname: string }
  | { kind: "not_found"; hostname: string };

// Prefer X-Forwarded-Host: the Cloudflare Worker fan-out sets it, and Amplify/Cloudflare
// may otherwise rewrite the plain Host header before it reaches this app.
export const resolveOrganization = createServerFn({ method: "GET" }).handler(
  async (): Promise<OrganizationResolution> => {
    const hostname = getRequestHost({ xForwardedHost: true });

    let response: Response;
    try {
      response = await fetch(
        `${getApiBaseUrl()}/public/website-config?hostname=${encodeURIComponent(hostname)}`,
      );
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
      return { kind: "coming_soon", organizationSlug: data.organizationSlug, hostname };
    }

    if (data?.status === "published" && data?.organization?.slug) {
      return {
        kind: "published",
        organizationSlug: data.organization.slug,
        hostname,
        config: data,
      };
    }

    setResponseStatus(404);
    return { kind: "not_found", hostname };
  },
);
