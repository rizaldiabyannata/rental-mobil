import { getTranslations } from "next-intl/server";
import SyaratKetentuanClient from "./client";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: "terms.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

async function getTerms() {
  try {
    const terms = await prisma.termsAndConditions.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        category: true,
        title: true,
        content: true,
        order: true,
      },
    });
    return terms;
  } catch (error) {
    console.error("Failed to fetch terms directly:", error);
    return [];
  }
}

async function getFaqs() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: "asc" },
      select: {
        question: true,
        answer: true,
        order: true,
      },
    });
    return faqs;
  } catch (error) {
    console.error("Failed to fetch FAQs directly:", error);
    return [];
  }
}

export default async function SyaratKetentuanPage() {
  const terms = await getTerms();
  const faqs = await getFaqs();
  return <SyaratKetentuanClient terms={terms} faqs={faqs} />;
}
