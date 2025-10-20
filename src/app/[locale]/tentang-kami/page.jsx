import { getTranslations } from "next-intl/server";
import TentangKamiClient from "./client";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutUs.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function TentangKamiPage({ params }) {
  const { locale } = params;
  return <TentangKamiClient locale={locale} />;
}
