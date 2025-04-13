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
        ],
        status: false,
        autofocus: false,
        forceSync: true
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
  }, []);

  useEffect(() => {
    if (simpleMDERef.current && simpleMDERef.current.value() !== value) {
      const cursor = simpleMDERef.current.codemirror.getCursor();
      simpleMDERef.current.value(value);
      simpleMDERef.current.codemirror.setCursor(cursor);
    }
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <textarea ref={textareaRef} defaultValue={value} />
      <style jsx global>{`
        .CodeMirror {
          height: 150px !important;
          max-height: 300px !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 0.375rem !important;
          font-family: inherit !important;
        }
        .CodeMirror-focused {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
        }
        .editor-toolbar {
          border: 1px solid #e5e7eb !important;
          border-radius: 0.375rem 0.375rem 0 0 !important;
          background-color: #f9fafb !important;
        }
        .editor-toolbar button {
          color: #4b5563 !important;
        }
        .editor-toolbar button:hover {
          background-color: #f3f4f6 !important;
        }
        .editor-toolbar button.active {
          background-color: #e5e7eb !important;
        }
      `}</style>
    </div>
  );
}