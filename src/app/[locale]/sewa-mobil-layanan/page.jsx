import { getTranslations } from "next-intl/server";
import SewaMobilLayananClient from "./client";

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: "servicesPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SewaMobilLayananPage() {
  return <SewaMobilLayananClient />;
}
