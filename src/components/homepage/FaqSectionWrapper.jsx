import FaqSection from "./FaqSection";
import { prisma } from "@/lib/prisma";

async function getFaqs() {
  try {
    // Model name is `FAQ` in Prisma schema, so the client accessor is `fAQ`
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
    return null;
  }
}

export default async function FaqSectionWrapper() {
  const faqs = await getFaqs();
  return <FaqSection faqs={faqs || undefined} />;
}
