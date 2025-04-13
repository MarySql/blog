"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { postService } from "@/services/postService";
import { Post } from "@/types/post";
import dynamic from "next/dynamic";

const MarkdownEditor = dynamic(
  () => import("@/components/MarkdownEditor"),
  { ssr: false }
);

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchPost = async () => {
      try {
        const data = await postService.getPostById(id);
        setPost(data);
      } catch (err) {
        setError("Erro ao carregar post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    setSaving(true);
    try {
      await postService.updatePost(id, {
        title: post.title,
        content: post.content
      });
      router.push(`/posts/${id}`);
    } catch (err) {
      setError("Erro ao atualizar post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600">Post não encontrado</p>
            <button
              onClick={() => router.push("/posts")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Voltar para posts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Post</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  value={post.title}
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Conteúdo
                </label>
                <div className="mt-1">
                  <MarkdownEditor
                    value={post.content}
                    onChange={(content) => setPost({ ...post, content })}
                    className="min-h-[300px]"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push(`/posts/${id}`)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 