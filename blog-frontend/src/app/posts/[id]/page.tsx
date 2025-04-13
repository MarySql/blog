"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MarkdownViewer from "@/components/MarkdownViewer";

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  createdAt: string;
}

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`http://localhost:8080/api/posts/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Erro ao carregar post");
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error("Erro ao carregar post:", err);
        setError(err instanceof Error ? err.message : "Erro ao carregar post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Post não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href="/posts"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          ← Voltar para Posts
        </Link>
      </div>

      <article className="prose max-w-none">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-500 text-sm mb-8">
          Por {post.author.username} em{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div className="border-t pt-8">
          <MarkdownViewer content={post.content} />
        </div>
      </article>
    </div>
  );
} 