'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (nextLocale) => {
    // pathname might be /id/about or /en/about, we need to remove the locale part
    const newPath = `/${nextLocale}${pathname.substring(3) || '/'}`;
    router.replace(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={locale === 'id' ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => switchLocale('id')}
        aria-label="Switch to Indonesian"
      >
        <span role="img" aria-label="Indonesian Flag">🇮🇩</span>
      </Button>
      <Button
        variant={locale === 'en' ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => switchLocale('en')}
        aria-label="Switch to English"
      >
        <span role="img" aria-label="British Flag">🇬🇧</span>
      </Button>
    </div>
  );
}
