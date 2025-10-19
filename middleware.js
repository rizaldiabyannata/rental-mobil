import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale
});

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders containing filesBleeding-edge features are not supported in this file.
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
