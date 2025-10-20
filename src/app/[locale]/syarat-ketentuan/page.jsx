import { getTranslations } from "next-intl/server";
import SyaratKetentuanClient from "./client";

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: "terms.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SyaratKetentuanPage() {
  return <SyaratKetentuanClient />;
}
