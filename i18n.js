import { getRequestConfig } from 'next-intl/server';

export const locales = ['id', 'en'];
export const defaultLocale = 'id';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) {
    return {
      messages: (await import(`./messages/${defaultLocale}.json`)).default
    };
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
