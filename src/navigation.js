import { createNavigation } from "next-intl/navigation";

export const locales = ["id", "en"];
export const defaultLocale = "id";
export const localePrefix = "as-needed";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({
    locales,
    defaultLocale,
    localePrefix,
  });
