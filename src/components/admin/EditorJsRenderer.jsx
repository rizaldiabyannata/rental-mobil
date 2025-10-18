import React from "react";

function renderBlock(block) {
  switch (block.type) {
    case "header":
      return React.createElement(
        `h${block.data.level}`,
        { key: block.id, className: "font-bold mt-4 mb-2 text-emerald-800" },
        block.data.text
      );
    case "paragraph":
      return (
        <p key={block.id} className="mb-2 text-gray-700">
          {block.data.text}
        </p>
      );
    case "list": {
      // Editor.js list items can be strings or objects (with content)
      const renderListItem = (item, i) => {
        if (typeof item === "string") return <li key={i}>{item}</li>;
        if (item && typeof item === "object" && "content" in item)
          return <li key={i}>{item.content}</li>;
        return null;
      };
      if (block.data.style === "ordered") {
        return (
          <ol key={block.id} className="list-decimal ml-6 mb-2">
            {block.data.items.map(renderListItem)}
          </ol>
        );
      }
      return (
        <ul key={block.id} className="list-disc ml-6 mb-2">
          {block.data.items.map(renderListItem)}
        </ul>
      );
    }
    default:
      return null;
  }
}

export default function EditorJsRenderer({ data }) {
  if (!data || !Array.isArray(data.blocks)) return null;
  return <div>{data.blocks.map(renderBlock)}</div>;
}
