"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { postService } from "@/services/postService";
import dynamic from "next/dynamic";

const MarkdownViewer = dynamic(
  () => import("@/components/MarkdownViewer"),
  { ssr: false }
);

interface PostDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailsPage({ params }: PostDetailsPageProps) {
  const { id } = use(params);
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getPostById(id);
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;

    setIsDeleting(true);
    try {
      await postService.deletePost(id);
      router.push("/posts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir post");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Carregando post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-300">Post não encontrado</p>
          <button
            onClick={() => router.push("/posts")}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Voltar para posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-purple-400">{post.title}</h1>
              <p className="mt-2 text-gray-400">
                Por {post.authorId} em {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => router.push(`/posts/${id}/edit`)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 border border-gray-700 hover:text-purple-400 transition-colors duration-200"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-800 text-red-400 rounded hover:bg-gray-700 border border-gray-700 hover:text-red-300 transition-colors duration-200 disabled:opacity-50"
              >
                {isDeleting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-400 mr-2"></div>
                    Excluindo...
                  </div>
                ) : (
                  "Excluir"
                )}
              </button>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <MarkdownViewer content={post.content} />
          </div>
        </div>
      </div>
    </div>
  );
} 