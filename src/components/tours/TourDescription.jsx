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

    // Create a temporary DOM element to decode HTML entities and strip tags
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = description;

    // Get the text content (strips all HTML tags and decodes entities)
    let cleanDesc = tempDiv.textContent || tempDiv.innerText || "";

    // Additional cleanup for any remaining whitespace issues
    cleanDesc = cleanDesc
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing whitespace

    return (
      <p className="text-gray-700 whitespace-pre-wrap text-base xl:text-lg">
        {cleanDesc}
      </p>
    );
  }
  return null;
}
