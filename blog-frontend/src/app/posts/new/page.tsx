"use client";

import { useState } from "react";
import { useAuth } from "~/context/AuthContext";
import { useRouter } from "next/navigation";
import MarkdownEditor from "~/components/MarkdownEditor";
import { createPost } from "~/lib/api";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost({ title, content });
      router.push("/posts");
    } catch (err) {
      setError("Erro ao criar post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Novo Post</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Conteúdo (Markdown)</label>
          <MarkdownEditor value={content} onChange={setContent} />
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Criar Post
        </button>
      </form>
    </div>
  );
}