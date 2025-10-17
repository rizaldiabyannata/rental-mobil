import FaqSection from "./FaqSection";
import { prisma } from "@/lib/prisma";

async function getFaqs() {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      select: {
        question: true,
        answer: true,
      },
    });
    return faqs;
  } catch (error) {
    console.error("Failed to fetch FAQs directly:", error);
    return null;
  }
}

export default async function FaqSectionWrapper() {
  const faqs = await getFaqs();
  return <FaqSection faqs={faqs || undefined} />;
}