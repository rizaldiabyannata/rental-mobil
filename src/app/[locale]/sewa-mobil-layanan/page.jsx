import { getTranslations } from "next-intl/server";
import SewaMobilLayananClient from "./client";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SewaMobilLayananPage({ params }) {
  const { locale } = params;
  return <SewaMobilLayananClient locale={locale} />;
}
