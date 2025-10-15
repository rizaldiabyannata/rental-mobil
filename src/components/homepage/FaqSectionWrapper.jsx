import FaqSection from "./FaqSection";

async function fetchFaqs() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/public/faqs`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = await res.json();
    console.log("Fetched FAQs:", json);
    return json?.data || null;
  } catch (e) {
    console.error("Failed to fetch FAQs:", e);
    return null;
  }
}

export default async function FaqSectionWrapper() {
  const faqs = await fetchFaqs();
  return <FaqSection faqs={faqs || undefined} />;
}
