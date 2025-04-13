"use client";

import { useState } from "react";
import { Post } from "@/types/post";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { postService } from "@/services/postService";

interface PostTimelineProps {
  posts: Post[];
  onPostDeleted?: () => void;
}

export default function PostTimeline({ posts, onPostDeleted }: PostTimelineProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const handleDelete = async (postId: string) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;

    setIsDeleting(postId);
    try {
      await postService.deletePost(postId);
      if (onPostDeleted) {
        onPostDeleted();
      }
    } catch (error) {
      console.error("Erro ao excluir post:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao excluir post. Tente novamente.";
      
      if (errorMessage.includes("sessão expirou")) {
        // Redirecionar para a página de login se a sessão expirou
        router.push("/login");
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    try {
      const postData = {
        title: "Novo Post", // Título padrão ou você pode adicionar um campo para o usuário definir
        content: newPostContent,
      };

      const createdPost = await postService.createPost(postData);
      setPosts((prevPosts) => [createdPost, ...prevPosts]);
      setNewPostContent("");
      setIsCreatingPost(false);
    } catch (error) {
      console.error("Erro ao criar post:", error);
    }
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800 hover:border-purple-500 transition-colors duration-200 cursor-pointer"
          onClick={() => router.push(`/posts/${post.id}`)}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {post.authorId.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-purple-400 hover:text-purple-300 transition-colors duration-200">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Por {post.authorId} em{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="relative">
                  <button
                    className="p-2 text-gray-400 hover:text-purple-400 rounded-full hover:bg-gray-800 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      const menu = document.getElementById(`menu-${post.id}`);
                      if (menu) {
                        menu.classList.toggle("hidden");
                      }
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>

                  <div
                    id={`menu-${post.id}`}
                    className="hidden absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg border border-gray-800 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => router.push(`/posts/${post.id}/edit`)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors duration-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={isDeleting === post.id}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors duration-200 disabled:opacity-50"
                      >
                        {isDeleting === post.id ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400 mr-2"></div>
                            Excluindo...
                          </div>
                        ) : (
                          "Excluir"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 prose prose-invert max-w-none">
                <div className="text-gray-300 line-clamp-3">{post.content}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 