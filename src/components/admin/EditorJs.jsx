import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";

export default function EditorJs({ value, onChange }) {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (instanceRef.current) return;
    instanceRef.current = new EditorJS({
      holder: editorRef.current,
      data: value || {},
      onChange: async () => {
        const data = await instanceRef.current.save();
        onChange(data);
      },
      autofocus: true,
      tools: {
        header: require("@editorjs/header"),
        list: require("@editorjs/list"),
        paragraph: require("@editorjs/paragraph"),
      },
    });
    return () => {
      if (instanceRef.current && instanceRef.current.destroy) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  // Editor.js does not support dynamic re-rendering via a render method.
  // If you need to update the editor data, you must destroy and re-initialize the instance.

  return (
    <div
      id="editorjs"
      ref={editorRef}
      className="border rounded p-2 min-h-[200px]"
    />
  );
}
