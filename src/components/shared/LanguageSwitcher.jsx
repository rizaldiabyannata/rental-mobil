"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <Link
        href={pathname}
        locale="id"
        className={`${
          locale === "id" ? "font-bold text-emerald-600" : "text-gray-500"
        } hover:text-emerald-500 transition-colors`}
      >
        ID
      </Link>
      <div className="h-4 w-px bg-gray-300" />
      <Link
        href={pathname}
        locale="en"
        className={`${
          locale === "en" ? "font-bold text-emerald-600" : "text-gray-500"
        } hover:text-emerald-500 transition-colors`}
      >
        EN
      </Link>
    </div>
  );
}
