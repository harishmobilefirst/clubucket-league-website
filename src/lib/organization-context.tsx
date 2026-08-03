import { createContext, useContext, type ReactNode } from "react";
import type { PublicConfigRaw } from "@/types/public-api";

type OrganizationContextValue = {
  organizationSlug: string;
  initialConfig?: PublicConfigRaw;
};

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export function OrganizationProvider({
  organizationSlug,
  initialConfig,
  children,
}: OrganizationContextValue & { children: ReactNode }) {
  return (
    <OrganizationContext.Provider value={{ organizationSlug, initialConfig }}>
      {children}
    </OrganizationContext.Provider>
  );
}

function useOrganizationContext(): OrganizationContextValue {
  const ctx = useContext(OrganizationContext);
  if (!ctx) throw new Error("useOrganizationSlug must be used within OrganizationProvider");
  return ctx;
}

export function useOrganizationSlug(): string {
  return useOrganizationContext().organizationSlug;
}

export function useInitialOrganizationConfig(): PublicConfigRaw | undefined {
  return useOrganizationContext().initialConfig;
}
