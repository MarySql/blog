"use client";

import { useState } from "react";
import MarkdownEditor from "~/components/MarkdownEditor";
import MarkdownViewer from "~/components/MarkdownViewer";

export default function Home() {
  const [content, setContent] = useState("# Olá\nEste é um **teste** em Markdown.");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Editor de Markdown</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl mb-2">Editor</h2>
          <MarkdownEditor value={content} onChange={setContent} />
        </div>
        <div>
          <h2 className="text-xl mb-2">Visualização</h2>
          <MarkdownViewer content={content} />
        </div>
      </div>
    </div>
  );
}