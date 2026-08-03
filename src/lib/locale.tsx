import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useOrganizationSlug } from "./organization-context";

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({
  defaultLocale,
  children,
}: {
  defaultLocale: string;
  children: ReactNode;
}) {
  const queryClient = useQueryClient();
  const slug = useOrganizationSlug();
  const [locale, setLocaleState] = useState<string>(() => {
    if (typeof window === "undefined") return defaultLocale;
    return localStorage.getItem("public_locale") || defaultLocale;
  });

  const setLocale = useCallback(
    (newLocale: string) => {
      setLocaleState(newLocale);
      if (typeof window !== "undefined") {
        localStorage.setItem("public_locale", newLocale);
      }
      queryClient.invalidateQueries({ queryKey: ["public-news", slug] });
      queryClient.invalidateQueries({ queryKey: ["public-highlights", slug] });
      queryClient.invalidateQueries({ queryKey: ["public-sponsors", slug] });
      queryClient.invalidateQueries({ queryKey: ["public-about", slug] });
      queryClient.invalidateQueries({ queryKey: ["public-home", slug] });
    },
    [queryClient, slug],
  );

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextType {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
