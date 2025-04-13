"use client";

import { useEffect, useRef } from "react";
import SimpleMDE from "simplemde";
import "simplemde/dist/simplemde.min.css";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function MarkdownEditor({ value, onChange, className }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const simpleMDERef = useRef<SimpleMDE | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (textareaRef.current && !simpleMDERef.current) {
      simpleMDERef.current = new SimpleMDE({
        element: textareaRef.current,
        initialValue: value,
        spellChecker: false,
        toolbar: [
          "bold",
          "italic",
          "heading",
          "|",
          "quote",
          "unordered-list",
          "ordered-list",
          "|",
          "link",
          "image",
          "|",
          "preview",
          "side-by-side",
          "fullscreen",
          "|",
          "guide"
        ]
      });

      simpleMDERef.current.codemirror.on("change", () => {
        if (simpleMDERef.current) {
          onChange(simpleMDERef.current.value());
        }
      });
    }

    return () => {
      if (simpleMDERef.current) {
        simpleMDERef.current.toTextArea();
        simpleMDERef.current = null;
      }
    };
  }, [onChange, value]);

  useEffect(() => {
    if (simpleMDERef.current && simpleMDERef.current.value() !== value) {
      simpleMDERef.current.value(value);
    }
  }, [value]);

  return (
    <div className={className}>
      <textarea ref={textareaRef} defaultValue={value} />
    </div>
  );
}