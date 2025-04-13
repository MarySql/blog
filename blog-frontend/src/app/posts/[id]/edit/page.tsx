"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { postService } from "@/services/postService";
import dynamic from "next/dynamic";

const MarkdownEditor = dynamic(
  () => import("@/components/MarkdownEditor"),
  { ssr: false }
);

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = use(params);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await postService.getPostById(id);
        setTitle(post.title);
        setContent(post.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar post");
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await postService.updatePost(id, {
        title,
        content,
      });
      router.push(`/posts/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-400">Editar Post</h1>
          <button
            onClick={() => router.push(`/posts/${id}`)}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 border border-gray-700"
          >
            Cancelar
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300"
              >
                Título
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-300"
              >
                Conteúdo
              </label>
              <div className="mt-1">
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  className="min-h-[400px] bg-gray-800 border border-gray-700 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Salvar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 