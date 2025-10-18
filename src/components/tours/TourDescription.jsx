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
    return (
      <p className="text-gray-700 whitespace-pre-wrap text-base xl:text-lg">
        {description}
      </p>
    );
  }
  return null;
}
