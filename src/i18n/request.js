import { getRequestConfig } from "next-intl/server";

export const locales = ["id", "en"];
export const defaultLocale = "id";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const selectedLocale = locales.includes(locale) ? locale : defaultLocale;

  return {
    locale: selectedLocale,
    messages: (await import(`../../messages/${selectedLocale}.json`)).default,
  };
});
