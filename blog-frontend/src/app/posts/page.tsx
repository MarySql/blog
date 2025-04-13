"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { postService } from "@/services/postService";
import PostTimeline from "@/components/PostTimeline";
import { useAuth } from "@/context/AuthContext";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const data = await postService.getAllPosts();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchPosts();
  }, []);

  const handlePostDeleted = () => {
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Carregando ideias...</p>
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
            onClick={() => fetchPosts()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-400">Explorar Ideias</h1>
          {user && (
            <button
              onClick={() => router.push("/posts/new")}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
            >
              Postar
            </button>
          )}
        </div>

        <PostTimeline posts={posts} onPostDeleted={handlePostDeleted} />
      </div>
    </div>
  );
} 