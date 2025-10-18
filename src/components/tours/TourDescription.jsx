"use client";
import dynamic from "next/dynamic";
const EditorJsRenderer = dynamic(
  () => import("@/components/admin/EditorJsRenderer"),
  { ssr: false }
);

export default function TourDescription({ description }) {
  if (typeof description === "object" && description?.blocks) {
    return <EditorJsRenderer data={description} />;
  }
  if (typeof description === "string") {
    try {
      const parsed = JSON.parse(description);
      if (parsed?.blocks) return <EditorJsRenderer data={parsed} />;
    } catch {}
    // Clean common HTML entities and symbols for cleaner rendering
    let cleanDesc = description
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/<[^>]+>/g, ""); // Remove any remaining HTML tags
    return (
      <p className="text-gray-700 whitespace-pre-wrap text-base xl:text-lg">
        {cleanDesc}
      </p>
    );
  }
  return null;
}
