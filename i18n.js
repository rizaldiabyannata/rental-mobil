import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // This can be configured to load from a CMS, database, etc.
  // For now, we'll just load from the local JSON files.
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
