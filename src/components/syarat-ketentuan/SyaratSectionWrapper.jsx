import SyaratSection from "./TermSection";
import { prisma } from "@/lib/prisma";

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
    return null;
  }
}

export default async function SyaratSectionWrapper() {
  const terms = await getTerms();
  return <SyaratSection terms={terms || undefined} />;
}
