"use client";

import { useState } from "react";
import Link from "next/link";
import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownViewer from "@/components/MarkdownViewer";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Você precisa estar logado para criar um post");
      }

      const response = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar post");
      }

      // Redirecionar para a lista de posts
      window.location.href = "/posts";
    } catch (err) {
      console.error("Erro ao criar post:", err);
      setError(err instanceof Error ? err.message : "Erro ao criar post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Novo Post</h1>
        <Link
          href="/posts"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          Voltar para Posts
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Conteúdo
            </label>
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              {isPreview ? "Editar" : "Preview"}
            </button>
          </div>

          {isPreview ? (
            <div className="prose max-w-none p-4 border rounded-md">
              <MarkdownViewer content={content} />
            </div>
          ) : (
            <div className="border rounded-md">
              <MarkdownEditor
                value={content}
                onChange={setContent}
                className="min-h-[400px] w-full"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Criando..." : "Criar Post"}
        </button>
      </form>
    </div>
  );
}