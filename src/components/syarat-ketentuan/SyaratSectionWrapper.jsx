import SyaratSection from "./SyaratSection";

async function fetchTerms() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || ""
      }/api/public/terms-conditions?category=${encodeURIComponent(
        "Syarat dan Ketentuan"
      )}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = await res.json();
    // prefer grouped terms under the category
    const grouped = json?.data?.terms || {};
    const list = grouped["Syarat dan Ketentuan"] || json?.data?.allTerms || [];
    return list.map((t) => ({
      id: t.id,
      title: t.title,
      content: t.content,
      order: t.order,
    }));
  } catch (e) {
    console.error("Failed to fetch terms:", e);
    return null;
  }
}

export default async function SyaratSectionWrapper() {
  const terms = await fetchTerms();
  return <SyaratSection terms={terms || undefined} />;
}
