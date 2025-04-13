"use client";

import React, { useEffect, useRef } from "react";
import SimpleMDE from "easymde";
import "easymde/dist/easymde.min.css";

interface MarkdownEditorProps {
   value: string;
   onChange: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => { 
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const easyMdeRef = useRef<SimpleMDE | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      easyMdeRef.current = new SimpleMDE({
        element: textareaRef.current,
        initialValue: value,
        toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "side-by-side", "fullscreen"],
      });

      easyMdeRef.current.codemirror.on("change", () => {
        onChange(easyMdeRef.current?.value() || "");
      });
    }

    return () => {
      easyMdeRef.current?.toTextArea();
    };
  }, []);

  return <textarea ref={textareaRef} />;
}

export default MarkdownEditor;