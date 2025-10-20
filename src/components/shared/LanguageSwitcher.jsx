"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const changeLocale = (nextLocale) => {
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.replace(newPath);
  };

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <button
        onClick={() => changeLocale("id")}
        className={`${
          locale === "id" ? "font-bold text-emerald-600" : "text-gray-500"
        } hover:text-emerald-500 transition-colors`}
      >
        ID
      </button>
      <div className="h-4 w-px bg-gray-300" />
      <button
        onClick={() => changeLocale("en")}
        className={`${
          locale === "en" ? "font-bold text-emerald-600" : "text-gray-500"
        } hover:text-emerald-500 transition-colors`}
      >
        EN
      </button>
    </div>
  );
}
